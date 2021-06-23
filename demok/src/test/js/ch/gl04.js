
describe('gl04', function() {

  it('should be displayed', function(done) {

    init();

    var demo = window.demo;

    demo.init();
/*
    var ctx = demo.ctx;
    expect(typeof ctx).toBe('object');
    ctx.fillStyle = 'red';
    ctx.fillRect(50, 50, 100, 100);
*/
    
    demo.waitFor(done);
  });
  
});

var init = function() {

  var demo = window.demo;

  var mat4 = require('./mat4.js');

  demo.width = 400;
  demo.height = 100;

  demo.initCtx = function(canvas) {

    var createShader = function(type, source) {
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      if (success) {
        return shader;
      }
      var msg = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw msg;
    };

    var createProgram = function(vertexShader, fragmentShader) {
      var program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      var success = gl.getProgramParameter(program, gl.LINK_STATUS);
      if (success) {
        return program;
      }
      var msg = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw msg;
    };

    var gl = canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl',
          { preserveDrawingBuffer: true });

    var vertexShader = createShader(gl.VERTEX_SHADER, `

attribute vec4 aPosition;
uniform mat4 uMatrix;

attribute vec3 aNormal;
varying vec3 vNormal;

void main() {
  gl_Position = uMatrix * aPosition;
  vNormal = aNormal;
}

    `); //-----------------------------------------------------

    var fragmentShader = createShader(gl.FRAGMENT_SHADER, `

precision mediump float;

varying vec3 vNormal;
uniform vec3 uReverseLightDirection;

uniform vec4 uColor;

void main() {
  vec3 normal = normalize(vNormal);
  float light = dot(normal, uReverseLightDirection);
  gl_FragColor = uColor;
  gl_FragColor.rgb *= (light * 0.5 + 0.5);
}

    `); //-----------------------------------------------------

    var program = createProgram(vertexShader, fragmentShader);
    gl.useProgram(program);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);

    this.ctx = gl;

    var uColorLoc = gl.getUniformLocation(program, 'uColor');
    var aPositionLoc = gl.getAttribLocation(program, 'aPosition');
    var uMatrixLoc = gl.getUniformLocation(program, 'uMatrix');

    var aNormalLoc = gl.getAttribLocation(program, 'aNormal');
    var uReverseLightDirectionLoc =
      gl.getUniformLocation(program, 'uReverseLightDirection');
    gl.uniform3f(uReverseLightDirectionLoc, 0, 1, 0);

    gl.enableVertexAttribArray(aPositionLoc);
    gl.enableVertexAttribArray(aNormalLoc);

    var posBuf = gl.createBuffer();
    var nrmBuf = gl.createBuffer();

    var numDivs = 400;
    var r = 0.7;
    var pos = [
      0.5, 0.0, r, 1,
      -0.3, 0.0, r, 1,
      0.0, 0.1, r, 1
    ];
    var nrm = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1
    ];
    var random = function() {
      var x = 0.12;
      var a = 1.79;
      return function() {
        x = ( (x + a) * x) % 1;
        return x;
      };
    }();

    var m = mat4();
    for (var i = 1; i < numDivs; i += 1) {
      var rx = Math.PI * random();
      var ry = Math.PI * random();
      var rz = Math.PI * random();
      m = m.rotateX(rx).rotateY(ry).rotateZ(rz);
      pos = pos.concat(m.transform(pos.slice(0, 4) ) );
      pos = pos.concat(m.transform(pos.slice(4, 8) ) );
      pos = pos.concat(m.transform(pos.slice(8, 12) ) );
      nrm = nrm.concat(m.transform(nrm.slice(0, 3) ) );
      nrm = nrm.concat(m.transform(nrm.slice(3, 6) ) );
      nrm = nrm.concat(m.transform(nrm.slice(6, 9) ) );
    }

    pos.forEach(function(v, i) {
      if (i % 4 == 3) {
        expect(v).toBe(1);
      }
    });

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
    gl.vertexAttribPointer(aPositionLoc, 4, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, nrmBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nrm), gl.STATIC_DRAW);
    gl.vertexAttribPointer(aNormalLoc, 3, gl.FLOAT, false, 0, 0);

    this.enterFrame = function(time) {

      var gl = this.ctx;

      var t = 2 * Math.PI * (time - this.startTime) / 100;
      var m = mat4()
        .rotateX(0.13 * t)
        .rotateY(0.15 * t)
        .rotateZ(0.17 * t);
      var w = mat4()
        .scaleX(gl.canvas.height / gl.canvas.width);
      var direct = [ -1, 1, 0 ];

      gl.clearColor(0, 0, 0, 0.5);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.uniformMatrix4fv(uMatrixLoc, false, m.concat(w) );

      //gl.uniform3f(uReverseLightDirectionLoc, 0, 1, 0);
      gl.uniform3fv(uReverseLightDirectionLoc,
          m.invert().transform(direct) );

      // green triangles
      gl.uniform4f(uColorLoc, 0, 1, 0, 1);
      gl.drawArrays(gl.TRIANGLES, 0, pos.length / 4);

      [
        {tx : -r * 2, ty : 0, color: [1, 0, 0, 1]},
        {tx :  r * 2, ty : 0, color: [0, 0, 1, 1]},
        {tx : 0, ty : -r * 2, color: [1, 1, 0, 1]},
        {tx : 0, ty :  r * 2, color: [0, 1, 1, 1]}
      ].forEach(function(opts) {

        var mat = m
          .translateX(opts.tx)
          .translateY(opts.ty);

        gl.uniformMatrix4fv(uMatrixLoc, false, mat.concat(w) );

        //gl.uniform3f(uReverseLightDirectionLoc, 0, 1, 0);
        gl.uniform3fv(uReverseLightDirectionLoc,
            m.invert().transform(direct) );

        gl.uniform4fv(uColorLoc, opts.color);
        gl.drawArrays(gl.TRIANGLES, 0, pos.length / 4);
      });

    };
  };
};

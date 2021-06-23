
describe('gl07', function() {

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

  demo.width = 300;
  demo.height = 200;

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

attribute vec2 aTexcoord;
varying vec2 vTexcoord;

void main() {
  gl_Position = uMatrix * aPosition;
  vTexcoord = aTexcoord;
}

    `); //-----------------------------------------------------

    var fragmentShader = createShader(gl.FRAGMENT_SHADER, `

precision mediump float;

varying vec2 vTexcoord;
uniform sampler2D uTexture;

void main() {
  gl_FragColor = texture2D(uTexture, vTexcoord);
}

    `); //-----------------------------------------------------

    var program = createProgram(vertexShader, fragmentShader);
    gl.useProgram(program);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);

    this.ctx = gl;

//    var uColorLoc = gl.getUniformLocation(program, 'uColor');
    var aPositionLoc = gl.getAttribLocation(program, 'aPosition');
    var uMatrixLoc = gl.getUniformLocation(program, 'uMatrix');

    gl.enableVertexAttribArray(aPositionLoc);

    var imgCanvas = createTestCanvas(256);
    document.body.appendChild(imgCanvas);

    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture() );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    /*
    gl.REPEAT (default value),gl.CLAMP_TO_EDGE, gl.MIRRORED_REPEAT
    */
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
/*
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
*/
    /*
*/
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
        gl.RGBA,gl.UNSIGNED_BYTE, imgCanvas);
    gl.generateMipmap(gl.TEXTURE_2D);

    var aTexcoordLoc = gl.getAttribLocation(program, 'aTexcoord');
    gl.enableVertexAttribArray(aTexcoordLoc);

    var txtArr = [];
    var posArr = [];

    !function() {

      var r = 0.8;

      var vDiv = 16;
      var hDiv = vDiv * 2;
      var getPoint = function(h, v) {
        var t = Math.PI * v / vDiv;
        var p = 2 * Math.PI * h / hDiv + Math.PI / 2;
        return [
          r * Math.cos(p) * Math.sin(t),
          r * Math.cos(t),
          r * Math.sin(p) * Math.sin(t),
        ];
      };

      for (var v = 0; v <= vDiv; v += 1) {
        for (var h = 0; h < hDiv; h += 1) {
          var v1 = v == 0? 0 : v - 1 + h / hDiv;
          var v2 = v == vDiv? vDiv : v + h / hDiv;
          posArr = posArr
            .concat(getPoint(h, v1) )
            .concat(getPoint(h, v2) );
          txtArr = txtArr
            .concat([ h / hDiv, v1 / vDiv ])
            .concat([ h / hDiv, v2 / vDiv ]);
        }
      }

    }();

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer() );
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(txtArr), gl.STATIC_DRAW);
    gl.vertexAttribPointer(aTexcoordLoc, 2, gl.FLOAT, false, 0, 0);

    var posBuf = gl.createBuffer();

    this.enterFrame = function(time) {

      var gl = this.ctx;

      gl.clearColor(0, 0, 0, 0.5);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      var rot = mat4()
        .rotateX(2 * Math.PI * (time - this.startTime) / 500)
        .rotateY(2 * Math.PI * (time - this.startTime) / 700)
        .rotateZ(2 * Math.PI * (time - this.startTime) / 1000);
      var w = mat4().scaleX(gl.canvas.height / gl.canvas.width);

      gl.uniformMatrix4fv(uMatrixLoc, false, rot.concat(w) );

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(posArr), gl.STATIC_DRAW);
      gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, posArr.length / 3);
//      gl.drawArrays(gl.LINE_STRIP, 0, posArr.length / 3);

    };
  };
};

var createTestCanvas = function(size) {
  var canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(0, 0, size >> 1, size >> 1);
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(size >> 1, 0, size >> 1, size >> 1);
  ctx.fillStyle = '#0000ff';
  ctx.fillRect(0, size >> 1, size >> 1, size >> 1);
  ctx.fillStyle = '#ffff00';
  ctx.fillRect(size >> 1, size >> 1, size >> 1, size >> 1);

  ctx.fillStyle = '#ffffff';
  ctx.font = (size >> 2) + 'px sans-serif';
  ctx.fillText('WebGL', size >> 4, size >> 1);
  return canvas;
};

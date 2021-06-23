
describe('gl03', function() {

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

void main() {
  gl_Position = uMatrix * aPosition;
}

    `); //-----------------------------------------------------

    var fragmentShader = createShader(gl.FRAGMENT_SHADER, `

precision mediump float;

uniform vec4 uColor;

void main() {
  gl_FragColor = uColor;
}

    `); //-----------------------------------------------------

    var program = createProgram(vertexShader, fragmentShader);
    gl.useProgram(program);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    this.ctx = gl;

    var uColorLoc = gl.getUniformLocation(program, 'uColor');
    var aPositionLoc = gl.getAttribLocation(program, 'aPosition');
    var uMatrixLoc = gl.getUniformLocation(program, 'uMatrix');

    gl.enableVertexAttribArray(aPositionLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer() );

    this.enterFrame = function(time) {

      var gl = this.ctx;

      gl.clearColor(0, 0, 0, 0.5);
      gl.clear(gl.COLOR_BUFFER_BIT);


      /*
      mat = mat.rotateX(0.21);
      mat = mat.rotateY(0.22);
      mat = mat.rotateZ(0.23);
      */
      var mat = mat4().rotateZ(2 * Math.PI * (time - this.startTime) / 1000);
      gl.uniformMatrix4fv(uMatrixLoc, false, mat);

      // blue triangle
      gl.bufferData(gl.ARRAY_BUFFER,
          new Float32Array([
            0, 0,
            0.5, 0,
            0.5, 0.5 ]), gl.STATIC_DRAW);
      gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);
      gl.uniform4f(uColorLoc, 0, 0, 1, 1);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // red triangle
      gl.bufferData(gl.ARRAY_BUFFER,
          new Float32Array([
            0, 0, 0,
            0.5, 0, 0,
            0.5, -0.5, 0 ]), gl.STATIC_DRAW);
      gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0);
      gl.uniform4f(uColorLoc, 1, 0, 0, 1);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // green triangle
      gl.bufferData(gl.ARRAY_BUFFER,
          new Float32Array([
            0, 0, 0, 1,
            -0.5, 0, 0, 1,
            -0.5, -0.5, 0, 1 ]), gl.STATIC_DRAW);
      gl.vertexAttribPointer(aPositionLoc, 4, gl.FLOAT, false, 0, 0);
      gl.uniform4f(uColorLoc, 0, 1, 0, 1);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
  };
};

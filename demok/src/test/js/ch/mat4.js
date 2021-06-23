//
// minimum matrix lib
//

'use strict';

var mat4 = function() {

  var fn = {
    concat : function(n) {
      var o = [];
      o.length = 16;
      for (var i = 0; i < o.length; i += 1) {
        var v = 0;
        for (var j = 0; j < 4; j += 1) {
          v += this[~~(i / 4) * 4 + j] * n[i % 4 + j * 4];
        }
        o[i] = v;
      }
      return mat4(o);
    },
    transform : function(n) {
      var o = [];
      o.length = n.length;
      for (var i = 0; i < o.length; i += 1) {
        var v = 0;
        for (var j = 0; j < n.length; j += 1) {
          v += this[j * 4 + i] * n[j];
        }
        o[i] = v;
      }
      return o;
    },
    translateX : function(t) {
      return this.concat([
                         1, 0, 0, 0,
                         0, 1, 0, 0,
                         0, 0, 1, 0,
                         t, 0, 0, 1 ]);
    },
    translateY : function(t) {
      return this.concat([
                         1, 0, 0, 0,
                         0, 1, 0, 0,
                         0, 0, 1, 0,
                         0, t, 0, 1 ]);
    },
    translateZ : function(t) {
      return this.concat([
                         1, 0, 0, 0,
                         0, 1, 0, 0,
                         0, 0, 1, 0,
                         0, 0, t, 1 ]);
    },
    scaleX : function(s) {
      return this.concat([
                         s, 0, 0, 0,
                         0, 1, 0, 0,
                         0, 0, 1, 0,
                         0, 0, 0, 1 ]);
    },
    scaleY : function(s) {
      return this.concat([
                         1, 0, 0, 0,
                         0, s, 0, 0,
                         0, 0, 1, 0,
                         0, 0, 0, 1 ]);
    },
    scaleZ : function(s) {
      return this.concat([
                         1, 0, 0, 0,
                         0, 1, 0, 0,
                         0, 0, s, 0,
                         0, 0, 0, 1 ]);
    },
    rotateX : function(r) {
      var c = Math.cos(r);
      var s = Math.sin(r);
      return this.concat([
                         1, 0, 0, 0,
                         0, c, s, 0,
                         0,-s, c, 0,
                         0, 0, 0, 1 ]);
    },
    rotateY : function(r) {
      var c = Math.cos(r);
      var s = Math.sin(r);
      return this.concat([
                         c, 0,-s, 0,
                         0, 1, 0, 0,
                         s, 0, c, 0,
                         0, 0, 0, 1 ]);
    },
    rotateZ : function(r) {
      var c = Math.cos(r);
      var s = Math.sin(r);
      return this.concat([
                         c, s, 0, 0,
                        -s, c, 0, 0,
                         0, 0, 1, 0,
                         0, 0, 0, 1 ]);
    },
    translate : function(t) {
      return this
        .translateX(t.x || 0)
        .translateY(t.y || 0)
        .translateZ(t.z || 0);
    },
    scale : function(s) {
      if (typeof s == 'number') {
        return this.scale({ x: s, y: s, z: s });
      }
      return this
        .scaleX(s.x || 1)
        .scaleY(s.y || 1)
        .scaleZ(s.z || 1);
    },
    transpose : function() {
      var m = this;
      return m.map(function(v, i) {
        return m[(i % 4) * 4 + ~~(i / 4)];
      });
    },
    invert : function() {
      // http://stackoverflow.com/questions/1148309/inverting-a-4x4-matrix
      var m = this;
      var inv = [
        m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] +
          m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10],
        -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] -
          m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10],
        m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] +
          m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6],
        -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] -
          m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6],
        -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] -
          m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10],
        m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] +
          m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10],
        -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] -
          m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6],
        m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] +
          m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6],
        m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] +
          m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9],
        -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] -
          m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9],
        m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] +
          m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5],
        -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] -
          m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5],
        -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] -
          m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9],
        m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] +
          m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9],
        -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] -
          m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5],
        m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] +
          m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5]
      ];
      var det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
      return mat4(inv.map(function(v) { return v / det; }) );
    }
  };

  fn.__proto__ = [].__proto__;

  var identity = function() {
    return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
  };

  return function(m) {
    m = m || identity();
    m.__proto__ = fn;
    return m;
  };
}();

if (typeof exports === 'object') {
  module.exports = mat4;
}

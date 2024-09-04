
'use strict'
window.addEventListener('load', function() {

  var ctx = document.createElement('canvas').getContext('2d');
  document.body.appendChild(ctx.canvas);
  var width = 400;
  var height = 400;
  var d = -200; // depth
  var m = 200; // max depth
  var r = 1;
  var er = [50, 0, d]; // eye-right
  var el = [-50, 0, d]; // eye-left
//  var debug = true;
  var debug = false;

  var f = function(x, y) {
//    return 200;
    return (x * x + y * y) < 400? 100 : 200;
  };

  ctx.canvas.style.position = 'absolute';
  ctx.canvas.style.left = '400px';
  ctx.canvas.style.top = '100px';

  ctx.canvas.width = width;
  ctx.canvas.height = height;
  ctx.translate(width / 2, height / 2);

  if (debug) {
    ctx.strokeStyle = '#ccc';
    ctx.beginPath();
    ctx.moveTo(-width / 2, 0);
    ctx.lineTo(width / 2, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -height / 2);
    ctx.lineTo(0, height / 2);
    ctx.stroke();

    ctx.strokeStyle = '#00f';
    ctx.beginPath();
    ctx.arc(el[0], el[1], 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(er[0], er[1], 5, 0, Math.PI * 2);
    ctx.stroke();
  }

  var len2 = function(p0, p1) {
    var pm = [p0[0] - p1[0], p0[1] - p1[1], p0[2] - p1[2]];
    return pm[0] * pm[0] + pm[1] * pm[1] + pm[2] * pm[2];
  };
  var rt1 = function(p, e) {
    var pe = [p[0] - e[0], p[1] - e[1], p[2] - e[2]];
    var ratio = -(m - e[2]) / e[2];
    var c = [e[0] + pe[0] * ratio, e[1] + pe[1] * ratio, e[2] + pe[2] * ratio];
    var c0 = c;
    var c1 = p;
    var i = 0;
    while (true) {
      var cm = [(c0[0] + c1[0]) / 2, (c0[1] + c1[1]) / 2, (c0[2] + c1[2]) / 2];
      var zm = f(cm[0], cm[1]);
      var ds = len2(c0, c1);
      i += 1;
      if (ds < 1) {
        var x =c;
        c = c0;
        break;
      }
      if (zm >= cm[2]) {
        c1 = cm;
      } else {
        c0 = cm;
      }
    }

    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.arc(p[0], p[1], r, 0, Math.PI * 2);
    ctx.stroke();
    if (debug) {
      ctx.strokeStyle = '#f90';
      ctx.beginPath();
      ctx.arc(c[0], c[1], 5, 0, Math.PI * 2);
      ctx.stroke();
    }
    return c;
  };

  var rt2 = function(c, e) {
    var ce = [c[0] - e[0], c[1] - e[1], c[2] - e[2]];
    var ratio = -c[2] / (c[2] - e[2]);
    var p = [c[0] + ce[0] * ratio, c[1] + ce[1] * ratio, c[2] + ce[2] * ratio];
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.arc(p[0], p[1], r, 0, Math.PI * 2);
    ctx.stroke();
    return p;
  };

  var rtl = function(p) {
    var c;
    c = rt1(p, el);
    p = rt2(c, er);
    c = rt1(p, el);
    p = rt2(c, er);
    c = rt1(p, el);
    p = rt2(c, er);
  };
  var rtr = function(p) {
    var c;
    c = rt1(p, er);
    p = rt2(c, el);
    c = rt1(p, er);
    p = rt2(c, el);
    c = rt1(p, er);
    p = rt2(c, el);
  };
  var rand = function(seed) {
    var a = 4.34567 + seed;
    var b = 3.3435;
    var x = 0.125;
    return function() {
      x = ( (a + x) * b) % 1;
    //  return x;
    return Math.random();
    };
  }(4);

  var p;
  /*
  p = [-20, -15, 0];
  rtl(p);
  rtr(p);
  p = [0, -10, 0];
  rtl(p);
  rtr(p);
  p = [-25, 10, 0];
  rtl(p);
  rtr(p);
  */

  for (var i = 0; i < 1000; i += 1) {
    p = [width * rand() - width / 2, height * rand() - height / 2, 0];
    rtl(p);
    rtr(p);
  }

  /*
  var rd = function() {
    let last = -1 
    var rand = function(a, b) {
      const rnd = a+(b-a+1)*crypto.getRandomValues(new Uint32Array(1))[0]/2**32|0
      if (rnd === last) {
        return rand(a, b)
      } else {
        last = rnd
        return rnd
      }
    };
    return rand;
  }();
  console.log(rd(1,1<<15) );
  console.log(rd(1,1<<15) );
  console.log(rd(1,1<<15) );
  */
});

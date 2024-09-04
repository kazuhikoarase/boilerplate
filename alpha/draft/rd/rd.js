
'use strict'
window.addEventListener('load', function() {

  var params = {
    width : 400,
    height : 400,
    d : -200, // depth
    m : 200, // max depth
    r : 1,
    er : [0, 0, 0], // eye-right
    el : [0, 0, 0], // eye-left
    debug : true
  };
  params.er = [50, 0, params.d]; // eye-right
  params.el = [-50, 0, params.d]; // eye-left

//  var debug = false;

  var f = function(x, y) {
//    return 200;
    return (x * x + y * y) < 400? 100 : 150;
  };

  var ctx = document.createElement('canvas').getContext('2d');
  document.body.appendChild(ctx.canvas);
  ctx.canvas.width = params.width;
  ctx.canvas.height = params.height;
  ctx.translate(params.width / 2, params.height / 2);
  ctx.canvas.style.position = 'absolute';
  ctx.canvas.style.left = 400 + 'px';
  ctx.canvas.style.top = 100 + 'px';

  var ctx2 = document.createElement('canvas').getContext('2d');
  document.body.appendChild(ctx2.canvas);
  ctx2.canvas.width = params.width;
  ctx2.canvas.height = params.height;
  ctx2.translate(params.width / 2, params.height / 2);
  ctx2.canvas.style.position = 'absolute';
  ctx2.canvas.style.left = (400 + params.width) + 'px';
  ctx2.canvas.style.top = 100 +'px';

  if (params.debug) {
    ctx.strokeStyle = '#ccc';
    ctx.beginPath();
    ctx.moveTo(-params.width / 2, 0);
    ctx.lineTo(params.width / 2, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -params.height / 2);
    ctx.lineTo(0, params.height / 2);
    ctx.stroke();

    ctx.strokeStyle = '#00f';
    ctx.beginPath();
    ctx.arc(params.el[0], params.el[1], 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(params.er[0], params.er[1], 5, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (params.debug) {
    ctx2.strokeStyle = '#ccc';
    ctx2.beginPath();
    ctx2.moveTo(-params.width / 2, 0);
    ctx2.lineTo(params.width / 2, 0);
    ctx2.stroke();
    ctx2.beginPath();
    ctx2.moveTo(0, -params.height / 2);
    ctx2.lineTo(0, params.height / 2);
    ctx2.stroke();

    ctx2.strokeStyle = '#00f';
    ctx2.beginPath();
    ctx2.arc(params.el[0], params.el[2], 5, 0, Math.PI * 2);
    ctx2.stroke();
    ctx2.beginPath();
    ctx2.arc(params.er[0], params.er[2], 5, 0, Math.PI * 2);
    ctx2.stroke();

    ctx2.strokeStyle = '#f00';
    for (var x = -params.width / 2; x < params.width / 2; x += 2) {
      ctx2.beginPath();
      var z = f(x, 0);
      ctx2.arc(x, z, 1, 0, Math.PI * 2);
      ctx2.stroke();
    }
  }

  var len2 = function(p0, p1) {
    var pm = [p0[0] - p1[0], p0[1] - p1[1], p0[2] - p1[2]];
    return pm[0] * pm[0] + pm[1] * pm[1] + pm[2] * pm[2];
  };
  var rt1 = function(p, e) {
    var pe = [p[0] - e[0], p[1] - e[1], p[2] - e[2]];
    var ratio = -(params.m - e[2]) / e[2];
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
    ctx.arc(p[0], p[1], params.r, 0, Math.PI * 2);
    ctx.stroke();

    ctx2.strokeStyle = '#000';
    ctx2.beginPath();
    ctx2.arc(p[0], p[2], params.r, 0, Math.PI * 2);
    ctx2.stroke();

    if (params.debug) {
      ctx.strokeStyle = '#f90';
      ctx.beginPath();
      ctx.arc(c[0], c[1], 5, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (params.debug) {
      ctx2.strokeStyle = '#f90';
      ctx2.beginPath();
      ctx2.arc(c[0], c[2], 5, 0, Math.PI * 2);
      ctx2.stroke();
    }
    return c;
  };

  var rt2 = function(c, e) {
    var ce = [c[0] - e[0], c[1] - e[1], c[2] - e[2]];
    var ratio = -c[2] / (c[2] - e[2]);
    var p = [c[0] + ce[0] * ratio, c[1] + ce[1] * ratio, c[2] + ce[2] * ratio];
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.arc(p[0], p[1], params.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx2.strokeStyle = '#000';
    ctx2.beginPath();
    ctx2.arc(p[0], p[2], params.r, 0, Math.PI * 2);
    ctx2.stroke();
    return p;
  };

  var rtl = function(p) {
    var c;
    c = rt1(p, params.el);
    p = rt2(c, params.er);
    c = rt1(p, params.el);
    p = rt2(c, params.er);
    c = rt1(p, params.el);
    p = rt2(c, params.er);
  };
  var rtr = function(p) {
    var c;
    c = rt1(p, params.er);
    p = rt2(c, params.el);
    c = rt1(p, params.er);
    p = rt2(c, params.el);
    c = rt1(p, params.er);
    p = rt2(c, params.el);
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

  p = [-20, -15, 0];
  rtl(p);
  rtr(p);
  p = [0, -10, 0];
  rtl(p);
  rtr(p);
  p = [-25, 10, 0];
  rtl(p);
  rtr(p);

/*
  for (var i = 0; i < 1000; i += 1) {
    p = [width * rand() - width / 2, height * rand() - height / 2, 0];
    rtl(p);
    rtr(p);
  }
*/
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


'use strict'
window.addEventListener('load', function() {

  var params = {
    width : 800,
    height : 450,
    d : -1600, // depth
    m : 800, // max depth
    r : 0.5,
    e : 200,
    er : [0, 0, 0], // eye-right
    el : [0, 0, 0], // eye-left
    debug : false
  };
  var ew = 50;
  params.er = [params.e, 0, params.d]; // eye-right
  params.el = [-params.e, 0, params.d]; // eye-left

//  params.debug = true;
  var debug = false;

  var f = function(x, y) {
//    return 160;
    var r = Math.sqrt(x * x + y * y);
    return  100 <= r && r <= 200? 500 : 600;
  };

  var ctx = document.createElement('canvas').getContext('2d');
  document.body.appendChild(ctx.canvas);
  ctx.canvas.width = params.width;
  ctx.canvas.height = params.height;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, params.width, params.height);
  ctx.translate(params.width / 2, params.height / 2);
  ctx.canvas.style.position = 'absolute';
  ctx.canvas.style.left = 400 + 'px';
  ctx.canvas.style.top = 100 + 'px';

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
    ctx.strokeRect(-params.width / 2, -params.height / 2, params.width, params.height);

    ctx.strokeStyle = '#00f';
    ctx.beginPath();
    ctx.arc(params.el[0], params.el[1], 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(params.er[0], params.er[1], 5, 0, Math.PI * 2);
    ctx.stroke();
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

      if (params.debug) {
//        console.log(i, c0, c1, cm, ds, zm);

        ctx.strokeStyle = '#f0f';
        ctx.beginPath();
        ctx.arc(c0[0], c0[1], 2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#0f0';
        ctx.beginPath();
        ctx.arc(c1[0], c1[1], 2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#0ff';
        ctx.beginPath();
        ctx.arc(cm[0], cm[1], 5, 0, Math.PI * 2);
        ctx.stroke();
      }

      i += 1;
      if (ds < 1) {
        var x =c;
        c = c0;
        break;
      }
      if ( (cm[2] - zm) * (c0[2] - zm) > 0) {
        c0 = cm;
      } else {
        c1 = cm;
      }
    }

    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.arc(p[0], p[1], params.r, 0, Math.PI * 2);
    ctx.stroke();

    if (params.debug) {
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
    ctx.arc(p[0], p[1], params.r, 0, Math.PI * 2);
    ctx.stroke();
    return p;
  };

  var rtl = function(p) {
    var c;
    for (var i = 0; i < 3; i += 1) {
      c = rt1(p, params.el);
      p = rt2(c, params.er);
    }
  };
  var rtr = function(p) {
    var c;
    for (var i = 0; i < 3; i += 1) {
      c = rt1(p, params.er);
      p = rt2(c, params.el);
    }
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
  */
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

  for (var i = 0; i < 4000; i += 1) {
    p = [params.width * rand() - params.width / 2, params.height * rand() - params.height / 2, 0];
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

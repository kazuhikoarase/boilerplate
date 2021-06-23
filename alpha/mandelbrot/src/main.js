'use strict';

window.addEventListener('load', function() {

  var calc = function() {
    var limit = 2000;
    var x, y, _x, x2, y2, c;
    return function(x0, y0) {
      x = 0;
      y = 0;
      for (c = limit; c >= 0; c -= 1) {
        x2 = x * x;
        y2 = y * y;
        if (x2 + y2 >= 2) {
          break;
        }
        _x = x;
        x = x2 - y2 + x0;
        y = 2 * _x * y + y0;
      }
      return c * 8;
    };
  }();

  var cv = document.createElement('canvas');
  document.body.style.paddng = '0px';
  document.body.style.margin = '0px';
  document.body.appendChild(cv);

  var opts = {
    cx : 0,
    cy : 0,
    scale : 1
  };
  
//  opts = {"cx":0.4379243186116219,
//      "cy":-0.34189200535416603,"scale":7.450580596923828e-9};
//opts = {"cx":0.31106933593749997,"cy":-0.028784179687500005,"scale":0.000244140625};

  var width = 200;
  var height = 200;

/*
  width = 3840;
  height = 2160;
*/

  cv.width = width;
  cv.height = height;
  cv.addEventListener('click', function(event) {
    var scale = opts.scale / (height / 2);
    var sx = (event.clientX - width / 2) * scale + opts.cx;
    var sy = (event.clientY - height / 2) * scale + opts.cy;
    opts.cx = sx;
    opts.cy = sy;
    opts.scale /= 2;
    console.log(JSON.stringify(opts));
    proc.stop();
    proc = start();
  });

  var worker = function(width, height, size) {
    var i = 0;
    var w = Math.floor(width / size);
    var h = Math.floor(height / size);
    var points = w * h;
    return {
      next : function() {
        if (i < points) {
          try {
            return { x : i % w, y : Math.floor(i / w), size : size };
          } finally {
            i += 1;
          }
        } else {
          return null;
        }
      }
    }
  };

  var stepWorker = function(size, handler) {
    var first = true;
    var wk, cur;
    return {
      next : function() {
        if (size < 1) {
          return null;
        }
        if (!wk) {
          wk = worker(width, height, size);
          handler.start(size);
        }
        cur = wk.next();
        if (cur == null) {
          handler.end();
          wk = null;
          first = false;
          size >>= 1;
          return this.next();
        } else if (!first && cur.x % 2 == 0 && cur.y % 2 == 0) {
          // skip
          return this.next();
        }
        return cur;
      }
    };
  };

  var start = function() {

    var active = true;
    var transformed = false;

    var scale = opts.scale / (height / 2);
    var cur, sx, sy, v;

    var ctx = cv.getContext('2d');
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0, 0, width, height);

    var sw = stepWorker(8, {
      start : function(size) {
        ctx.save();
        ctx.transform(size, 0, 0, size, 0, 0);
        transformed = true;
      },
      end : function() {
        ctx.restore();
        transformed = false;
      }
    });

    var draw = function() {

      if (!active) {
        return;
      }

      var start = +new Date();
      while (cur = sw.next() ) {
        sx = (cur.x * cur.size - width / 2) * scale + opts.cx;
        sy = (cur.y * cur.size - height / 2) * scale + opts.cy;
        v = calc(sx, sy);
        if (v > 0) {
          ctx.fillStyle = 'hsl(' + v + ',100%,50%)';
          ctx.fillRect(cur.x, cur.y, 1, 1);
        } else {
          ctx.fillStyle = 'rgb(0,0,0)';
          ctx.fillRect(cur.x, cur.y, 1, 1);
        }
        var end = +new Date();
        if (end - start > 20) {
          break;
        }
      }
      if (cur) {
        setTimeout(draw, 0);
      }
    };

    draw();

    return {
      stop : function() {
        active = false;
        if (transformed) {
          ctx.restore();
        }
      }
    };
  };

  var proc = start();

});

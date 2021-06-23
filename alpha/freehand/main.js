
'use strict';

if (!window.console) {
  window.console = { log : function() {} };
}

!function() {

  var util = {
    createSVGElement : function(tagName) {
      return document.createElementNS(
          'http://www.w3.org/2000/svg', tagName);
    }
  };

  var getLen = function(p1, p2) {
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  var getDistance = function(p0, p1, p2) {
    return Math.abs( (p2.y - p1.y) * p0.x - (p2.x - p1.x) * p0.y +
        p2.x * p1.y - p2.y * p1.x) / getLen(p1, p2);
  };

  var getAngle = function(p0, p1, p2) {
    return ((p1.x - p0.x) * (p2.x - p1.x) +
        (p1.y - p0.y) * (p2.y - p1.y)) /
      getLen(p0, p1) / getLen(p1, p2)
  };

  var freehand = function(points, handler, opts) {

    if (points.length < 2) {
      return;
    }

    opts = opts || {};
    var maxDistance = opts.maxDistance || 4;

    var calcMaxD = function(i0, i2) {
      var maxD = { i1 : i2, d : 0 };
      for (var i1 = i0; i1 < i2; i1 += 1) {
        var d = getDistance(points[i1], points[i0], points[i2]);
        if (maxD.d < d) {
          maxD = { i1 : i1, d : d };
        }
      }
      return maxD;
    };

    var calc = function(i0, i2) {
      var maxD = calcMaxD(i0, i2);
      var i1 = maxD.i1;
      if (maxD.d > maxDistance) {
        calc(i0, i1);
        calc(i1, i2);
      } else {
        tpts.push(points[i1]);
        tpts.push(points[i2]);
      }
    };

    // trimed points.
    var tpts = [ points[0] ];
    calc(0, points.length - 1);

    if (tpts.length < 2) {
      return;
    }

    var curveRatio = 0.75;
    var lastPoint = null;
    for (var i = 0; i < tpts.length; i += 1) {
      if (i == 0) {
        handler.moveTo(tpts[i].x, tpts[i].y);
      } else if (i + 1 < tpts.length) {
        var a = (1 - getAngle(lastPoint, tpts[i], tpts[i + 1]) ) / 2;
        console.log(i, a);
        if (isNaN(a) ) {
          a = 0;
        }
        //curveRatio = a;
        var cx = tpts[i].x + (tpts[i + 1].x - tpts[i].x) * curveRatio;
        var cy = tpts[i].y + (tpts[i + 1].y - tpts[i].y) * curveRatio;
        handler.quadraticCurveTo(tpts[i].x, tpts[i].y, cx, cy);
      } else {
        handler.lineTo(tpts[i].x, tpts[i].y);
      }
      lastPoint = tpts[i];
    }

    return tpts;
  };

  var nullHandler = {
    moveTo : function() {},
    quadraticCurveTo : function() {},
    lineTo : function() {}
  };

  var plot = function(fg, x, y, color, size) {

    var circle = util.createSVGElement('circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', size / 2);
    circle.setAttribute('fill', color);
    circle.setAttribute('stroke', 'none');
    fg.appendChild(circle);

    /*
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
    */
  };

  var draw = function(ctx, bg, points, color, size) {

    if (points.length < 2) {
      return;
    }

    ctx.beginPath();

    var d = '';

    var tpts = freehand(points, {
      moveTo : function(x, y) {
        ctx.moveTo(x, y);
        d += 'M' + x + ' ' + y;
      },
      quadraticCurveTo : function(cx, cy, x, y) {
        ctx.quadraticCurveTo(cx, cy, x, y);
        d += 'Q' + cx + ' ' + cy + ' ' + x + ' ' + y;
      },
      lineTo : function(x, y) {
        ctx.lineTo(x, y);
        d += 'L' + x + ' ' + y;
      }
    }, { maxDistance : 4 });

    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = size;
    ctx.stroke();

    var path = util.createSVGElement('path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', size);
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    bg.appendChild(path);

    console.log(tpts.length);
  };

  console.log(getAngle({x:0,y:1},{x:0,y:0},{x:0,y:-1}));
  console.log(getAngle({x:0,y:1},{x:0,y:0},{x:1,y:0}));
  console.log(getAngle({x:0,y:1},{x:0,y:0},{x:0,y:1}));
  freehand([{ x : 0, y : 0 }], nullHandler);
  freehand([{ x : 0, y : 0 },{ x : 0, y : 0 }], nullHandler);
  freehand([{ x : 0, y : 0 },{ x : 0, y : 0 },{ x : 0, y : 0 }], nullHandler);

  window.addEventListener('load', function(event) {

    var clear = function() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(0,0,0,0.01)';
      ctx.fillRect(0, 0, width, height);
    };

    var width = 400;
    var height = 300;

    document.body.style.overflow = 'hidden';

    var svg = util.createSVGElement('svg');
    svg.setAttribute('width', width * 2);
    svg.setAttribute('height', height * 2);
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');
    svg.style.overflow = 'hidden';
    document.body.appendChild(svg);
    svg.addEventListener('mousedown', function(event) {
      var mousemoveHandler = function(event) {
        var x = (event.clientX - rect.left) * scale;
        var y = (event.clientY - rect.top) * scale;
        points.push({ x : x, y : y });
        plot(fg, x, y, selectedColor, selectedSize);
      };
      var mouseupHandler = function(event) {
        document.removeEventListener('mousemove', mousemoveHandler);
        document.removeEventListener('mouseup', mouseupHandler);
        draw(ctx, bg, points, selectedColor, selectedSize);
        while (fg.firstChild) {
          fg.removeChild(fg.firstChild);
        }
      };
      event.preventDefault();
      document.addEventListener('mousemove', mousemoveHandler);
      document.addEventListener('mouseup', mouseupHandler);
      var rect = svg.getBoundingClientRect();
      var scale = width / rect.width;
      var points = [];
    });

    var rect = util.createSVGElement('rect');
    rect.setAttribute('x', '0');
    rect.setAttribute('y', '0');
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('fill', 'rgba(0,0,0,0.05)');
    svg.appendChild(rect);

    var bg = util.createSVGElement('g');
    var fg = util.createSVGElement('g');
    svg.appendChild(bg);
    svg.appendChild(fg);

    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');

    clear();

    var selectedColor = '';
    var selectedSize = 0;

    !function() {

      var toolbox = util.createSVGElement('svg');
      document.body.appendChild(document.createElement('br') );
      document.body.appendChild(toolbox);
      document.body.appendChild(document.createElement('br') );

      var colorCells = [];
      var sizeCells = [];

      var setSelectedColor = function(color) {
        selectedColor = color;
        colorCells.forEach(function(cell) {
          cell.setSelected(cell.color == color);
        });
      };
      var setSelectedSize = function(size) {
        selectedSize = size;
        sizeCells.forEach(function(cell) {
          cell.setSelected(cell.size == size);
        });
      };

      var x = 0;
      var y = 0;
      var width = 20;

      var createCell = function() {
        var g = util.createSVGElement('g');
        toolbox.appendChild(g);
        g.setAttribute('transform', 'translate(' + x + ' ' + y + ')');
        x += width;
        var border = util.createSVGElement('rect');
        g.appendChild(border);
        border.setAttribute('x', 1);
        border.setAttribute('y', 1);
        border.setAttribute('width', width - 2);
        border.setAttribute('height', width - 2);
        border.style.fill = 'rgba(0,0,0,0)';
        border.style.stroke = 'rgba(0,0,0,0.1)';
        border.style.strokeWidth = '2';
        return { $el : g,
          setSelected : function(selected) {
            border.style.stroke = selected?
                'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)';
          }
        };
      };

      [
        'rgba(0,0,0,1)',
        'rgba(255,0,0,1)',
        'rgba(255,127,0,1)',
        'rgba(0,192,0,1)',
        'rgba(0,0,255,1)',
        'rgba(255,255,255,1)'
      ].forEach(function(color, i) {
        var cell = createCell();
        cell.color = color;
        colorCells.push(cell);
        var rect = util.createSVGElement('rect');
        rect.setAttribute('x', 2);
        rect.setAttribute('y', 2);
        rect.setAttribute('width', width - 4);
        rect.setAttribute('height', width - 4);
        rect.style.fill = color;
        rect.style.stroke = 'none';
        cell.$el.appendChild(rect);
        cell.$el.addEventListener('mousedown', function() {
          setSelectedColor(color);
        });
      });

      [
        1, 2, 4, 8, 12, 16
      ].forEach(function(size, i) {
        var cell = createCell();
        cell.size = size;
        sizeCells.push(cell);
        var circle = util.createSVGElement('circle');
        circle.setAttribute('r', size / 2);
        circle.setAttribute('cx', width / 2);
        circle.setAttribute('cy', width / 2);
        circle.style.fill = 'rgba(0,0,0,1)';
        circle.style.stroke = 'none';
        cell.$el.appendChild(circle);
        cell.$el.addEventListener('mousedown', function() {
          setSelectedSize(size);
        });
      });

      toolbox.setAttribute('width', x);
      toolbox.setAttribute('height', width);

      setSelectedColor(colorCells[0].color);
      setSelectedSize(sizeCells[0].size);

    }();

    !function() {
      [ { width : 200, height : 50 },
        { width : 50, height : 200 }].forEach(function(size) {
        var svg = util.createSVGElement('svg');
        svg.setAttribute('width', size.width);
        svg.setAttribute('height', size.height);
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.overflow = 'hidden';
        var circle;
        circle = util.createSVGElement('circle');
        circle.setAttribute('cx', 50);
        circle.setAttribute('cy', 50);
        circle.setAttribute('r', 100);
        circle.setAttribute('stroke', 'none');
        circle.setAttribute('fill', 'blue');
        svg.appendChild(circle);
        circle = util.createSVGElement('circle');
        circle.setAttribute('cx', 50);
        circle.setAttribute('cy', 50);
        circle.setAttribute('r', 50);
        circle.setAttribute('stroke', 'none');
        circle.setAttribute('fill', 'green');
        svg.appendChild(circle);
        document.body.appendChild(svg);
      });
    }();

  });

}();

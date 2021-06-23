
'use strict'

window.addEventListener('load', function() {

  var patternGroups = [
    {
      label: '',
      patterns: [
        {
          label: 'Single Stroke Roll',
          pattern: 'b0-32-7 b1-32-3 b2-32-3 R32 L32 R32 L32' +
                ' | b1-32-3 b2-32-3 R32 L32 R32 L32' +
                ' | b0-32-7 b1-32-3 b2-32-3 R32 L32 R32 L32' +
                ' | b1-32-3 b2-32-3 R32 L32 R32 L32',
          blen: 1
        },
        {
          label: 'Double Stroke Open Roll',
          pattern: 'b0-32-7 b1-32-3 b2-32-3 R32 R32 L32 L32' +
                ' | b1-32-3 b2-32-3 R32 R32 L32 L32' +
                ' | b0-32-7 b1-32-3 b2-32-3 R32 R32 L32 L32' +
                ' | b1-32-3 b2-32-3 R32 R32 L32 L32',
          blen: 1
        }
      ]
    },
    {
      label: '',
      patterns: [
        {
          label: 'Five Stroke Roll',
          pattern: 'b0-32-4 b1-32-3 b2-32-3 R32 R32 L32 L32 R8' +
                ' | b0-32-4 b1-32-3 b2-32-3 L32 L32 R32 R32 L8',
          blen: 1
        },
        {
          label: 'Seven Stroke Roll',
          pattern: 'b0-32-6 b1-32-3 b2-32-3 R32 R32 L32 L32 b1-32-2 b2-32-1 R32 R32 L16' +
                ' | b0-32-6 b1-32-3 b2-32-3 R32 R32 L32 L32 b1-32-2 b2-32-1 R32 R32 L16',
          blen: 1
        }
      ]
    },
    {
      label: '',
      patterns: [
        {
          label: 'Nine Stroke Roll',
          pattern: 'b0-32-7 b1-32-3 b2-32-3 R32 R32 L32 L32' +
                ' | b1-32-3 b2-32-3 R32 R32 L32 L32 R4' +
                ' | b0-32-7 b1-32-3 b2-32-3 L32 L32 R32 R32' +
                ' | b1-32-3 b2-32-3 L32 L32 R32 R32 L4',
          blen: 1
        },
        {
          label: 'Ten Stroke Roll',
          pattern: 'b0-32-7 b1-32-3 b2-32-3 R32 R32 L32 L32' +
                ' | b1-32-3 b2-32-3 R32 R32 L32 L32' +
                ' | b0-32-1 b1-32-1 R32 L32 Q16' +
                ' | b0-32-7 b1-32-3 b2-32-3 R32 R32 L32 L32' +
                ' | b1-32-3 b2-32-3 R32 R32 L32 L32' +
                ' | b0-32-1 b1-32-1 R32 L32 Q16',
          blen: 1
        }
      ]
    },
    {
      label: '',
      patterns: [
        {
          label: 'Eleven Stroke Roll',
          pattern: 'b0-32-7 b1-32-3 b2-32-3 R32 R32 L32 L32' +
                ' | b1-32-3 b2-32-3 R32 R32 L32 L32' +
                ' | b0-32-2 b1-32-2 b2-32-1 R32 R32 L16 Q8' +
                ' | b0-32-7 b1-32-3 b2-32-3 R32 R32 L32 L32' +
                ' | b1-32-3 b2-32-3 R32 R32 L32 L32' +
                ' | b0-32-2 b1-32-2 b2-32-1 R32 R32 L16 Q8',
          blen: 1
        },
        {
          label: '',
          pattern: '',
          blen: 1
        }
      ]
    },
    {
      label: 'Single Paradiddle',
      patterns: [
        {
          label: 'Standard',
          pattern: 'b0-16-3 b1-16-3 R16 L16 R16 R16' +
                ' | b0-16-3 b1-16-3 L16 R16 L16 L16',
          blen: 2
        },
        {
          label: 'Reverse',
          pattern: 'b0-16-3 b1-16-3 R16 R16 L16 R16' +
                ' | b0-16-3 b1-16-3 L16 L16 R16 L16',
          blen: 2
        },
        {
          label: 'Inward',
          pattern: 'b0-16-3 b1-16-3 R16 L16 L16 R16' +
                ' | b0-16-3 b1-16-3 L16 R16 R16 L16',
          blen: 2
        },
        {
          label: 'Delayed',
          pattern: 'b0-16-3 b1-16-3 R16 L16 R16 L16' +
                ' | b0-16-3 b1-16-3 L16 R16 L16 R16',
          blen: 2
        }
      ]
    },
    {
      label: 'Double Paradiddle',
      // ^6
      patterns: [
        {
          label: 'Standard',
          pattern: 't6 b0-16-5 b1-16-5 R16 L16 R16 L16 R16 R16' +
                ' | t6 b0-16-5 b1-16-5 L16 R16 L16 R16 L16 L16',
          blen: 2
        },
        {
          label: 'Reverse',
          pattern: 't6 b0-16-5 b1-16-5 R16 R16 L16 R16 L16 R16' +
                ' | t6 b0-16-5 b1-16-5 L16 L16 R16 L16 R16 L16',
          blen: 2
        },
        {
          label: 'Inward',
          pattern: 't6 b0-16-5 b1-16-5 R16 L16 R16 R16 L16 R16' +
                ' | t6 b0-16-5 b1-16-5 L16 R16 L16 L16 R16 L16',
          blen: 2
        },
        {
          label: 'Delayed',
          pattern: 't6 b0-16-5 b1-16-5 R16 L16 R16 L16 R16 L16' +
                ' | t6 b0-16-5 b1-16-5 L16 R16 L16 R16 L16 R16',
          blen: 2
        }
      ]
    },
    {
      label: 'Triple Paradiddle',
      patterns: [
        {
          label: 'Standard',
          pattern: 'b0-32-7 b1-32-7 b2-32-7 R32 L32 R32 L32 | R32 L32 R32 R32' +
                ' | b0-32-7 b1-32-7 b2-32-7 L32 R32 L32 R32 | L32 R32 L32 L32',
          blen: 2
        },
        {
          label: 'Reverse',
          pattern: 'b0-32-7 b1-32-7 b2-32-7 R32 L32 R32 L32 | R32 R32 L32 R32' +
                ' | b0-32-7 b1-32-7 b2-32-7 L32 R32 L32 R32 | L32 L32 R32 L32',
          blen: 2
        },
        {
          label: 'Inward',
          pattern: 'b0-32-7 b1-32-7 b2-32-7 R32 L32 R32 L32 | R32 L32 L32 R32' +
                ' | b0-32-7 b1-32-7 b2-32-7 L32 R32 L32 R32 | L32 R32 R32 L32',
          blen: 2
        },
        {
          label: 'Delayed',
          pattern: 'b0-32-7 b1-32-7 b2-32-7 R32 L32 R32 L32 | R32 L32 R32 L32' +
                ' | b0-32-7 b1-32-7 b2-32-7 L32 R32 L32 R32 | L32 R32 L32 R32',
          blen: 2
        }
      ]
    },
    {
      label: 'Paradiddle-Diddle',
      // ^6
      patterns: [
        {
          label: 'Standard',
          pattern: 't6 b0-16-5 b1-16-5 R16 L16 R16 R16 L16 L16' +
                ' | t6 b0-16-5 b1-16-5 R16 L16 R16 R16 L16 L16',
          blen: 2,
          rev: true
        },
        {
          label: 'Reverse',
          pattern: 't6 b0-16-5 b1-16-5 R16 R16 L16 L16 R16 L16' +
                ' | t6 b0-16-5 b1-16-5 R16 R16 L16 L16 R16 L16',
          blen: 2,
          rev: true
        },
        {
          label: 'Inward',
          pattern: 't6 b0-16-5 b1-16-5 R16 L16 L16 R16 R16 L16' +
                ' | t6 b0-16-5 b1-16-5 R16 L16 L16 R16 R16 L16',
          blen: 2,
          rev: true
        },
        {
          label: 'Delayed',
          pattern: 't6 b0-16-5 b1-16-5 R16 R16 L16 R16 L16 L16' +
                ' | t6 b0-16-5 b1-16-5 R16 R16 L16 R16 L16 L16',
          blen: 2,
          rev: true
        }
      ]
    },
    {
      label: '',
      patterns: [
        {
          label: 'Flam',
          pattern: 'l1 R4 r1 L4',
          blen: 2
        },
        {
          label: 'Flam Accent',
          pattern: 't3 b0-8-2 l1 R8 L8 R8' +
                ' | t3 b0-8-2 r1 L8 R8 L8',
          blen: 2
        },
        {
          label: 'Flam Tap',
          pattern: 'b0-16-3 b1-16-3 l1 R16 R16 r1 L16 L16' +
                ' | b0-16-3 b1-16-3 l1 R16 R16 r1 L16 L16',
          blen: 2
        },
        {
          label: 'Flamacue',
          pattern: 'b0-16-3 b1-16-3 l1 R16 L16 R16 L16 | l1 R4',
          blen: 2,
          rev: true
        }
      ]
    },
    {
      label: '',
      patterns: [
        {
          label: 'Flam Paradiddle',
          pattern: 'b0-16-3 b1-16-3 l1 R16 L16 R16 R16' +
                ' | b0-16-3 b1-16-3 r1 L16 R16 L16 L16',
          blen: 2
        },
        {
          label: 'Single Flammed Mill',
          pattern: 'b0-16-3 b1-16-3 l1 R16 R16 L16 R16' +
                ' | b0-16-3 b1-16-3 r1 L16 L16 R16 L16',
          blen: 2
        },
        {
          label: 'Flam Paradiddle-Diddle',
          pattern: 't6 b0-16-5 b1-16-5 l1 R16 L16 R16 R16 L16 L16' +
                ' | t6 b0-16-5 b1-16-5 r1 L16 R16 L16 L16 R16 R16',
          blen: 2
        },
        {
          label: 'Pataflafla',
          pattern: 'b0-16-3 b1-16-3 l1 R16 L16 R16 r1 L16' +
                ' | b0-16-3 b1-16-3 l1 R16 L16 R16 r1 L16',
          blen: 2
        }
      ]
    },
    {
      label: '',
      patterns: [
        {
          label: 'Swiss Army Triplet',
          // ^3
          pattern: 't3 b0-16-2 b1-16-2 l1 R16 R16 b0-16-1 L16' +
                ' | t3 b0-16-2 b1-16-2 l1 R16 R16 L16',
          blen: 4,
          rev: true
        },
        {
          label: 'Inverted Flam Tap',
          pattern: 'b0-16-3 b1-16-3 l1 R16 L16 r1 L16 R16' +
                ' | b0-16-3 b1-16-3 l1 R16 L16 r1 L16 R16',
          blen: 2
        },
        {
          label: 'Flam Drag',
          pattern: 'b0-8-2 l1 R8 b1-16-1 L16 L16 R8' +
                ' | b0-8-2 r1 L8 b1-16-1 R16 R16 L8',
          blen: 1
        },
        {
          label: '',
          pattern: '',
          blen: 2
        }
      ]
    },
    {
      label: '',
      patterns: [
        {
          label: 'Drag',
          pattern: 'l2 R4 r2 L4',
          blen: 2
        },
        {
          label: 'Single Drag Tap',
          pattern: 'b0-8-1 l2 R8 L8' +
                ' | b0-8-1 r2 L8 R8',
          blen: 2
        },
        {
          label: '',
          pattern: '',
          blen: 2
        },
        {
          label: '',
          pattern: '',
          blen: 2
        }
      ]
    },
    {
      label: '',
      patterns: [
        {
          label: 'Double Drag Tap',
          pattern: 'b0-8-2 l2 R8 l2 R8 L8' +
                ' | b0-8-2 r2 L8 r2 L8 R8',
          blen: 1
        },
        {
          label: 'Lesson 25',
          pattern: 'b0-16-2 b1-16-1 l2 R16 L16 R8' +
                ' | b0-16-2 b1-16-1 l2 R16 L16 R8',
          blen: 2,
          rev: true
        }
      ]
    },
    {
      label: '',
      patterns: [
        {
          label: 'Single Dragadiddle',
          // x
          pattern: 'b0-16-3 b1-16-3 r1 R16 L16 R16 R16' +
                ' | b0-16-3 b1-16-3 l1 L16 R16 L16 L16',
          blen: 2
        },
        {
          label: 'Drag Paradiddle #1',
          pattern: 'b0-16-5 R8 b1-16-3 l2 R16 L16 R16 R16' +
                ' | b0-16-5 L8 b1-16-3 r2 L16 R16 L16 L16',
          blen: 1
        }
      ]
    },
    {
      label: '',
      patterns: [
        {
          label: 'Drag Paradiddle #2',
          pattern: 'b0-8-1 R8 l2 R8 b0-16-3 b1-16-3 l2 R16 L16 R16 R16' +
                ' | b0-8-1 L8 r2 L8 b0-16-3 b1-16-3 r2 L16 R16 L16 L16',
          blen: 1
        },
        {
          label: 'Single Ratamacue',
          // ^3
          pattern: 't3 b0-16-2 b1-16-2 l2 R16 L16 b0-16-1 R16 L8' +
                ' | t3 b0-16-2 b1-16-2 r2 L16 R16 b0-16-1 L16 R8',
          blen: 1
        }
      ]
    },
    {
      label: '',
      patterns: [
        {
          label: 'Double Ratamacue',
          // ^3
          pattern: 'b0-8-1 l2 R8 t3 b0-16-2 b1-16-2 l2 R16 L16 b0-16-1 R16 L8' +
                ' | b0-8-1 r2 L8 t3 b0-16-2 b1-16-2 r2 L16 R16 b0-16-1 L16 R8',
          blen: 1
        },
        {
          label: 'Triple Ratamacue',
          // ^3
          pattern: 'b0-16-2 l2 R8 l2 R8 | t3 b0-16-2 b1-16-2 l2 R16 L16 b0-16-1 R16 L8' +
                ' | b0-16-2 r2 L8 r2 L8 | t3 b0-16-2 b1-16-2 r2 L16 R16 b0-16-1 L16 R8',
          blen: 1
        }
      ]
    }
  ];

  var svgNamespace = 'http://www.w3.org/2000/svg';

  var $s = function(tagName) {
    return {
      $el:document.createElementNS(svgNamespace, tagName),
      attrs: function(attrs) {
        for (var k in attrs) {
          this.$el.setAttribute(k, '' + attrs[k]);
        }
        return this;
      },
      append: function(elm) {
        this.$el.appendChild(elm.$el);
        return this;
      }
    };
  };
  var pathBuilder = function() {
    var path = '';
    return {
      M: function(x, y) {
        path += 'M';
        path += x;
        path += ' ';
        path += y;
        return this;
      },
      L: function(x, y) {
        path += 'L';
        path += x;
        path += ' ';
        path += y;
        return this;
      },
      build: function() {
        return path;
      }
    };
  };

  var debug = false;
  var patStroke = '#000000';
  var fontFamily = 'Arial';
  var fontSize = 16;
  var fontSizeSmall = fontSize * 0.75;
  var strokeWidth = 0.5;
  var strokeDashArrayH = strokeWidth * 12 + ' ' + strokeWidth * 8 +
    ' ' + strokeWidth * 4 + ' ' + strokeWidth * 8;
  var strokeDashArrayV = strokeWidth * 8 + ' ' + strokeWidth * 8;

  var globalPatWidth = 900;
  var patHeight = 60;

  var marginLeft = 50;
  var marginRight = 40;
  var marginTop = 60;
  var marginBottom = 60;

  var hGap = 50;
  var vGap = 80;
  var vGapPat = 20;

  var notePath = 'M 0 0c 0 5 -7.333 5.333 -7.333 1.667' +
    'C -7.334 -2.334 0 -4.667 0 0z';
/*
  var tmpPath = function(path) {
    //cx="56.491" cy="462.819"
    var offsetX = 419.334;
    var offsetY = 2009.168;
    var p = '';
    var abs = false;
    var coordIndex = 0;
    path.split(/\s+/g).forEach(function(c) {
      if (c.match(/^[A-Z]$/) ) {
        p += c;
        abs = true;
      } else if (c.match(/^[a-z]$/) ) {
        p += c;
        abs = false;
      } else {
        c = +c;
        if (abs) {
          if (coordIndex % 2 == 0) {
            c -= offsetX;
          } else {
            c -= offsetY;
          }
        }
        p += ' ' + c;
        coordIndex += 1;
      }
    });
    return p;
  } ('M 419.334 2009.168 c 0 2.333 0 2.001 0 4.5 c 2.333 1.166 3.667 1.999 5.5 7.499 C 424.501 2012.334 421.167 2013.834 419.334 2009.168 z');
  console.log(tmpPath);
*/

  var flagPath = 'M 0 0' +
    ' c 0 2.333 0 2.001 0 4.5' +
    ' c 2.333 1.166 3.667 1.999 5.5 7.499' +
    ' C 5.167 3.166 1.833 4.666 0 0 z';

  var accPath = 'M 0 0 c 6.757 7.163 11.667 0 11.667 0 S 6.465 4.672 0 0 z';

  var restPath = 'M 2.475 -4.241' +
    ' C 2.017 -3.543 1.363 -3.22 0.889 -3.045' +
    ' c 0.015 -0.1 0.021 -0.198 0.021 -0.302' +
    ' c 0 -1.104 -0.895 -1.999 -2 -1.999' +
    ' c -1.104 0 -1.999 0.896 -1.999 1.999' +
    ' c 0 1.104 0.896 2 1.999 2' +
    ' c 1.151 0 2.631 -1.153 3.2 -1.577' +
    ' c -0.9 3.574 -2.109 7.68 -2.123 7.726' +
    ' l -0.1 0.34 l 0.68 0.2 l 0.1 -0.34' +
    ' C 0.683 4.951 3.089 -3.93 3.089 -3.93' +
    ' S 2.767 -4.084 2.475 -4.241' +
    ' L 2.475 -4.241 z';

  var appendPattern = function(patGrp, x, y,
      patWidth, patternName, pattern, beatLength, withReverse) {

    var pat = $s('g').attrs({
      transform: 'translate(' + x + ' ' + y + ')' });
    patGrp.append(pat);

    if (debug) {
      pat.append($s('rect').attrs({
        x: 0, y: 0, width: patWidth, height: patHeight,
        fill: 'none', 'stroke-linecap': 'butt',
        'stroke-width': strokeWidth,
        stroke: '#fc6' }) );
    }

    var appendNote = function(label, x, y, small) {
      var scale = small? 0.8 : 1;
      var text = $s('text').attrs({ x: x, y: y, 'text-anchor': 'middle',
        'font-family': fontFamily, 'font-size': fontSizeSmall * scale,
        fill: patStroke, stroke: 'none' });
      text.$el.textContent = label;
      pat.append(text);
      if (withReverse) {
        var text = $s('text').attrs({
          x: x,
          y: y + fontSizeSmall * 1.2 +
            (small? -fontSizeSmall * (1 - scale) : 0),
          'text-anchor': 'middle',
          'font-family': fontFamily, 'font-size': fontSizeSmall * scale,
          fill: patStroke, stroke: 'none' });
        text.$el.textContent = label == 'R'? 'L' : 'R';
        pat.append(text);
      }
      
      if (label == 'R') {
      } else if (label == 'L') {
      } else {
        throw new label;
      }
    };

    var x = 0;
    var t = 0;
    var tf = false;
    var tRe = /t(\d+)/;
    var bRe = /b(\d+)-(\d+)-(\d+)/;
    var pRe = /([RLQrl])(\d+)/;

    pattern.split(/[\s|]+/g).forEach(function(note, i) {

      var nx = x * patWidth * beatLength;

      var y1 = patHeight * 0.2;
      var y2 = patHeight * 0.8;
      var fr = 0.28;

      if (note.match(pRe) ) {

        var n = RegExp.$1;
        var d = +RegExp.$2;

        if (n == 'l' || n == 'r') {

          var fx = nx - 2;
          var dx = 10;

          for (var i = 0; i < d; i += 1) {

            fx -= dx;

            var yn = y2 + 1.5;
            var ya = y2 + 6;

            pat.append($s('path').attrs({ d: pathBuilder().
              M(fx, (y1 + yn) / 2).
              L(fx, yn).build(),
              fill: 'none', 'stroke-linecap': 'square',
              'stroke-width': strokeWidth, stroke: patStroke }) );
            pat.append($s('path').attrs({ d: notePath,
              transform: 'translate(' + fx + ' ' + yn + ') scale(0.6)',
              fill: patStroke, 'stroke-width': strokeWidth, stroke: patStroke
            }) );

            if (d == 1) {

              pat.append($s('path').attrs({ d: flagPath,
                transform: 'translate(' + fx + ' ' + (y1 + yn) / 2 + ')',
                fill: patStroke, stroke: 'none' }) );
              pat.append($s('path').attrs({ d: pathBuilder().
                M(fx - 3, (y1 + yn) / 2 + 11).
                L(fx + 6, (y1 + yn) / 2 + 5).build(),
                fill: 'none', 'stroke-linecap': 'square',
                'stroke-width': strokeWidth, stroke: patStroke }) );
              pat.append($s('path').attrs({ d: accPath,
                transform: 'translate(' + (fx - 2.5) + ' ' + ya + ')',
                fill: patStroke, stroke: 'none' }) );

            } else if (i == 0) {

              var w = dx * (d - 1);
              pat.append($s('rect').attrs({
                x: fx - w, y: (y1 + yn) / 2, width: w, height: 2,
                fill: patStroke, stroke: patStroke }) );
              pat.append($s('rect').attrs({
                x: fx - w, y: (y1 + yn) / 2 + 5.5, width: w, height: 2,
                fill: patStroke, stroke: patStroke }) );
              pat.append($s('path').attrs({ d: accPath,
                transform: 'translate(' + (fx - w - 2.5) + ' ' + ya + ')' +
                  'scale(' + (d - 1 + 0.8)  + ' 1)',
                fill: patStroke, stroke: 'none' }) );
            }
            appendNote(n.toUpperCase(),
              fx - fontSizeSmall * fr, patHeight + fontSizeSmall, true);
          }

        } else {

          if (n == 'L' || n == 'R') {

            pat.append($s('path').attrs({ d: pathBuilder().
              M(nx, y1).
              L(nx, y2).build(),
              fill: 'none', 'stroke-linecap': 'square',
              'stroke-width': strokeWidth, stroke: patStroke }) );
            pat.append($s('path').attrs({ d: notePath,
              transform: 'translate(' + nx + ' ' + y2 + ')',
              fill: patStroke, 'stroke-width': strokeWidth, stroke: patStroke
            }) );
            appendNote(n, nx - fontSizeSmall * fr, patHeight + fontSizeSmall);

          } else if (n == 'Q') {

            pat.append($s('path').attrs({ d: restPath,
            transform: 'translate(' + nx + ' ' + y2 + ')',
              fill: patStroke, stroke: 'none' }) );
          }

          if (t > 1) {

            if (tf) {

              !function() {
                  var text = $s('text').attrs({
                    x: nx + 1 / d * 2 / 3 * patWidth * beatLength * (t - 1) / 2,
                    y: y1 - 2,
                    'text-anchor': 'middle',
                    'font-family': fontFamily,
                    'font-style': 'italic',
                    'font-size': fontSizeSmall });
                  text.$el.textContent = '' + t;
                  pat.append(text);
              }();

            }

            x += 1 / d * 2 / 3;
            t -= 1;
            tf = false;

          } else {
            x += 1 / d;
          }

        }

      } else if (note.match(tRe) ) {

        t = +RegExp.$1;
        tf = true;

      } else if (note.match(bRe) ) {

        var bh = 3;
        var pos = +RegExp.$1;
        var d = +RegExp.$2;
        var len = +RegExp.$3;
        if (t > 1) {
          len = len * 2 / 3;
        }
        pat.append($s('rect').attrs({
          x: nx, y: y1 + bh * 2.4 * pos,
          width: patWidth / d * len * beatLength,
          height: bh,
          fill: patStroke, 'stroke-width': strokeWidth, stroke: patStroke }) );
      }
    });

    !function() {
        var text = $s('text').attrs({
          x: 0,
          y: -fontSize * 0.2,
  //        'text-anchor': 'middle',
          'font-family': fontFamily, 'font-size': fontSize });
        text.$el.textContent = patternName;
        pat.append(text);
    }();
  };

  var appendPatternGroup = function(x, y, groupName, patterns) {

    var patGrp = $s('g').attrs({
      transform: 'translate(' + x + ' ' + y + ')' });
    svg.append(patGrp);

    if (debug) {
      patGrp.append($s('rect').attrs({
        x: 0, y: 0,
        width: globalPatWidth,
        height: patHeight + vGapPat,
        fill: 'none', 'stroke-linecap': 'round',
        'stroke-width': strokeWidth, stroke: '#66c' }) );
    }

    !function() {
      var hOff = 15;
      var vOff = - fontSize - 5;
      patGrp.append($s('path').attrs({
        d: pathBuilder().
              M(-hOff * 2, vOff).
              L(globalPatWidth + hOff, vOff).build(),
        fill: 'none', 'stroke-linecap': 'butt',
        'stroke-dasharray': strokeDashArrayH,
        'stroke-width': strokeWidth, stroke: '#000' }) );
    }();

    !function() {
        var text = $s('text').attrs({
          x: 0,
          y: -fontSize * 0.2,
  //        'text-anchor': 'middle',
          'font-family': fontFamily, 'font-size': fontSize });
        text.$el.textContent = groupName;
        patGrp.append(text);
    }();

    var patWidth = (globalPatWidth + hGap) / patterns.length - hGap;
    var px = 0;

    for (var i = 0; i < patterns.length; i += 1) {

      appendPattern(
        patGrp, px, vGapPat, patWidth,
        patterns[i].label, patterns[i].pattern,
        patterns[i].blen, patterns[i].rev);

      if (i > 0 && patterns[i].label) {
        var divX = px - 40;
        patGrp.append($s('path').attrs({
          d: pathBuilder().
                M(divX, 25).
                L(divX, patHeight + vGapPat + fontSizeSmall + 10).build(),
          fill: 'none', 'stroke-linecap': 'round',
          'stroke-dasharray': strokeDashArrayV,
          'stroke-width': strokeWidth, stroke: '#000' }) );
      }

      px += patWidth + hGap;
    }

  };

  var width = globalPatWidth + marginLeft + marginRight;
  var height = (patHeight + vGap) * patternGroups.length -
    vGap + marginTop + marginBottom;

  var svgHolder = document.createElement('div');
  document.body.appendChild(svgHolder);
  var svg = $s('svg').attrs({
    width: width + 'px', height: height + 'px', xmlns: svgNamespace });
  svgHolder.appendChild(svg.$el);

  // bg
  if (debug) {
    svg.append($s('rect').attrs({
      x: 0, y: 0, width: width, height: height,
      fill: '#f0f0f0', stroke: '#00f' }));
  }

  var x = marginLeft;
  var y = marginTop;
  for (var i = 0; i < patternGroups.length; i += 1) {
    var patterns = patternGroups[i].patterns;
    appendPatternGroup(x, y, patternGroups[i].label, patterns);
    y += patHeight + vGap;
  }

  var button = document.createElement('button');
  button.textContent = ' download ';
  button.addEventListener('click', function() {
    var content = svgHolder.innerHTML;
    content = content.replace(/^\s+|\s+$/g, '');
    var dataURL = 'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(content);
    var a = document.createElement('a');
    a.href = dataURL;
    a.download = 'drum-patterns.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
  document.body.appendChild(button);
});


'use strict'

window.addEventListener('load', function() {

  var chords = [
    { label: 'C',     chord: [0, 1, 0, 2, 3, -1] },
    { label: 'Cm',    chord: ['3_4', 4, 5, 5, 0, -1], shift: 2 },
    { label: 'C7',    chord: [0, 1, 3, 2, 3, -1] },
    { label: 'CM7',   chord: [0, 0, 0, 2, 3, -1] },
    { label: 'Cm7',   chord: ['3_4', 4, 0, 5, 0, -1], shift: 2 },
    { label: 'Cdim',  chord: ['2_2', 4, 0, 4, 3, -1], shift: 1 },
    { label: 'Cadd9', chord: [0, 3, 0, 2, 3, -1] },
    { label: 'Csus4', chord: ['1_1', 0, 0, 3, 3, -1] },
    { label: 'Caug',  chord: [-1, '1_1', 0, 2, 3, -1] },

    { label: 'D',     chord: [2, 3, 2, 0, -1, -1] },
    { label: 'Dm',    chord: [1, 3, 2, 0, -1, -1] },
    { label: 'D7',    chord: [2, 1, 2, 0, -1, -1] },
    { label: 'DM7',   chord: ['2_2', 0, 0, 0, -1, -1] },
    { label: 'Dm7',   chord: ['1_1', 0, 2, 0, -1, -1] },
    { label: 'Ddim',  chord: [1, 0, 1, 0, -1, -1] },
    { label: 'Dadd9', chord: [0, 3, 2, 0, -1, -1] },
    { label: 'Dsus4', chord: [3, 3, 2, 0, -1, -1] },
    { label: 'Daug',  chord: [2, 3, 3, 0, -1, -1] },

    { label: 'E',     chord: [0, 0, 1, 2, 2, 0] },
    { label: 'Em',    chord: [0, 0, 0, 2, 2, 0] },
    { label: 'E7',    chord: [0, 0, 1, 0, 2, 0] },
    { label: 'EM7',   chord: [0, 0, 1, 1, 2, 0] },
    { label: 'Em7',   chord: [0, 0, 0, 0, 2, 0] },
    { label: 'Edim',  chord: [0, 2, 0, 2, 1, 0] },
    { label: 'Eadd9', chord: [2, 0, 1, 2, 2, 0] },
    { label: 'Esus4', chord: [0, 0, 2, 2, 2, 0] },
    { label: 'Eaug',  chord: [0, 1, 1, 2, -1, -1] },

    { label: 'F',     chord: ['1_5', 0, 2, 3, 3, 0] },
    { label: 'Fm',    chord: ['1_5', 0, 0, 3, 3, 0] },
    { label: 'F7',    chord: ['1_5', 0, 2, 0, 3, 0] },
    { label: 'FM7',   chord: [0, 1, 2, 3, 0, -1] },
    { label: 'Fm7',   chord: ['1_5', 0, 0, 0, 3, 0] },
    { label: 'Fdim',  chord: [1, 0, 1, 0, -1, -1] },
    { label: 'Fadd9', chord: [3, 1, 2, 3, -1, -1] },
    { label: 'Fsus4', chord: ['1_5', 0, 3, 3, 3, 0] },
    { label: 'Faug',  chord: [1, 2, 2, 3, -1, -1] },

    { label: 'G',     chord: [3, 0, 0, 0, 2, 3] },
    { label: 'Gm',    chord: ['3_5', 0, 0, 5, 5, 0], shift: 2 },
    { label: 'G7',    chord: [1, 0, 0, 0, 2, 3] },
    { label: 'GM7',   chord: [2, 0, 0, 0, 2, 3] },
    { label: 'Gm7',   chord: ['3_5', 0, 0, 0, 5, 0], shift: 2 },
    { label: 'Gdim',  chord: ['3_5', 5, 0, 5, 4, 0], shift: 2 },
    { label: 'Gadd9', chord: [3, 0, 2, 0, 2, 3] },
    { label: 'Gsus4', chord: [3, 1, 0, 0, 3, 3] },
    { label: 'Gaug',  chord: [3, 4, 4, 5, -1, -1], shift: 2 },

    { label: 'A',     chord: [0, 2, 2, 2, 0, -1] },
    { label: 'Am',    chord: [0, 1, 2, 2, 0, -1] },
    { label: 'A7',    chord: [0, 2, 0, 2, 0, -1] },
    { label: 'AM7',   chord: [0, 2, 1, 2, 0, -1] },
    { label: 'Am7',   chord: [0, 1, 0, 2, 0, -1] },
    { label: 'Adim',  chord: [2, 1, 2, 1, 0, -1] },
    { label: 'Aadd9', chord: [0, 0, 2, 2, 0, -1] },
    { label: 'Asus4', chord: [0, 3, 2, 2, 0, -1] },
    { label: 'Aaug',  chord: [1, 2, 2, 3, 0, -1] },

    { label: 'B',     chord: ['2_4', '4_2', 0, 0, 0, -1], shift: 1 },
    { label: 'Bm',    chord: ['2_4', 3, 4, 4, 0, -1], shift: 1 },
    { label: 'B7',    chord: [2, 0, 2, 1, 2, -1] },
    { label: 'BM7',   chord: ['2_4', 4, 3, 4, 0, -1], shift: 1 },
    { label: 'Bm7',   chord: ['2_4', 3, 0, 4, 0, -1], shift: 1 },
    { label: 'Bdim',  chord: [1, 0, 1, 0, -1, -1] },
    { label: 'Badd9', chord: ['2_4', 0, 4, 4, 0, -1], shift: 1 },
    { label: 'Bsus4', chord: ['2_4', 5, 4, 4, 0, -1], shift: 1 },
    { label: 'Baug',  chord: [3, 0, 0, 1, 2, -1] },

    { label: 'C#',     chord: ['4_4', '6_2', 0, 0, 0, -1], shift: 3 },
    { label: 'C#m',    chord: ['4_4', 5, 6, 6, 0, -1], shift: 3 },
    { label: 'C#7',    chord: ['4_4', 6, 0, 6, 0, -1], shift: 3 },
    { label: 'C#M7',   chord: ['4_4', 6, 5, 6, 0, -1], shift: 3 },
    { label: 'C#m7',   chord: ['4_4', 5, 0, 6, 0, -1], shift: 3 },
    { label: 'C#dim',  chord: ['3_2', 5, 0, 5, 4, -1], shift: 2 },
    { label: 'C#add9', chord: ['4_4', 0, 6, 6, 0, -1], shift: 3 },
    { label: 'C#sus4', chord: ['4_4', 7, 6, 6, 0, -1], shift: 3 },
    { label: 'C#aug',  chord: [-1, '2_1', 0, 3, 4, -1], shift: 1 },

    { label: 'D#',     chord: ['3_4', 4, 0, 5, 6, -1], shift: 2 },
    { label: 'D#m',    chord: ['6_4', 7, 8, 8, 0, -1], shift: 5 },
    { label: 'D#7',    chord: ['6_4', 8, 0, 8, 0, -1], shift: 5 },
    { label: 'D#M7',   chord: ['6_4', 8, 7, 8, 0, -1], shift: 5 },
    { label: 'D#m7',   chord: ['6_4', 7, 0, 8, 0, -1], shift: 5 },
    { label: 'D#dim',  chord: ['5_2', 7, 0, 7, 6, -1], shift: 4 },
    { label: 'D#add9', chord: ['6_4', 0, 8, 8, 0, -1], shift: 5 },
    { label: 'D#sus4', chord: ['6_4', 9, 8, 8, 0, -1], shift: 5 },
    { label: 'D#aug',  chord: [3, 0, 0, 1, -1, -1] },

    { label: 'F#',     chord: ['2_5', 0, 3, 4, 4, 0], shift: 1 },
    { label: 'F#m',    chord: ['2_5', 0, 0, 4, 4, 0], shift: 1 },
    { label: 'F#7',    chord: ['2_5', 0, 3, 0, 4, 0], shift: 1 },
    { label: 'F#M7',   chord: ['2_5', 0, 3, 3, 4, 0], shift: 1 },
    { label: 'F#m7',   chord: ['2_5', 0, 0, 0, 4, 0], shift: 1 },
    { label: 'F#dim',  chord: ['2_5', 4, 0, 4, 3, 0], shift: 1 },
    { label: 'F#add9', chord: [4, 2, 3, 4, -1, -1], shift: 1 },
    { label: 'F#sus4', chord: ['2_5', 0, 4, 4, 4, 0], shift: 1 },
    { label: 'F#aug',  chord: [2, 3, 3, 4, -1, -1], shift: 1 },

    { label: 'G#',     chord: ['4_5', 0, 5, 6, 6, 0], shift: 3 },
    { label: 'G#m',    chord: ['4_5', 0, 0, 6, 6, 0], shift: 3 },
    { label: 'G#7',    chord: ['4_5', 0, 5, 0, 6, 0], shift: 3 },
    { label: 'G#M7',   chord: ['4_5', 0, 5, 5, 6, 0], shift: 3 },
    { label: 'G#m7',   chord: ['4_5', 0, 0, 0, 6, 0], shift: 3 },
    { label: 'G#dim',  chord: ['4_5', 6, 0, 6, 5, 0], shift: 3 },
    { label: 'G#add9', chord: [6, 4, 5, 6, -1, -1], shift: 3 },
    { label: 'G#sus4', chord: ['4_5', 0, 6, 6, 6, 0], shift: 3 },
    { label: 'G#aug',  chord: [4, 5, 5, 6, -1, -1], shift: 3 },

    { label: 'A#',     chord: ['1_4', '3_2', 0, 0, 0, -1] },
    { label: 'A#m',    chord: ['1_4', 2, 3, 3, 0, -1] },
    { label: 'A#7',    chord: ['1_4', 3, 0, 3, 0, -1] },
    { label: 'A#M7',   chord: ['1_4', 3, 2, 3, 0, -1] },
    { label: 'A#m7',   chord: ['1_4', 2, 0, 3, 0, -1] },
    { label: 'A#dim',  chord: [3, 2, 3, 2, -1, -1] },
    { label: 'A#add9', chord: ['1_4', 0, 3, 3, 0, -1] },
    { label: 'A#sus4', chord: ['1_4', 4, 3, 3, 0, -1] },
    { label: 'A#aug',  chord: [2, 3, 3, 4, -1, -1], shift: 1 },

    { label: 'X',     chord: [0, 0, 0, 0, 0, 0] },
    { label: 'Xm',    chord: [0, 0, 0, 0, 0, 0] },
    { label: 'X7',    chord: [0, 0, 0, 0, 0, 0] },
    { label: 'XM7',   chord: [0, 0, 0, 0, 0, 0] },
    { label: 'Xm7',   chord: [0, 0, 0, 0, 0, 0] },
    { label: 'Xdim',  chord: [0, 0, 0, 0, 0, 0] },
    { label: 'Xadd9', chord: [0, 0, 0, 0, 0, 0] },
    { label: 'Xsus4', chord: [0, 0, 0, 0, 0, 0] },
    { label: 'Xaug',  chord: [0, 0, 0, 0, 0, 0] }
  ];

  chords = function() {

    var cRe = /^([A-G]#?)(.*)$/;
    var clst = 'C,C#,D,D#,E,F,F#,G,G#,A,A#,B'.split(/,/g);
    var clstOrd = 'C,D,E,F,G,A,B,C#,D#,F#,G#,A#'.split(/,/g);
    var cmap = {};
    var cmapOrd = {};
    clst.forEach(function(c, i) {
      cmap[c] = i;
    });
    clstOrd.forEach(function(c, i) {
      cmapOrd[c] = i;
    });

    var shifted = new Array(chords.length);
    var numChords = 0;
    chords.forEach(function(chord, i) {
      if (chord.label.match(cRe) ) {
        var t1 = RegExp.$1;
        var t2 = RegExp.$2;
        t1 = clst[(cmap[t1] + 5) % clst.length];
        chord.label = t1 + t2;
        numChords += 1;
      }
    } );
    var numChordPats = ~~(numChords / clst.length)
    chords.forEach(function(chord, i) {
      if (chord.label.match(cRe) ) {
        var t1 = RegExp.$1;
        var t2 = RegExp.$2;
        shifted[(cmapOrd[t1] * numChordPats) + i % numChordPats] = chord;
      } else {
        shifted[i] = chord;
      }
    } );

    return shifted;
  }();

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

  var numFrets = 4;
  var fretPitch = 18;
  var numStrings = 6;
  var strPitch = 10;
  var zeroFretGap = 6;
  var fretStroke = '#000000';
  var chordFill = '#000000';
  var fontFamily = 'Arial';
  var fontSize = 16;
  var fontSizeSmall = ~~(fontSize * 0.75);
  var strokeWidth = 0.5;
  var fretStrokeWidth = 1;
  var openPosRate = 0.5 / 4 * 6;

  var chordRadius  = fretPitch / 4;
  var fretWidth = fretPitch * (numFrets + 0.5);
  var fretHeight = strPitch * (numStrings - 1);

  var appendFret = function(x, y, chordName, chord, shift) {
    shift = shift || 0;
    var fret = $s('g').attrs({
      transform: 'translate(' + x + ' ' + y + ')' });
    svg.append(fret);
    if (shift == 0) {
      fret.append($s('path').attrs({ d: pathBuilder().
        M(-zeroFretGap, 0).L(-zeroFretGap, fretHeight).build(),
        fill: 'none', 'stroke-linecap': 'square',
        'stroke-width': strokeWidth, stroke: fretStroke }) );
    }
    for (var i = 0; i <= numFrets; i += 1) {
      fret.append($s('path').attrs({ d: pathBuilder().
        M(i * fretPitch, 0).
        L(i * fretPitch, fretHeight).
        build(), fill: 'none', 'stroke-linecap': 'butt',
        'stroke-width': shift == 0 && i == 0? strokeWidth * 5 : strokeWidth,
        stroke: fretStroke }) );
    }
    for (var i = 0; i < numStrings; i += 1) {
      fret.append($s('path').attrs({ d: pathBuilder().
        M(-zeroFretGap, i * strPitch).
        L(fretWidth, i * strPitch).
        build(), fill: 'none', 'stroke-linecap': 'square',
        'stroke-width': strokeWidth, stroke: fretStroke }) );
    }
    var open = [];
    for (var i = 0; i < chord.length; i += 1) {
      open.push(0);
    }
    for (var i = 0; i < chord.length; i += 1) {
      if (typeof chord[i] == 'string') {
        if (chord[i].match(/^(\d+)_(\d+)$/) ) {
          var c1 = +RegExp.$1;
          var c2 = +RegExp.$2;
          fret.append($s('rect').attrs({
            x: (c1 - 0.5 - shift) * fretPitch - chordRadius,
            y: i * strPitch,
            width: chordRadius * 2, height: c2 * strPitch,
            fill: chordFill, stroke: 'none' }) );
          fret.append($s('circle').attrs({
            cx: (c1 - 0.5 - shift) * fretPitch, cy: i * strPitch,
            r: chordRadius, fill: chordFill, stroke: 'none' }) );
          fret.append($s('circle').attrs({
            cx: (c1 - 0.5 - shift) * fretPitch, cy: (i + c2) * strPitch,
            r: chordRadius, fill: chordFill, stroke: 'none' }) );
          for (var j = 0; j <= c2; j += 1) {
            open[i + j] = 1;
          }
        }
      } else if (chord[i] == -1) {
        var s = chordRadius - 2;
        fret.append($s('path').attrs({ d: pathBuilder().
          M(-openPosRate * fretPitch - s, i * strPitch - s).
          L(-openPosRate * fretPitch + s, i * strPitch + s).
          build(), fill: 'none', 'stroke-linecap': 'square',
          'stroke-width': fretStrokeWidth * 0.5, stroke: fretStroke }) );
        fret.append($s('path').attrs({ d: pathBuilder().
          M(-openPosRate * fretPitch + s, i * strPitch - s).
          L(-openPosRate * fretPitch - s, i * strPitch + s).
          build(), fill: 'none', 'stroke-linecap': 'square',
          'stroke-width': fretStrokeWidth * 0.5, stroke: fretStroke }) );
      } else if (chord[i] > 0) {
        fret.append($s('circle').attrs({
          cx: (chord[i] - 0.5 - shift) * fretPitch, cy: i * strPitch,
          r: chordRadius, fill: chordFill, stroke: 'none' }) );
        open[i] = 1;
      }
    }
    for (var i = 0; i < chord.length; i += 1) {
      if (chord[i] == 0 && open[i] != 1) {
        fret.append($s('circle').attrs({
          cx: -openPosRate * fretPitch, cy: i * strPitch,
          r: chordRadius - 1, fill: 'none',
          'stroke-width': fretStrokeWidth * 0.5, stroke: fretStroke }) );
      }
    }

    if (chordName.match(/^([A-G])(#?)(.*)$/) ) {

      var t1 = RegExp.$1;
      var t2 = RegExp.$2;
      var t3 = RegExp.$3;

      var appendText = function(s, fontSize, x, y) {
        var text = $s('text').attrs({ x: x, y: y,
          'font-family': fontFamily, 'font-size': fontSize });
        text.$el.textContent = s;
        fret.append(text);
        return text.$el.getBBox().width;
      };

      var x = 0;
      var y = -(chordRadius + 6);

      if (!t2) {

        x += appendText(t1, fontSize, x, y);

      } else {

        var sGap = ~~(fontSizeSmall / 2);
        var base = 'A'.charCodeAt(0);
        var t4 = String.fromCharCode(
            (t1.charCodeAt(0) - base + 1) % 7 + base);

        x += appendText(t1, fontSize, x, y);
        x += appendText(t2, fontSizeSmall, x, y - sGap);
        x += appendText('/', fontSize, x, y);
        x += appendText(t4, fontSize, x, y);
        x += appendText('b', fontSizeSmall, x, y - sGap);
      }

      x += appendText(t3, fontSizeSmall, x, y);
    }

    for (var i = 0; i < numFrets; i += 1) {
      var text = $s('text').attrs({
        x: (i + 0.5) * fretPitch,
        y: fretHeight + chordRadius + fontSizeSmall,
        'text-anchor': 'middle',
        'font-family': fontFamily, 'font-size': fontSizeSmall });
      text.$el.textContent = '' + (i + 1 + shift);
      fret.append(text);
    }
  };

  var marginLeft = 20;
  var marginTop = 60;
  var hGap = 30;
  var vGap = 60;

  var width = (fretWidth + hGap) * 9 -
    hGap + marginLeft * 2;
  var height = (fretHeight + vGap) * ~~(chords.length / 9) -
    vGap + marginTop * 2;

  var svgHolder = document.createElement('div');
  document.body.appendChild(svgHolder);
  var svg = $s('svg').attrs({
    width: width + 'px', height: height + 'px', xmlns: svgNamespace });
  svgHolder.appendChild(svg.$el);

  // bg
  /*
  svg.append($s('rect').attrs({
    x: 0, y: 0, width: width, height: height,
    fill: '#f0f0f0', stroke: '#00f' }));
  */

  var x = marginLeft;
  var y = marginTop;
  for (var i = 0; i < chords.length; i += 1) {
    appendFret(x, y, chords[i].label,
        chords[i].chord, chords[i].shift);
    x += fretWidth + hGap;
    if ( (i + 1) % 9 == 0) {
      x = marginLeft;
      y += fretHeight + vGap;
    }
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
    a.download = 'chords.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
  document.body.appendChild(button);
});

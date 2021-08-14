
'use strict'

window.addEventListener('load', function() {

  var chords = [

    { label: 'C',     chord: [3, 0, 0, 0] },
    { label: 'Cm',    chord: [3, 3, 3, 0] },
    { label: 'C7',    chord: [1, 0, 0, 0] },
    { label: 'CM7',   chord: [2, 0, 0, 0] },
    { label: 'Cm7',   chord: [3, 3, 3, 3] },
    { label: 'Cdim',  chord: [3, 2, 3, 2] },
    { label: 'C6',    chord: [0, 0, 0, 0] },
    { label: 'Caug',  chord: [3, 0, 0, 1] },
    { label: 'Csus4', chord: [3, 1, 0, 0] },

    { label: 'D',     chord: [0, 2, 2, 2] },
    { label: 'Dm',    chord: [0, 1, 2, 2] },
    { label: 'D7',    chord: [3, 2, 2, 2] },
    { label: 'DM7',   chord: [4, 2, 2, 2] },
    { label: 'Dm7',   chord: [3, 1, 2, 2] },
    { label: 'Ddim',  chord: [2, 1, 2, 1] },
    { label: 'D6',    chord: [2, 2, 2, 2] },
    { label: 'Daug',  chord: [1, 2, 2, 3] },
    { label: 'Dsus4', chord: [0, 3, 2, 2] },

    { label: 'E',     chord: [2, 4, 4, 4] },
    { label: 'Em',    chord: [2, 3, 4, 0] },
    { label: 'E7',    chord: [2, 0, 2, 1] },
    { label: 'EM7',   chord: [2, 4, 3, 4] },
    { label: 'Em7',   chord: [2, 0, 2, 0] },
    { label: 'Edim',  chord: [1, 0, 1, 0] },
    { label: 'E6',    chord: [2, 0, 1, 1] },
    { label: 'Eaug',  chord: [3, 0, 0, 1] },
    { label: 'Esus4', chord: [2, 5, 4, 4] },

    { label: 'F',     chord: [0, 1, 0, 2] },
    { label: 'Fm',    chord: [3, 1, 0, 1] },
    { label: 'F7',    chord: [3, 1, 3, 2] },
    { label: 'FM7',   chord: [0, 0, 5, 5] },
    { label: 'Fm7',   chord: [3, 1, 3, 1] },
    { label: 'Fdim',  chord: [2, 1, 2, 1] },
    { label: 'F6',    chord: [3, 1, 2, 2] },
    { label: 'Faug',  chord: [0, 1, 1, 2] },
    { label: 'Fsus4', chord: [1, 1, 0, 3] },

    { label: 'G',     chord: [2, 3, 2, 0] },
    { label: 'Gm',    chord: [1, 3, 2, 0] },
    { label: 'G7',    chord: [2, 1, 2, 0] },
    { label: 'GM7',   chord: [2, 2, 2, 0] },
    { label: 'Gm7',   chord: [1, 1, 2, 0] },
    { label: 'Gdim',  chord: [1, 0, 1, 0] },
    { label: 'G6',    chord: [2, 0, 2, 0] },
    { label: 'Gaug',  chord: [2, 3, 3, 0] },
    { label: 'Gsus4', chord: [3, 3, 2, 0] },

    { label: 'A',     chord: [0, 0, 1, 2] },
    { label: 'Am',    chord: [0, 0, 0, 2] },
    { label: 'A7',    chord: [0, 0, 1, 0] },
    { label: 'AM7',   chord: [0, 0, 1, 1] },
    { label: 'Am7',   chord: [0, 0, 0, 0] },
    { label: 'Adim',  chord: [3, 2, 3, 2] },
    { label: 'A6',    chord: [4, 2, 4, 2] },
    { label: 'Aaug',  chord: [0, 1, 1, 2] },
    { label: 'Asus4', chord: [0, 0, 2, 2] },

    { label: 'B',     chord: [2, 2, 3, 4] },
    { label: 'Bm',    chord: [2, 2, 2, 4] },
    { label: 'B7',    chord: [2, 2, 3, 2] },
    { label: 'BM7',   chord: [1, 2, 3, 4] },
    { label: 'Bm7',   chord: [2, 2, 2, 2] },
    { label: 'Bdim',  chord: [2, 1, 2, 1] },
    { label: 'B6',    chord: [2, 2, 3, 1] },
    { label: 'Baug',  chord: [2, 3, 3, 4] },
    { label: 'Bsus4', chord: [2, 2, 4, 4] },

    { label: 'C#',     chord: [4, 1, 1, 1] },
    { label: 'C#m',    chord: [4, 4, 4, 6], shift: 2 },
    { label: 'C#7',    chord: [2, 1, 1, 1] },
    { label: 'C#M7',   chord: [3, 1, 1, 1] },
    { label: 'C#m7',   chord: [2, 0, 1, 1] },
    { label: 'C#dim',  chord: [1, 0, 1, 0] },
    { label: 'C#6',    chord: [1, 1, 1, 1] },
    { label: 'C#aug',  chord: [0, 1, 1, 2] },
    { label: 'C#sus4', chord: [4, 4, 6, 6], shift: 2 },

    { label: 'D#',     chord: [1, 3, 3, 0] },
    { label: 'D#m',    chord: [1, 2, 3, 3] },
    { label: 'D#7',    chord: [4, 3, 3, 3] },
    { label: 'D#M7',   chord: [5, 3, 3, 3] },
    { label: 'D#m7',   chord: [4, 2, 3, 3] },
    { label: 'D#dim',  chord: [3, 2, 3, 2] },
    { label: 'D#6',    chord: [3, 3, 3, 3] },
    { label: 'D#aug',  chord: [2, 3, 3, 0] },
    { label: 'D#sus4', chord: [1, 4, 3, 3] },

    { label: 'F#',     chord: [1, 2, 1, 3] },
    { label: 'F#m',    chord: [0, 2, 1, 2] },
    { label: 'F#7',    chord: [4, 2, 4, 3] },
    { label: 'F#M7',   chord: [4, 6, 5, 6], shift: 2 },
    { label: 'F#m7',   chord: [4, 2, 4, 2] },
    { label: 'F#dim',  chord: [3, 2, 3, 2] },
    { label: 'F#6',    chord: [4, 2, 3, 3] },
    { label: 'F#aug',  chord: [1, 2, 2, 3] },
    { label: 'F#sus4', chord: [4, 7, 6, 6], shift: 2 },

    { label: 'G#',     chord: [3, 4, 3, 5] },
    { label: 'G#m',    chord: [2, 4, 3, 1] },
    { label: 'G#7',    chord: [3, 2, 3, 1] },
    { label: 'G#M7',   chord: [3, 3, 3, 1] },
    { label: 'G#m7',   chord: [2, 2, 3, 1] },
    { label: 'G#dim',  chord: [2, 1, 2, 1] },
    { label: 'G#6',    chord: [3, 1, 3, 1] },
    { label: 'G#aug',  chord: [3, 0, 0, 1] },
    { label: 'G#sus4', chord: [4, 4, 3, 1] },

    { label: 'A#',     chord: [1, 1, 2, 3] },
    { label: 'A#m',    chord: [1, 1, 1, 3] },
    { label: 'A#7',    chord: [1, 1, 2, 1] },
    { label: 'A#M7',   chord: [0, 1, 2, 3] },
    { label: 'A#m7',   chord: [1, 1, 1, 1] },
    { label: 'A#dim',  chord: [1, 0, 1, 0] },
    { label: 'A#6',    chord: [1, 1, 2, 0] },
    { label: 'A#aug',  chord: [1, 2, 2, 3] },
    { label: 'A#sus4', chord: [1, 1, 3, 3] }

  ];

  var $s = svgtk.$s;
  var pathBuilder = svgtk.pathBuilder;

  var numFrets = 5;
  var fretPitch = 18;
  var numStrings = 4;
  var strPitch = 12;
  var zeroFretGap = 4;
  var fretStroke = '#000000';
  var chordFill = '#000000';
  var fontFamily = 'Arial';
  var fontSize = 16;
  var fontSizeSmall = ~~(fontSize * 0.75);
  var strokeWidth = 0.5;

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
        'stroke-width': shift == 0 && i == 0? strokeWidth * 4 : strokeWidth,
        stroke: fretStroke }) );
    }
    for (var i = 0; i < numStrings; i += 1) {
      fret.append($s('path').attrs({ d: pathBuilder().
        M(-zeroFretGap, i * strPitch).
        L(fretWidth, i * strPitch).
        build(), fill: 'none', 'stroke-linecap': 'square',
        'stroke-width': strokeWidth, stroke: fretStroke }) );
    }
    for (var i = 0; i < chord.length; i += 1) {
      if (chord[i] > 0) {
        fret.append($s('circle').attrs({
          cx: (chord[i] - 0.5 - shift) * fretPitch, cy: i * strPitch,
          r: chordRadius, fill: chordFill, stroke: 'none' }) );
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
  var hGap = 20;
  var vGap = 70;

  var width = (fretWidth + hGap) * 9 -
    hGap + marginLeft * 2;
  var height = (fretHeight + vGap) * ~~(chords.length / 9) -
    vGap + marginTop * 2;

  var svg = svgtk.create(width, height);

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

});

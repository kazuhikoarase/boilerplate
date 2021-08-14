
'use strict'

window.addEventListener('load', function() {

  var c = [
    { label: 'C',     chord: [0, 4, 7]},
    { label: 'Cm',    chord: [0, 3, 7]},
    { label: 'C7',    chord: [0, 4, 7, 10]},
    { label: 'Cm7',   chord: [0, 3, 7, 10] },
    { label: 'CM7',   chord: [0, 4, 7, 11]},
    { label: 'Cadd9', chord: [0, 14, 4, 7] },
    { label: 'C6',    chord: [0, 4, 7, 9] },
    { label: 'Csus4', chord: [0, 5, 7] },
    { label: 'Cdim',  chord: [0, 3, 6, 9] },
    { label: 'Caug',  chord: [0, 4, 8] }
  ];

  var chords = [];

  [
    { label: 'C', tran: 0 },
    { label: 'D', tran: 2 },
    { label: 'E', tran: 4 },
    { label: 'F', tran: 5 },
    { label: 'G', tran: 7 },
    { label: 'A', tran: 9 },
    { label: 'B', tran: 11 },
    { label: 'C#', tran: 1 },
    { label: 'D#', tran: 3 },
    { label: 'F#', tran: 6 },
    { label: 'G#', tran: 8 },
    { label: 'A#', tran: 10 }
  ].forEach(function(d1) {
    c.forEach(function(d2) {
      if (d2.label.match(/^C(.*)$/) ) {
        var name = d1.label + RegExp.$1;
        var chord = d2.chord.map(function(c) {
          return c + d1.tran;
        });
        chords.push({ label: name, chord: chord, shift: d1.tran > 5 ? 3 : 0 });
      }
    });
  });

  var $s = svgtk.$s;
  var pathBuilder = svgtk.pathBuilder;

  var black = '#000000';
  var white = '#ffffff';
  var fontFamily = 'Arial';
  var fontSize = 20;
  var fontSizeSmall = ~~(fontSize * 0.75);
  var strokeWidth = 0.25;

  var wKeyHeight = 60;
  var bKeyHeight = wKeyHeight * 0.6;
  var wKeyPitch = 12;
  var bKeyPitch = wKeyPitch * 7 / 12;
  var numKeys = 14;

  var chordRadius  = wKeyPitch / 4;

  var keysWidth = wKeyPitch * numKeys;
  var keysHeight = wKeyHeight;

  var appendKeys = function(x, y, chordName, chord, shift) {
    shift = shift || 0;

    var cmap = {};
    for (var i = 0; i < chord.length; i += 1) {
      cmap[chord[i]] = true;
    }

    var keys = $s('g').attrs({
      transform: 'translate(' + x + ' ' + y + ')' });
    svg.append(keys);

    keys.append($s('path').attrs({ d: pathBuilder().
      M(0, 0).L(wKeyPitch * numKeys, 0).build(),
      fill: 'none', 'stroke-linecap': 'square',
      'stroke-width': strokeWidth, stroke: black }) );
    keys.append($s('path').attrs({ d: pathBuilder().
      M(0, wKeyHeight).L(wKeyPitch * numKeys, wKeyHeight).build(),
      fill: 'none', 'stroke-linecap': 'square',
      'stroke-width': strokeWidth, stroke: black }) );

    for (var i = 0; i <= numKeys; i += 1) {
      keys.append($s('path').attrs({ d: pathBuilder().
        M(wKeyPitch * i, 0).L(wKeyPitch * i, wKeyHeight).build(),
        fill: 'none', 'stroke-linecap': 'square',
        'stroke-width': strokeWidth, stroke: black }) );
    }

    var wkOffset = [ 0, 2, 4, 5, 7, 9, 11 ];
    var bkPat = [ 0, 1, 1, 0, 1, 1, 1 ];
    var bkOff = [ 0, 1, 3, 0, 6, 8, 10 ];
    for (var i = 1; i < numKeys; i += 1) {
      var bi = (i + shift) % bkPat.length;
      if (bkPat[bi] == 1) {
        var o = bi / 7 - bkOff[bi] / 12;
        keys.append($s('rect').attrs({
           x: wKeyPitch * (i - o) - bKeyPitch / 2,
           y: 0, width: bKeyPitch, height: bKeyHeight,
           'stroke-width': strokeWidth, troke: black, fill: black }) );
      }
    }

    var appendNote = function(note, x, bk, base) {
      if (!cmap[note]) {
        return;
      }
      var y = (bk? bKeyHeight : wKeyHeight) - chordRadius * 3.5;
      if (base) {
        keys.append($s('circle').attrs({
          cx: x, cy: y, r: chordRadius + 5,
          'stroke-width': strokeWidth * 4,
          stroke: 'none', fill: white }) );
      } else {
        keys.append($s('circle').attrs({
          cx: x, cy: y, r: chordRadius + 2,
          'stroke-width': strokeWidth * 4,
          stroke: 'none', fill: black }) );
      }
    };

    for (var b = 0; b < 2; b += 1) {
      var note = wkOffset[shift];
      for (var i = 0; i < numKeys; i += 1) {
        var bi = (i + shift) % bkPat.length;
        if (i > 0 && bkPat[bi] == 1) {
          var o = bi / 7 - bkOff[bi] / 12;
          appendNote(note, wKeyPitch * (i - o), true, b == 0);
          note += 1;
        }
        appendNote(note, wKeyPitch * (i + 0.5), false, b == 0);
        note += 1;
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
        keys.append(text);
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
  };

  var marginLeft = 20;
  var marginTop = 60;
  var hGap = 20;
  var vGap = 60;

  var width = (keysWidth + hGap) * c.length -
    hGap + marginLeft * 2;
  var height = (keysHeight + vGap) * ~~(chords.length / c.length) -
    vGap + marginTop * 2;

  var svg = svgtk.create(width, height);

  var x = marginLeft;
  var y = marginTop;
  for (var i = 0; i < chords.length; i += 1) {
    appendKeys(x, y, chords[i].label,
        chords[i].chord, chords[i].shift);
    x += keysWidth + hGap;
    if ( (i + 1) % c.length == 0) {
      x = marginLeft;
      y += keysHeight + vGap;
    }
  }

});

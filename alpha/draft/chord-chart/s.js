
'use strict'

window.addEventListener('load', function() {

  var $s = svgtk.$s;
  var pathBuilder = svgtk.pathBuilder;

  var bKeyWidth = 8;
  var wKeyWidth = bKeyWidth * 12 / 7;
  var wKeyHeight = 50;
  var bKeyHeight = 30;
  var keyPattern = [ 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0 ];
  var keyOffset = -7;
  var numKeys = 24 + 7;
  var radius = 4;

  var isWhiteKey = function(i) {
    return keyPattern[(i + 12 + keyOffset) % keyPattern.length] == 0;
  };

  var appendKeys = function(opts) {

    var g = $s('g');
    svg.append(g);

    var pattern = {};
    opts.pattern.forEach(function(i) {
      pattern[i] = true;
    });

    !function() {
      var x = opts.x;
      var y = opts.y;
      for (var i = 0; i < numKeys; i += 1) {
        if (isWhiteKey(i) ) {
          g.append($s('rect').attrs({ fill: 'none', stroke: '#000',
            x: x, y: y, width: wKeyWidth, height: wKeyHeight }) );
          if (pattern[i + keyOffset] === true) {
            g.append($s('circle').attrs({
              fill: '#000', stroke: 'none', 'stroke-width': 2,
              cx: x + wKeyWidth / 2,
              cy: y + wKeyHeight - radius - 4,
              r: radius }) );
          }
          x += wKeyWidth;
        }
      }
    }();

    !function() {
      var x = opts.x;
      var y = opts.y;
      for (var i = 0; i < numKeys; i += 1) {
        if (!isWhiteKey(i) ) {
          g.append($s('rect').attrs({ fill: '#000', stroke: '#000',
            x: x, y: y, width: bKeyWidth, height: bKeyHeight }) );
          if (pattern[i + keyOffset] === true) {
            g.append($s('circle').attrs({
              fill: '#000', stroke: '#fff', 'stroke-width': 2,
              cx: x + bKeyWidth / 2,
              cy: y + bKeyHeight - radius - 4,
              r: radius }) );
          }
        }
        x += bKeyWidth;
      }
    }();

  };

  var scales = function() {

    var basicPattern = [ 0, 2, 4, 5, 7, 9, 11 ];

    var scales = [
      { key: 'C', name: 'Ionian', namej: 'イオニアン' },
      { key: 'D', name: 'Dorian', namej: 'ドリアン' },
      { key: 'E', name: 'Phrygian', namej: 'フリジアン' },
      { key: 'F', name: 'Lydian', namej: 'リディアン' },
      { key: 'G', name: 'Mixolydian', namej: 'ミクソリディアン' },
      { key: 'A', name: 'Aeolian', namej: 'エオリアン' },
      { key: 'B', name: 'Locrian', namej: 'ロクリアン' }
    ];

    scales.forEach(function(scale, i) {
      var pattern = basicPattern.slice();
      if (i > 0) {
        for (var j = 0; j < i; j += 1) {
          pattern.push(pattern.shift() + 12);
        }
        if (i > 4) {
          pattern = pattern.map(function(p) { return p - 12; });
        }
      }
      pattern.push(pattern[0] + 12);

      // normalized.
      var patternN = pattern.slice().map(function(p, i) {
        return p - pattern[0];
      }); 

      scale.pattern = pattern;
      scale.patternN = patternN;
    });

    return scales;
  }();

  var marginLeft = 30;
  var marginTop = 50;
  var hGap = 20;
  var vGap = 40;

  var width = 600;
  var height = 800;

  var svg = svgtk.create(width, height, true);

  var appendText = function(s, x, y) {
    var text = $s('text').attrs({ x: x, y: y,
      'font-size': 12, 'font-family': '"小塚ゴシック Pro", Arial' });
    text.$el.textContent = s;
    svg.append(text);
  };

  scales.forEach(function(scale, i) {
    var y = marginTop + i * (wKeyHeight + vGap);
    appendText(scale.key + ' ' + scale.name +
      ' （' + scale.namej + '）', marginLeft, y - 5);
    appendKeys({
      x: marginLeft,
      y: y, pattern: scale.pattern });
    appendKeys({
      x: marginLeft + bKeyWidth * numKeys + hGap,
      y: y, pattern: scale.patternN });
  });

});

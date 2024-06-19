
'use strict'

import { svgtk } from './svgtk.js';

window.addEventListener('load', function() {

  var gcd = function(a, b) {
    var a_;
    if (a > b) {
      a_ = a;
      a = b;
      b = a_;
    }
    while (a >= 1) {
      a_ = b % a;
      if (a_ == 0) {
        return a;
      }
      b = a;
      a = a_;
    }
    throw 'error: a=' + a + ', b=' + b;
  };

  var hsl2rgb = function() {
    var ctx = document.createElement('canvas').getContext('2d',
      { willReadFrequently : true });
    ctx.canvas.width = 1;
    ctx.canvas.height = 1;
    var hex = '0123456789abcdef';
    var toHex = function(i) {
      return hex.charAt( (i >>> 4) & 0xf) + hex.charAt(i & 0xf);
    };
    return function(h, s, l, a) {
      h = typeof h == 'number'? h : 0;
      s = typeof s == 'number'? s : 100;
      l = typeof l == 'number'? l : 100;
      a = typeof a == 'number'? a : 100;
      ctx.fillStyle = 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + '%)';
      ctx.fillRect(0,0,1,1);
      var img = ctx.getImageData(0, 0, 1, 1);
      return '#' + toHex(img.data[0]) + toHex(img.data[1]) + toHex(img.data[2]);
//      return 'rgba(' + img.data[0] + ',' + img.data[1] + ',' + img.data[2] + ',' + img.data[3] / 255 + ')';
    }
  }();

console.log('gcd', gcd(3,2) );
console.log('gcd', gcd(100,7) );

  var $ = svgtk.domWrapper;
  var $math = svgtk.math;
  var $pb = svgtk.pathBuilder;

  var div = 64;
  var n = 2;
  var rp = 100;
  var numDivs = rp * div;
  var deltaTheta = Math.PI * 2 / div;

  var param = { r1 : 350, r2 : 180, r3 : 155 };

  var fn = function(t) {
    var ft = function(t) {
      return -(param.r1 / param.r2 - 1) * t;
    };
    return [
      (param.r1 - param.r2) * Math.cos(t) + param.r3 * Math.cos(ft(t) ) + 400,
      (param.r1 - param.r2) * Math.sin(t) + param.r3 * Math.sin(ft(t) ) + 400
    ];
  };

  var $svg = $('svg').attrs({ width: 800, height: 800 });
  $svg.append($('rect').attrs({
    width: 800, height: 800, fill: '#000000', stroke: 'none'}) );

  for (var i = 0; i < numDivs; i += 1) {
    var d = $math.getQuadPoints({ fn : fn,
      min : deltaTheta * i,
      max : deltaTheta * (i + 1),
      n : n, dt : 0.1
    });
    var pb = $pb();
    d.forEach(function(p, i) {
      if (i == 0) {
        pb.moveTo(p[0], p[1]);
      } else {
        pb.quadTo(p[0], p[1], p[2], p[3]);
      }
    });
    var hue = (360 * i / rp) % 360;
    var color = hsl2rgb(hue, 100, 50);
    $svg.append($('path').attrs({d: pb.build(), fill: 'none', stroke: color,'stroke-width': 4 }) );
  }
  document.body.appendChild($svg.$el);

  document.querySelector('#t1').textContent =
    document.querySelector('BODY').namespaceURI;
  document.querySelector('#t2').textContent =
    document.querySelector('svg').namespaceURI;
});

var download = function() {

  var filename = '2_test.svg';

  var svg = document.querySelector('svg').cloneNode(true);
  svg.setAttribute('xmlns', svg.namespaceURI);
  var data = svg.outerHTML;

  var blob = new Blob([ data ], { type : 'application/octet-stream' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

};

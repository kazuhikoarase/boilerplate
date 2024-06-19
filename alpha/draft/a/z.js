
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
    return function(h, s, l) {
      h = typeof h == 'number'? h : 0;
      s = typeof s == 'number'? s : 100;
      l = typeof l == 'number'? l : 100;
      ctx.fillStyle = 'hsl(' + h + ',' + s + '%,' + l + '%)';
      ctx.fillRect(0,0,1,1);
      var img = ctx.getImageData(0, 0, 1, 1);
      return '#' + toHex(img.data[0]) + toHex(img.data[1]) + toHex(img.data[2]);
    }
  }();

  var $ = svgtk.domWrapper;
  var $math = svgtk.math;
  var $pb = svgtk.pathBuilder;

  

/*
  var param = { r1 : 350, r2 : 235, r3 : 200 };
  var param = { r1 : 350, r2 : 255, r3 : 200 };
  var param = { r1 : 350, r2 : 185, r3 : 110 };
  var param = { r1 : 350, r2 : 195, r3 : 140 };
  var param = { r1 : 350, r2 : 165, r3 : 120 };
  var param = { r1 : 350, r2 : 135, r3 : 50 };
*/
//  var param = { r1 : 350, r2 : 185, r3 : 150 };

//  var param = { r1 : 350, r2 : 235, r3 : 200 };


  var width = 800;
  var height = 800;

  var $svg = $('svg').attrs({
    width: width, height: height,
    viewBox : '0 0 ' + width + ' ' + height
  });
  document.body.appendChild($svg.$el);

  var update = function() {

    var fn = function(t) {
      var ft = function(t) {
        return -(param.r1 / param.r2 - 1) * t;
      };
      return [
        (param.r1 - param.r2) * Math.cos(t) + param.r3 * Math.cos(ft(t) ) + 400,
        (param.r1 - param.r2) * Math.sin(t) + param.r3 * Math.sin(ft(t) ) + 400
      ];
    };

    var param = {
      r1 : +r1.value,
      r2 : +r2.value,
      r3 : +r3.value
    };

    var rp = param.r1 / gcd(param.r1, param.r2);

    var div = 2;
    var n = 8;
    var numDivs = rp * div;
    var deltaTheta = Math.PI * 2 / div;

    while ($svg.$el.firstChild) {
      $svg.$el.removeChild($svg.$el.firstChild);
    }

    var $g = $('g');
    $svg.append($g);

    $g.append($('rect').attrs({
      x:0,y:0, width: width, height: height,
      fill: '#000000', stroke: 'none' }) );

    var hue =  coff.value;
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
//      var hue = (360 * i / numDivs + coff.value) % 360;
      var color = hsl2rgb(hue, 100, 50);
      $g.append($('path').attrs({d: pb.build(),
       fill: 'none', stroke: color,'stroke-width': 8, opacity : 0.5 }) );
       hue = (hue + 360 / rp) % 360;
    }
  };

  var r1 = document.getElementById('r1');
  var r2 = document.getElementById('r2');
  var r3 = document.getElementById('r3');
  var coff = document.getElementById('coff');
  var download = document.getElementById('download');

  var valueChangeHandler = function() {
    update();
  };
  var eventType = 'input';
  r1.addEventListener(eventType, valueChangeHandler);
  r2.addEventListener(eventType, valueChangeHandler);
  r3.addEventListener(eventType, valueChangeHandler);
  coff.addEventListener(eventType, valueChangeHandler);
  r1.dispatchEvent(new Event(eventType, { bubbles : true }) );
  download.addEventListener('click', function(event) {
    download_clickHandler();
  });

  var download_clickHandler = function() {

    var filename = r1.value + '_' + r2.value + '_' + r3.value + '_' + coff.value + '_spiral.svg';

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

});


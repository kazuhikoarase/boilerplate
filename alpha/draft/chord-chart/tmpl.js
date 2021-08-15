
'use strict'

window.addEventListener('load', function() {

  var $s = svgtk.$s;
  var pathBuilder = svgtk.pathBuilder;

  var width = 400;
  var height = 300;

  var svg = svgtk.create(width, height, true);

  // TODO
  svg.append($s('rect').attrs({ 
    fill: 'red', stroke: 'none',
    x: 10, y: 10, width: 40, height: 20}) );

});

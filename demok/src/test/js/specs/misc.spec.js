'use strict';

describe('jquery test', function() {

  it('dom creation', function(done) {

    var repeat = 1000;
    var colors = [ 'red', 'green', 'blue' ];
    var x = 0;

    for (var i = 0; i < repeat; i += 1) {
      colors.forEach(function(color) {
        $('BODY').append($('<div></div>').css({
          position: 'absolute',
          backgroundColor: color,
          left : x + 'px', top : x + 'px',
          width: '10px', height: '10px' }) );
        x += 2;
      });
    }
 
    setTimeout(function() { done(); }, 500);

  });

});

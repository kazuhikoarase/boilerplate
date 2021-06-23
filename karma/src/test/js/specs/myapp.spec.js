
//---------------------------------------------------------------
// load myapp
//---------------------------------------------------------------

// load css(s)
require('../../../main/js/myapp.css');

// load myapp entry point.
require('../../../main/js/myapp.js');

//---------------------------------------------------------------
// test
//---------------------------------------------------------------
 
describe('myapp test', function() {

  var vm = null;

  beforeEach(function() {

    // load html template
    var tmpl = window.__html__['specs/myapp.html'];
    document.body.innerHTML = tmpl;
 
    vm = new Vue({ 
      el : '#app',
      data : {
        message : 'hello vue!'
      }
    });
  });

  it('init vue', function(done) {

    expect(typeof vm).toBe('object');
 
    setTimeout(function() { done(); }, 500);
  });

  it('change message', function(done) {

    vm.message = 'hello, second test!';

    expect(typeof vm).toBe('object');

    setTimeout(function() { done(); }, 500);
  });

});


//---------------------------------------------------------------
// load mypkg
//---------------------------------------------------------------

const mypkg = require('../../../main/ts/mypkg.ts');

describe('mypkg test', function() {

  it('init AImpl', function() {

    var a = new mypkg.AImpl();
    a.setA('test');

    expect(a.a).toBe('test');

  });

});

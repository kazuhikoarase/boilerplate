declare var require: any, describe : any, it : any, expect : any;

describe('myapp', function() {

  var myns = require('./myapp');

  it('myns', function() {
    expect('object').toEqual(typeof myns);
  });

  it('myns.test', function() {
    expect(typeof myns.test1).toEqual('function');
    expect(typeof myns.test2).toEqual('undefined');
    expect(typeof myns.test3).toEqual('function');
  });

});

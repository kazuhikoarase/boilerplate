
var x = "aaaaaaaaa";
/*
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  }
}(function () {
    return "hi!";
}));
*/
import b from './b.js';

export default "[a.js]" + b;

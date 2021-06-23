
'use strict';

namespace myns {

  declare var exports : any;
  declare var module : any;

  if (typeof exports === 'object') {
    module.exports = myns;
  }
}

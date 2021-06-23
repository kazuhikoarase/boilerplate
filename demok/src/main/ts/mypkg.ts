namespace mypkg {

  declare var exports : any, module : any;
  if (typeof exports === 'object') {
    module.exports = mypkg;
  }

}

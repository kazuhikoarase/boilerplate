
'use strict';

namespace myns {
  export function test1(msg : string) : void {
    console.log('test1');
  }
}

namespace myns {
  function test2() {
    console.log('test2');
    test1('test');
  }

  export function test3() {
    console.log('test3');
    test2();
  }
}

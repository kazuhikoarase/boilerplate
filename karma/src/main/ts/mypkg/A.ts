
namespace mypkg {

  export interface A {
    a : string;
  }
 
  export class AImpl implements A {
    public a : string;
    public setA(a : string) {
      this.a = a;
    }
  }
}

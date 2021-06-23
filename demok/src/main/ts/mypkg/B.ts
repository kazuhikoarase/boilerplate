
namespace mypkg {

  export interface B {
    b : string;
  }
 
  export class BImpl implements B {
    public b : string;
    public setA(a : A) {
      this.b = a.a;
    }
  }
}

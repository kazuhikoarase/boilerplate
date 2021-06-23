namespace mypkg {

  export class TreeNode<T> {
    private parent : TreeNode<T> = null;
    private children : TreeNode<T>[] = null;
    private userObject : T;
    constructor(userObject : T) {
      this.userObject = userObject;
    }
    public getUserObject() { return this.userObject; }
    public numChildren() {
      return this.children? this.children.length : 0;
    }
    public getChildAt(index : number) : TreeNode<T> {
      return this.children[index];
    }
    public getParent() { return this.parent; }
    public addChild(child : TreeNode<T>) {
      if (child.parent) {
        child.parent.removeChild(child);
      }
      (this.children || (this.children = [])).push(child);
      child.parent = this;
    }
    public removeChild(child : TreeNode<T>) {
      if (child.parent != this) {
        throw 'not my child';
      }
      var children : TreeNode<T>[] = [];
      this.children.forEach(function(item) {
        if (item != child) {
          children.push(item);
        }
      });
      this.children = children;
      child.parent = null;
    }
  }

}

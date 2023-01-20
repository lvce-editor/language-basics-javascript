class Foo {
  static one(a) { return a; };
  two(b) { return b; }
  finally() {}
}

class Foo extends require('another-class') {
  constructor() { super(); }
  bar() { super.a(); }
  prop;
  etc = 20;
  static { f() }
}

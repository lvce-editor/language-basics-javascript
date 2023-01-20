class Foo {
  #bar() { this.#a() + this?.#prop == #prop in this; }
  #prop;
  #etc = 20;
}

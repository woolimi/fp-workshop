export class Maybe {
  constructor(value) {
    this.$value = value;
  }

  static of(value) {
    return new Maybe(value);
  }

  get isNothing() {
    return this.$value === null || this.$value === undefined;
  }

  map(fn) {
    return this.isNothing ? this : Maybe.of(fn(this.$value));
  }

  toString() {
    return this.isNothing ? "Nothing" : `Just(${this.$value})`;
  }

  chain(fn) {
    return this.isNothing ? this : fn(this.$value);
  }
}

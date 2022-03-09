import { pipe } from "ramda";

export class IO {
  static of(value) {
    return new IO(() => value);
  }

  constructor(fn) {
    this.$value = fn;
  }

  map(fn) {
    return new IO(pipe(this.$value, fn));
  }

  runIO() {
    return this.$value();
  }
}

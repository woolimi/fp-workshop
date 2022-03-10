export const log = console.log;
export const add = (a, b) => a + b;
export const InvalidIterError = new Error("Invalid Iterator");

export const curry =
  (f) =>
  (a, ...args) =>
    args.length ? f(a, ...args) : (...args2) => f(a, ...args2);

export const isIterable = (iter) => typeof iter[Symbol.iterator] === "function";
export const isAsyncIterable = (iter) => typeof iter[Symbol.asyncIterator] === "function";

export const toAsync = (iter) => {
  const iterator = iter[Symbol.iterator]();

  return {
    next() {
      const { value, done } = iterator.next();
      return value instanceof Promise ? value.then((value) => ({ done, value })) : { done, value };
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
};

export const map = curry((f, iter) => {
  const _async = async function* (f, iter) {
    for await (const a of iter) {
      yield await f(a);
    }
  };
  const _sync = function* (f, iter) {
    for (const a of iter) {
      yield f(a);
    }
  };

  if (isIterable(iter)) return _sync(f, iter);
  if (isAsyncIterable(iter)) return _async(f, iter);
  throw InvalidIterError;
});

export const filter = curry((f, iter) => {
  const _async = async function* (f, iter) {
    for await (const a of iter) {
      if (await f(a)) yield a;
    }
  };
  const _sync = function* (f, iter) {
    for (const a of iter) {
      yield f(a);
    }
  };

  if (isIterable(iter)) return _sync(f, iter);
  if (isAsyncIterable(iter)) return _async(f, iter);
  throw InvalidIterError;
});

export const go1 = (a, f) => (a instanceof Promise ? a.then(f) : f(a));

export const reduce = curry((f, acc, iter) => {
  const _async = async (f, acc, iter) => {
    for await (const a of iter) {
      acc = await f(acc, a);
    }
    return acc;
  };

  const _sync = (f, acc, iter) => {
    for (const a of iter) {
      acc = f(acc, a);
    }
    return acc;
  };

  if (!iter && isIterable(acc)) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
    return _sync(f, acc, iter);
  }

  if (!iter && isAsyncIterable(acc)) {
    iter = acc[Symbol.asyncIterator]();
    return iter.next().then(({ value }) => {
      return _async(f, value, iter);
    });
  }

  if (isIterable(iter)) return _sync(f, acc, iter);
  if (isAsyncIterable(iter)) return _async(f, acc, iter);
  throw InvalidIterError;
});

export const peek = curry((f, iter) => {
  const _async = async function* (f, iter) {
    for await (const a of iter) {
      yield (await f(a), a);
    }
  };
  const _sync = function* (f, iter) {
    for (const a of iter) {
      yield (f(a), a);
    }
  };

  if (isIterable(iter)) return _sync(f, iter);
  if (isAsyncIterable(iter)) return _async(f, iter);
  throw InvalidIterError;
});

export const go = (...args) => reduce(go1, args);

export const toArray = (iter) => {
  const _async = async (iter) => {
    const res = [];
    for await (const a of iter) {
      res.push(a);
    }
    return res;
  };

  if (isIterable(iter)) return Array.from(iter);
  if (isAsyncIterable(iter)) return _async(iter);
  throw InvalidIterError;
};

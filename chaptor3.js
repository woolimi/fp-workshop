import { pipe, map, prop, curry, find, chain } from "ramda";
import { log } from "./final.js";

const go = (a, ...fns) => pipe(...fns)(a);

const products = [
  { id: "candy", name: "Candy", price: 10, onSale: true },
  { id: "ice-cream", name: "Ice cream", price: 20, onSale: true },
  { id: "cake", name: "Cake", price: 30, onSale: false },
  { id: "donuts", name: "Donuts", price: 15, onSale: true },
  { id: "chocolate", name: "Chocolate", price: 12, onSale: false },
  { id: "flower", name: "Flower", price: 40, onSale: false },
  { id: "sofa", name: "Sofa", price: 120, onSale: true },
  { id: "bed", name: "Bed", price: 400, onSale: true },
];

// https://media.vlpt.us/post-images/nakta/25f48720-0f89-11ea-8624-d722fff9885b/image.png

// #################################################################
// ### Maybe: By passing error
import { Maybe } from "./monads/Maybe.js";

const getMaybe = curry((maybe) => (maybe.isNothing ? undefined : maybe.$value));

// Maybe.of(products)
//   .map(find((p) => p.id === "candy"))
//   .map(prop("price"))
//   .map((p) => log(p));

// go(
//   products,
//   Maybe.of,
//   map(find((p) => p.id == "candy")),
//   map(prop("price")),
//   getMaybe,
//   log,
// );

// #################################################################
// ### Either: Either do A or do B
import { Either } from "./monads/Either.js";

const either = curry((l, r, e) => {
  return e.isLeft ? l(e.$value) : r(e.$value);
});

// go(
//   products,
//   find((p) => p.id === "candy"),
//   (product) => (!product ? Either.left("Sorry!") : Either.right(product)),
//   either(
//     (l) => log("Product not found", l),
//     (r) => log("Product : ", r),
//   ),
// );

// #################################################################
// ### IO : sync I/O
import { IO } from "./monads/IO.js";
const localStorage = {
  _data: {},
  setItem(key, value) {
    this._data[key] = value;
  },
  getItem(key) {
    return this._data[key];
  },
  removeItem(key) {
    delete this._data[key];
  },
};

// const io = IO.of(localStorage)
//   .map((storage) => storage.getItem("isContractSigned")) // Non pure function
//   .map((status) => (status === true ? "Signed" : "Not Signed")) // Pure function
//   .map(log);

// localStorage.setItem("isContractSigned", false);
// io.runIO();
// localStorage.setItem("isContractSigned", true);
// io.runIO();

// #################################################################
// ### Future : async I/O
import { Future, fork } from "fluture";

// const future = Future((reject, resolve) => {
//   const t = setTimeout(() => resolve(42), 1000);

//   return () => {
//     log("canceled!");
//     clearTimeout(t); // for cancel
//   };
// });
// const rejected = (value) => log("rejection", value);
// const resolved = (value) => log("rejection", value);

// const cancel = fork(rejected)(resolved)(future);

// cancel();

// #################################################################
// ### Monad Chaining :  Connect between two monad

const maybeFindProductsById = curry((id, products) => {
  return Maybe.of(products.find((p) => p.id === id));
});

const eitherCheaperThan = curry((price, product) => {
  return product.price < price
    ? Either.right(product)
    : Either.left("This product is not cheap");
});

const maybeProductOnSale = (product) => {
  return product.onSale ? Maybe.of(product) : Maybe.of(null);
};

// go(
//   products,
//   maybeFindProductsById("candy"), // Maybe
//   chain(eitherCheaperThan(30)), // Either
//   chain(maybeProductOnSale), // Maybe
//   (monad) => monad.$value,
//   log,
// );

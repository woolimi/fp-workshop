import { delay } from "@fxts/core";
import { log } from "./final.js";

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

// #################################################################
// ### Imperative vs Functional
// 1. Imperative
// Total price of 3 products less than 30
// function f1() {
//   let total = 0;
//   let count = 0;
//   for (const a of products) {
//     if (a.price < 30) {
//       total += a.price;
//       count++;
//     }
//     if (count === 3) break;
//   }
//   console.log(total);
// }

// f1();

// 2. Functional
// Total price of 3 products less than 30

// #################################################################
// ### Monad(functor), Promise
// - f * g
// - f(g(x)) = f(g(x))
// - f(g(x)) = x

// const g = (a) => a + 1;
// const f = (a) => a * a;

// log(f(g(1)));

// [1]
//   .map(g)
//   .map(f)
//   .forEach((a) => log(a));

// #################################################################
// ### Promise (from Future monad)
// - f(g(x)) = g(x)

// const g = JSON.parse;
// const f = ({ k }) => k;

// Promise.resolve('{"k": 1}').then(g).then(f).then(log).catch(log);

// #################################################################
// ### Async with FP
// Get total price of onSale products
const ProductAPI = {
  async fetch(name) {
    await delay(200);
    const product = products.find((p) => p.name === name);
    return product || Promise.reject({ message: "No product" });
  },
};

// go(["candy", "ice-cream", "cake", "donuts", "chocolate"], log);

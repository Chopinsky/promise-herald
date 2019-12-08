'use strict';

const herald = require('./index');

const heavyWork = function() {
  let target = 255;
  let count = 10;

  // run the Fibonacci Sequence to the 255th number (with mod to 1^10),
  // for 10 iterations
  while (count > 0) {
    let a = 0;
    let b = 1;

    for (let i = 0; i < target; i++) {
      let temp = b;
      b = (a + b) % 1e10;
      a = temp % 1e10;
    }

    count--;
  }

  return 42;
};

const heavyPromise = new Promise(resolve => {
  resolve(heavyWork());
});

describe('promise-herald tests', () => {
  test("function calls", () => {
    const h = herald(heavyWork);

    h.notify(val => {
      expect(val).toBe(42);
    });

    setTimeout(() => {
      h.notify(val => {
        expect(val).toBe(42);
      });
    }, 1);
  });

  test("promise calls", () => {
    const h = herald(heavyPromise);

    h.notify(val => {
      expect(val).toBe(42);
    });

    setTimeout(() => {
      h.notify(val => {
        expect(val).toBe(42);
      });
    }, 1);
  });
});

'use strict';

const herald = require("../src/index");

const heavyWork = function() {
  let target = 255;
  let count = 10;
  let result = -1;

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

    result = b;
    count--;
  }

  return result;
};

const h = herald(heavyWork);

console.log("1st subscriber in queue... \n");

h.notify((val, err) => {
  console.log("from the 1st subscriber: ");
  console.log("value: ", val, "; error: ", err || "<none>");
  console.log();
});

setTimeout(() => {
  console.log("2nd subscriber in queue... \n");

  h.notify((val, err) => {
    console.log("from the 2nd subscriber: ");
    console.log("value: ", val, "; error: ", err || "<none>");
    console.log();
  });
}, 1600);

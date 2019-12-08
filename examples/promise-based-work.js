"use strict";

const herald = require("../src/index");

const promisedWork = new Promise(resolve => {
  setTimeout(() => {
    let a = 0;
    let b = 1;
    let target = 255;

    for (let i = 0; i < target; i++) {
      let temp = b;
      b = (a + b) % 1e10;
      a = temp % 1e10;
    }

    resolve(b);
  }, 800);
});

const h = herald(promisedWork);

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

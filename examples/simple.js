'use strict';

const herald = require("../src/index");

const h = herald(
  new Promise(resolve => {
    setTimeout(() => {
      console.log("ready to dispatch data ... \n");
      resolve(42);
    }, 800);
  })
);

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

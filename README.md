# promise-herald

A nimble npm package that dispatch the resolvement or rejection of a promise to 
many subscribers, regardless of when they decide to listen to the promise.

This package can also help create an immutable data dispatcher, where the source
can only be retrieved in their pristine state, and not modified.

## install

The package can be used in both node programs, as well as in the frontend JavaScript
projects. To use the package, install it and add the dependency:

```javascript
$ npm install promise-herald
```

or

```javascript
$ yarn add promise-herald
```

## example

Subscriber can arriave at anytime and still get the results:

```javascript
// import the package
const herald = require("../src/index");

// a heavy work -- it can be either CPU intensive or IO intensive.
const heavyWork = function () {
  let target = 255;
  let count = 10;
  let result = -1;

  // run the Fibonacci Sequence to the 255th number, for 10 iterations
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

  // send the results back, indicating that we have finished the work
  return result;
};

// running the work in an unblock manner, until the result is ready
const h = herald(heavyWork);

// the 1st subscriber is in queue immediately ...
console.log("1st subscriber in queue... \n");

h.notify((val, err) => {
  console.log("from the 1st subscriber: ");
  console.log("value: ", val, "; error: ", err || "<none>");
  console.log();
});

// the 2nd subscriber is in queue ... 1.6 seconds later
setTimeout(() => {
  console.log("2nd subscriber in queue... \n");

  h.notify((val, err) => {
    console.log("from the 2nd subscriber: ");
    console.log("value: ", val, "; error: ", err || "<none>");
    console.log();
  });
}, 1600);
```

'use strict';

let runtime = null;
const newSubscriberEvent = "newSubscriber";
const dataRecvEvent = "promiseDataReceived";

const createRuntime = function (nodejsMode) {
  let emitter;

  if (nodejsMode) {
    if (typeof require !== "function") {
      throw new Error(
        "The package only supports a bowser or NodeJS based JavaScript runtime ... "
      );
    }

    const events = require("events");
    emitter = new events.EventEmitter();
  }

  runtime = {
    subscribe: function (event, listener, once) {
      if (nodejsMode) {
        once ? emitter.once(event, listener) : emitter.on(event, listener);
      } else {
        window.addEventListener(event, listener, { once });
      }
    },
    dispatch: function (event) {
      if (nodejsMode) {
        emitter.emit(event);
      } else {
        window.dispatchEvent(new Event(event));
      }
    }
  };
};

const herald = function (promise) {
  if (!runtime) {
    createRuntime(typeof window === 'undefined');
  }

  const type = typeof promise;

  if (type !== "function" && !(promise instanceof Promise)) {
    throw new Error(
      "You must provide a Promise object, or a function, to the hearld ... "
    );
  }

  if (type === 'function') {
    const fn = promise;
    promise = new Promise((resolve, reject) => {
      try {
        resolve(fn());
      } catch (e) {
        reject(
          new Error(`Promise has encountered an error: ${e.message}`)
        );
      }
    });
  }

  // define events and store
  let store = { data: null, err: null };

  // execute the promise at the first chance
  promise
    .then(val => {
      store.data = val;
      runtime.dispatch(dataRecvEvent);
    })
    .catch(val => {
      store.err = val;
      runtime.dispatch(dataRecvEvent);
    });

  // keep pending listeners on stack
  let callbacks = [];

  // announcer
  const announce = function (subscribers) {
    while (subscribers.length > 0) {
      const cb = subscribers.pop();

      if (typeof cb === 'function') {
        cb(store.data, store.err);        
      }
    }
  };

  runtime.subscribe(
    dataRecvEvent, 
    function () {
      // wake up all the subscribers and announce the arrival of the data
      announce(callbacks);

      // keep the new subscribers aware of the promise execution results
      runtime.subscribe(newSubscriberEvent, function() {
        // only affecting new subscribers, since
        announce(callbacks);
      });
    }, 
    { 
      once: true 
    },
  );

  return {
    notify: function (cb) {
      if (Array.isArray(cb)) {
        callbacks.push(...cb);
      } else {
        callbacks.push(cb);
      }

      runtime.dispatch(newSubscriberEvent);
    },
  };
};

module.exports = herald;

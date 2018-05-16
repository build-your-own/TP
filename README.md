# TP

tiny + promise = TP

## describe

Implement the *Promise A+ Spec*. But `all()` and `race` are builted by my mind, not follow the *ECMAScript 2015 Spec*.

## Usage

some as `Promise`.

```
const TP = require('TP');

const tp = new TP((resolve, reject) => {
  setTimeout(() => {
    resolve('done!');
  }, 100);
});

tp.then(res => {
  console.log(res) // done!
});
```

## Spec

[Promises/A+](https://promisesaplus.com/)

[Promise Abstract Operations](https://www.ecma-international.org/ecma-262/6.0/#sec-promise-objects)
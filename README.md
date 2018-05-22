# TP

[![Build Status](https://travis-ci.org/build-your-own/TP.svg?branch=master)](https://travis-ci.org/build-your-own/TP)
[![codecov](https://codecov.io/gh/build-your-own/tp/branch/master/graph/badge.svg)](https://codecov.io/gh/build-your-own/tp)

tiny + promise = TP 

## describe

Implement the *Promise A+ Spec*. But `all()` and `race` are builted by my mind, not follow the *ECMAScript 2015 Spec*.

## Usage

Same as official `Promise` API.

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

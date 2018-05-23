# TP 

![logo](https://image.ibb.co/fOkv0o/Dot_A_Town_Portal_Scroll.jpg)

[![Build Status](https://travis-ci.org/build-your-own/TP.svg?branch=master)](https://travis-ci.org/build-your-own/TP)
[![codecov](https://codecov.io/gh/build-your-own/tp/branch/master/graph/badge.svg)](https://codecov.io/gh/build-your-own/tp)

tiny + promise = TP

## describe

Implement the *Promise A+ Spec*. But `all()` and `race` are builted by myself and might have some problem.

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

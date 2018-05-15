const TP = require('../src');

var a = new TP((resolve) => {
  setTimeout(() => {
    resolve('a resolved');
  }, 1000);
})

var b = new TP((resolve) => {
  setTimeout(() => {
    resolve('b resolved');
  }, 1000);
})

var tpall = TP.all([a, b]);

tpall
  .then(res => {
    console.log(res)
  })
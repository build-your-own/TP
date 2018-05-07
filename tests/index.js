const a = new Promise((resolve, reject) => resolve('test resolve'));

// then 方法第二个参数， onRejected， 只 handle 创建的Promise里面的reject。并不handle当前的Promise
a
.then(
  (val) => {
    console.log('then 1');
    // throw new Error('haha');
    // console.log(val);
    // return 22;
  }
)
.then((val) => {
  console.log('then 2');
})
.then(() => {
  console.log('then 3');
})
.catch((reason) => {
  console.log('catch 1');
  throw new Error('haha in catch');
})
.then((val) => {
  console.log('then 4')
  throw new Error('then 4 throw new error'); // 如果此时抛出异常 e 则下一个 promise 不会执行 而是会返回异常 e
}, (err) => {
  console.log(`then onReject reason ${err}`);
})
.then(val => {
  console.log('then 5');
}, (err) => {
  console.log(`then onReject reason ${err}`);
  throw new Error('then 5 throw new error at onRejected function');
})
.then(val => {
  console.log('then 6');
})
.catch((reason) => {
  console.log('catch 2');
})
.then((res) => {
  console.log('then 7');
})
.catch((reason) => {
  console.log('catch 3');
})
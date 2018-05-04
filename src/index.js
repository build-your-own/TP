
const TPStatus = {
  PANDING: 'panding',
  FULFILLED: 'fulfilled',
  REJECT: 'rejected',
};

const { PANDING, FULFILLED, REJECT } = TPStatus;


var a = function (params) {
  
}

a.once

class TP {
  constructor(fn) {
    this.errorObj = {};
    this.status = PANDING;
    this.value = null;
    this.reason = null;
    this.thenFnQueue = [];
    fn(this.resolve.bind(this), this.reject.bind(this));
  }

  then(onFulfilled, onRejected) {
    if (typeof onFulfilled !== 'function') onFulfilled = () => {};
    if (onRejected && typeof onRejected !== 'function') onRejected = () => {};
    if (this.status === PANDING) {
      this.thenFnQueue.push(TP.prototype.then.bind(this, onFulfilled, onRejected));
      return this;
    };
    this.updateValue(onFulfilled(this.value));
    return this;
  }

  catch(rejectFunc) {
    this.updateReason(rejectFunc());
    return this;
  }
  
  resolve(value) {
    this.updateStatus(FULFILLED);
    this.updateValue(value);
    this.thenFnQueue.forEach(fn => {
      fn(this.value);
    })
    return this;
  }
  
  reject(err) {
    this.updateStatus(FULFILLED);
    this.updateReason(err);
    return this;
  }

  updateStatus(status) {
    this.status = status;
  }

  updateValue(value) {
    this.value = value;
  }

  updateReason(reason) {
    this.reason = reason;
  }

  static resolve() {
    this.resolve.call(this, ...this.arguments);
  }

  static reject() {
    this.resolve.call(this, ...this.arguments);
  }
}

const ajaxAsync = () => {
  return new TP((resolve, reject) => {
    setTimeout(() => {
      resolve(200);
    }, 2000);
  })
}

var tp1 = ajaxAsync()
  .then((val) => {
    console.log(val);
    return val + 100;
  }).then(val => {
    return val + 200;
  })

var tp2 = tp1.then((val) => console.log(val));

console.log(tp1 === tp2)

module.exports = TP;
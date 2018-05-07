
const TPStatus = {
  PANDING: 'panding',
  FULFILLED: 'fulfilled',
  REJECT: 'rejected',
};

const { PANDING, FULFILLED, REJECT } = TPStatus;

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
    if (this.status === REJECT) {
      onRejected(); // TODO
    }
    try {
      this.updateValue(onFulfilled(this.value));
    } catch (error) {
      this.updateReason(error);
      onRejected(error);
    }
    return this;
  }

  catch(rejectFunc) {
    this.updateReason(rejectFunc());
    return this;
  }
  
  resolve(value) {
    this.updateStatus(FULFILLED);
    this.updateValue(value);
    this.thenFnQueue.forEach(fn => fn());
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
    throw new Error('test throw new error');
    return val + 100;
  }, (err) => {
    console.log(err);
  }).then(val => {
    return val + 200;
  }).catch(error => {
    console.log('finally');
    console.log(error);
  })

var tp2 = tp1.then((val) => console.log(val));

console.log(tp1 === tp2)

module.exports = TP;
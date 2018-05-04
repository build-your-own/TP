
const TPStatus = {
  PANDING: 'panding',
  FULFILLED: 'fulfilled',
  REJECT: 'rejected',
};

const { PANDING, FULFILLED, REJECT } = TPStatus;

class TP {
  constructor(fn) {
    this.errorObj = {};
    this.status = TPStatus.PANDING;
    this.value = null;
    this.reason = null
    fn(this.resolve.bind(this), this.reject.bind(this));
  }

  then(onFulfilled, onRejected) {
    this.updateStatus(PANDING);
    if (typeof onFulfilled !== 'function') onFulfilled = () => {};
    if (onRejected && typeof onRejected !== 'function') onRejected = () => {};
    this.updateValue(onFulfilled(this.value));
    this.updateStatus(PANDING);
    return this;
  }

  catch(rejectFunc) {
    this.updateReason(rejectFunc());
    return this;
  }
  
  resolve(value) {
    this.updateStatus(FULFILLED);
    this.updateValue(value);
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
    resolve(200);
  });
}

ajaxAsync()
  .then((val) => {
    console.log(val);
  })
  .then((val) => {
    console.log(val)
  })

module.exports = TP;
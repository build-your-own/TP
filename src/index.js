
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
    this.eventualValue = null;
    this.reason = null
    this.currentVal = null;
    const argLen = fn.length;
    if (argLen < 2) {
      throw new Error('must provide resolve and reject function');
    }
    fn(this.resolve, this.reject);
  }

  then(onFulfilled, onRejected) {
    if (typeof onFulfilled !== 'function') onFulfilled = () => {};
    if (onRejected && typeof onRejected !== 'function') onRejected = () => {};
    onFulfilled()
    return this;
  }

  catch(rejectFunc) {
    const reason = rejectFunc();
    return this;
  }
  
  resolve(value) {
    this.status = FULFILLED;
    this.eventualValue = value;
    return this;
  }

  reject(err) {
    this.status = FULFILLED;
    this.reason = err;
    return this;
  }

}

const tp = new TP();

const ajaxAsync = () => {
  return new TP((resolve, reject) => {
    resolve(200);
  });
}

ajaxAsync().then((val) => {
  console.log(val);
});

var func = function (value) {
  return function () {
    console.log(value);
  }
}

var pp = function (fn) {
  var a = fn[0];
  a(299);
}

pp((val) => {

});

module.exports = TP;
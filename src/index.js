
const TPStatus = {
  PANDING: 'panding',
  FULFILLED: 'fulfilled',
  REJECT: 'rejected',
};

const noop = () => {};

const { PANDING, FULFILLED, REJECT } = TPStatus;

class TP {
  constructor(fn) {
    this.status = PANDING;
    this.value = null;
    this.reason = null;
    this.fnChain = [];
    if (!fn || typeof fn !== 'function') throw new TypeError('must provide a function argument for TP constructor.');
    if (fn && typeof fn === 'function') {
      try {
        fn(this.resolve.bind(this), this.reject.bind(this));   
      } catch (error) {
        if (this.status === FULFILLED) return this;
        this._updateStatus(REJECT);
        this._updateReason(error);
      }
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = onFulfilled || noop;
    if (this.status === PANDING) {
      this.fnChain.push(TP.prototype.then.bind(this, onFulfilled, onRejected));
      return this;
    };
    if (this.status === REJECT) {
      if (onRejected && typeof onRejected === 'function') {
        try {
          onRejected(this.reason);
          this._updateStatus(FULFILLED); // 需要更新状态以保证之后的 then 可以正常执行
        } catch (error) {
          this._updateReason(error); // 如果在 handle 错误的时候报错了，则更新错误
        }
        return this;
      } else {
        return this; // 如果有错误 但是未提供 onRejected then，直接 return 接着顺着链条向下找能 handle 此错误的方法
      }
    }
    try {
      /**
       * 如果 onFulfilled 里面有 throw 语句 如
       * promise.then(() => { throw new Error('error') });
       * 在这里 handle
       * 同时在运行接下来的链条时，如果下一个是 catch 则 cath的 onRejected 的参数为 throw 的参数
       * 如果下一个是then语句，同时 then 的 onRejected 不是一个 function，则 此 then 的 resolve 不执行，
       * 直到找到了一个 catch，或者一个拥有 onRejected function 的 then，将此 error handle 之后，
       * promise 链条就会继续正常执行
       */
      const finishVal = onFulfilled(this.value);
      if (finishVal instanceof TP) {
        return this.value;
      }
      this._updateValue(finishVal);
    } catch (error) {
      this._updateReason(error);
      this._updateStatus(REJECT);
    }
    return this;
  }

  catch(onRejected) {
    onRejected = onRejected || noop;
    const { status } = this;
    if (status === PANDING) {
      this.fnChain.push(TP.prototype.catch.bind(this, onRejected));
      return this;
    }
    if (status === REJECT) {
      onRejected(this.reason);
      this._updateStatus(FULFILLED);
    }
    return this;
  }
  
  resolve(value) {
    this._updateStatus(FULFILLED);
    this._updateValue(value);
    this.fnChain.forEach(fn => fn());
    return this;
  }
  
  reject(err) {
    this._updateStatus(REJECT);
    this._updateReason(err);
    this.fnChain.forEach(fn => fn());
    return this;
  }

  _updateStatus(status) {
    this.status = status;
  }

  _updateValue(value) {
    this.value = value;
  }

  _updateReason(reason) {
    this.reason = reason;
  }

  // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve
  static resolve(val) {
    // console.log(Object.prototype.toString.call(val))
    if (val instanceof TP) return val;
    if (typeof val === 'object' && val !== null && val.hasOwnProperty('then')) {
      const then = val.then;
      return new TP(then);
    }
    return new TP(resolve => resolve(val));
  }

  // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject
  static reject(reason) {
    return new TP((resolve, reject) => reject(reason));
  }

  static all(list) {
    const tempList = list;
    let tpList = [];
    let isReject = false;
    let reason = null;
    if (list && typeof list[Symbol.iterator] === 'function') {
      for (let index = 0; index < tempList.length; index++) {
        const val = tempList[index];
        if (val instanceof TP) {
          if (val.status === FULFILLED || val.status === PANDING) {
            tpList.push(val);
          } else if (val.status === REJECT) {
            reason = val.reason;
            isReject = true;
            break;
          }
        } else {
          tpList.push(TP.resolve(val));
        }
      }
    } else {
      throw new TypeError('argument must be implemented iterable protocol.');
    }

    // tpList: [TP<Fulfilled>, TP<Panding>, TP<Fulfilled>, TP<Panding>]

    function reduceTP(tpList) {
      return tpList.reduce((a, b) => {
        return TP.resolve(a).then(() => b);
      })
    }
    
    const finallyTP = reduceTP(tpList);

    if (isReject) return TP.reject(reason);
    return TP.resolve(list[1]);
  }
}

module.exports = TP;
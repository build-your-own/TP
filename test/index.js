/* eslint-env mocha */
const chai = require('chai');
const TP = require('../src');

const { expect } = chai;
const noop = () => {};

describe('Test TP constructor', () => {
  it('Test tp constructor without argument', () => {
    const genTP = () => new TP();
    expect(genTP).to.throw('must provide a function argument for TP constructor.');
  });

  it('Test tp constructor argument isn\'t function type', () => {
    const genTP = () => new TP(2);
    expect(genTP).to.throw('must provide a function argument for TP constructor.');
  });

  it('Test tp chain, promise1 === promise2', () => {
    const tp1 = new TP(resolve => resolve());
    const tp2 = tp1.then();
    const tp3 = tp1.catch();
    expect(tp1).to.equal(tp2);
    expect(tp2).to.equal(tp3);
    expect(tp1).to.equal(tp3);
  });
});

describe('Test then() function', () => {
  it('then() function first argument shoudle equal to resolve() return', (done) => {
    const expectVal = 200;
    const tp = new TP(resolve => resolve(expectVal));
    tp.then((val) => {
      expect(val).to.equal(expectVal);
      done();
    });
  });

  it('if behind then() without return, after then() argument should be undefined', (done) => {
    const expectVal = 200;
    const tp = new TP(resolve => resolve(expectVal));
    tp
      .then()
      .then((val) => {
        expect(val).to.equal(undefined);
        done();
      });
  });

  it('\'then chain\' with three then() function, last function should equal to the second to last val', (done) => {
    const expectVal = 200;
    const tp = new TP(resolve => resolve(expectVal));
    tp
      .then(() => {})
      .then(() => expectVal)
      .then((val) => {
        expect(val).to.equal(expectVal);
        done();
      });
  });

  it('then(onFulfilled, onRejected): onRejected should be called when TP status is REJECT', (done) => {
    const actualError = new Error('reject error');
    const tp = new TP((resolve, reject) => reject(actualError));
    tp.then(noop, (errorMsg) => {
      expect(errorMsg).to.equal(actualError);
      done();
    });
  });

  it('then(onFulfilled, onRejected): onRejected should handle above then() function\'s onFulfilled error', (done) => {
    const actualError = new Error('reject error');
    const tp = new TP(resolve => resolve());

    tp
      .then(() => {
        throw actualError;
      })
      .then(noop, (error) => {
        expect(error).to.equal(actualError);
        done();
      });
  });

  it('then(onFulfilled, onRejected): then() without onRejected should be ignored', (done) => {
    const actualError = new Error('reject error');
    const tp = new TP(resolve => resolve());

    tp
      .then(() => {
        throw actualError;
      })
      .then(() => {
        throw actualError; // should not be called
      })
      .then(noop, (error) => {
        expect(error).to.equal(actualError);
        done();
      });
  });

  it('if behind error had been handled, the next then() will be called success', (done) => {
    const actual = 'execute';
    const actualError = new Error('reject error');
    const tp = new TP(resolve => resolve());
    tp
      .then(() => {
        throw actualError;
      })
      .then(noop, noop)
      .then(() => actual)
      .then((val) => {
        expect(val).to.equal(actual);
        done();
      });
  });

  it('then(onFulfilled, onRejected): Test throw an error in onRejected function', (done) => {
    const actualError1 = new Error('reject error 1');
    const actualError2 = new Error('reject error 2');
    const tp = new TP(resolve => resolve());
    tp
      .then(() => {
        throw actualError1;
      })
      .then(noop, (error) => {
        expect(error).to.equal(actualError1);
        throw actualError2; // throw error in onRejected function
      })
      .then(noop, (error) => {
        expect(error).to.equal(actualError2);
        done();
      });
  });
});

describe('Test catch() function', () => {
  it('Test handle REJECT promise', (done) => {
    const actualError = new Error('reject error');
    const tp = new TP((resolve, reject) => reject(actualError));
    tp.catch((error) => {
      expect(error).to.equal(actualError);
      done();
    });
  });

  it('Test handle then(onFulfilled, onRejected) onFulfilled error', (done) => {
    const actualError = new Error('reject error');
    const tp = new TP(resolve => resolve(true));
    tp
      .then(() => {
        throw actualError;
      })
      .catch((error) => {
        expect(error).to.equal(actualError);
        done();
      });
  });

  it('Test handle then(onResolve, onRejected) onRejected error', (done) => {
    const actualError = new Error('reject error');
    const tp = new TP((resolve, reject) => reject(true));
    tp
      .then(noop, () => {
        throw actualError;
      })
      .catch((error) => {
        expect(error).to.equal(actualError);
        done();
      });
  });

  it('catch() function should return \'this\' to ensure promise chain running success', (done) => {
    const error = new Error('reject error');
    const actual = true;
    const tp = new TP((resolve, reject) => reject(error));
    tp
      .catch()
      .then(() => actual)
      .then((val) => {
        expect(val).to.equal(actual);
        done();
      });
  });

  it('If promise REJECT error handled by then() onRejected, catch function should be ignored', (done) => {
    const error = new Error('reject error');
    const actual = true;
    const tp = new TP((resolve, reject) => reject(error));
    tp
      .then(noop, noop)
      .catch(() => { throw new Error('throw error at catch()'); }) // should be ignored
      .then(() => actual)
      .then((val) => {
        expect(val).to.equal(actual);
        done();
      });
  });
});

describe('Test all() function', () => {
  it('test all arguments type', () => {
    // TODO
  });

  it('test all() with wrong argument', () => {
    // TODO
  });

  it('test all() with reject TP', () => {
    // TODO
  });

  it('test all() with resolved TP', () => {
    // TODO
  });

  it('test all() with original type argument', () => {
    // TODO
  });

  it('all() should return an array contains the two async TP\'s result', (done) => {
    const actualVal = ['a', 'b'];
    const a = new TP((resolve) => {
      setTimeout(() => {
        resolve(actualVal[0]);
      }, 1000);
    });
    const b = new TP((resolve) => {
      setTimeout(() => {
        resolve(actualVal[1]);
      }, 2000);
    });
    TP.all([a, b]).then((vals) => {
      expect(vals).to.have.ordered.members(actualVal);
      done();
    });
  }).timeout(4000);
});

describe('Test race() function', () => {
  it('test race() with resolved TP', () => {
    // TODO
  });

  it('race() should the fastest TP\'s value', (done) => {
    const actualVal = ['a', 'b'];
    const a = new TP((resolve) => {
      setTimeout(() => {
        resolve(actualVal[0]);
      }, 1000);
    });
    const b = new TP((resolve) => {
      setTimeout(() => {
        resolve(actualVal[1]);
      }, 2000);
    });
    TP.race([a, b]).then((val) => {
      expect(val).to.equal(actualVal[0]).not.to.equal(actualVal[1]);
      done();
    });
  }).timeout(4000);
});

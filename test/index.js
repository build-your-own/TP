const chai = require('chai');

const { expect } = chai;

const TP = require('../src');
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
});

describe('Test then() function', () => {
  it('then() function first argument shoudle equal to resolve() return', (done) => {
    const expectVal = 200;
    const tp = new TP((resolve) => resolve(expectVal));
    tp.then(val => {
      expect(val).to.equal(expectVal);
      done();
    })
  });

  it('if behind then() without return, after then() argument should be undefined', (done) => {
    const expectVal = 200;
    const tp = new TP((resolve) => resolve(expectVal));
    tp.then().then(val => {
      expect(val).to.equal(undefined);
      done();
    })
  });

  it('\'then chain\' with three then() function, last function should equal to the second to last val', (done) => {
    const expectVal = 200;
    const tp = new TP((resolve) => resolve(expectVal));
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
    })
  });

  it('then(onFulfilled, onRejected): onRejected should handle above then() function\'s error', (done) => {
    const actualError = new Error('reject error');
    const tp = new TP((resolve) => resolve());
    
    tp
      .then(() => {
        throw actualError;
      })
      .then(noop, (error) => {
        expect(error).to.equal(actualError);
        done();
      });
  });

});


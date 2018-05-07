const chai = require('chai');

const { expect } = chai;

const TP = require('../src');

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

});


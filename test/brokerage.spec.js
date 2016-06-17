/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const Stock = require('../lib/stock');
const Brokerage = require('../lib/brokerage');
// const nock = require('nock');

describe('Brokerage', () => {
  describe('constructor', () => {
    it('should create a new brokerage', () => {
      const b1 = new Brokerage('ETrade');
      expect(b1).to.be.instanceof(Brokerage);
      expect(b1.name).to.be.equal('ETrade');
      expect(b1.clients).to.have.length(0);
    });
  });
  describe('#addClient', () => {
    it('should add a new client to a brokerage', () => {
      const b1 = new Brokerage('ETrade');
      b1.addClient('Bob');
      expect(b1.clients).to.have.length(1);
    });
  });
});

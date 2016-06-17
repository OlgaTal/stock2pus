/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const Client = require('../lib/client');
const nock = require('nock');

describe('Client', () => {
  before(() => {
    // do mocking: if URL completely matching do redirect to a fake server.
    nock('http://dev.markitondemand.com')
      .persist()
      .get('/MODApis/Api/v2/Quote/json?symbol=AAPL')
      .reply(200, { Status: 'SUCCESS', Name: 'Apple', Symbol: 'AAPL',
                    LastPrice: 100, Timestamp: 'Fri Jun 17 10:40:07 UTC-04:00 2016' });
  });
  after(() => {
    // clear http mock
    nock.cleanAll();
  });

  describe('constructor', () => {
    it('should create a new client', () => {
      const c1 = new Client('Bob');
      expect(c1).to.be.instanceof(Client);
      expect(c1.name).to.be.equal('Bob');
      expect(c1.cashBalance).to.be.equal(0);
      expect(c1.portfolios).to.have.length(0);
    });
  });
  describe('#deposit', () => {
    it('should add cash to balance', () => {
      const c1 = new Client('Bob');
      c1.deposit(500);
      expect(c1.cashBalance).to.equal(500);
    });
  });
  describe('#withdrawl', () => {
    it('should remove cash from balance', () => {
      const c1 = new Client('Bob');
      c1.deposit(500);
      c1.withdrawl(200);
      expect(c1.cashBalance).to.equal(300);
    });
    it('should not remove cash from balance', () => {
      const c1 = new Client('Bob');
      c1.deposit(100);
      c1.withdrawl(500);
      expect(c1.cashBalance).to.equal(100);
    });
  });
  describe('#purchaseStock', () => {
    it('should purchase stock for a client', (done) => {
      const c1 = new Client('Bob');
      c1.deposit(500);
      c1.purchaseStock('aapl', 3, 'Tech', (err, totalPaid) => {
        expect(err).to.be.null;
        expect(c1.portfolios).to.have.length(1);
        expect(c1.cashBalance).to.equal(200);
        expect(totalPaid).to.equal(300);
        done();
      });
    });
    it('should not purchase stock for a client', (done) => {
      const c1 = new Client('Bob');
      c1.deposit(100);
      c1.purchaseStock('aapl', 3, 'Tech', (err) => {
        expect(err).to.be.not.null;
        expect(err.message).to.equal('NOT ENOUGH CASH TO PURCHASE!');
        expect(c1.portfolios).to.have.length(0);
        expect(c1.cashBalance).to.equal(100);
        done();
      });
    });
  });
});

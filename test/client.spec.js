/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const Client = require('../lib/client');
const Stock = require('../lib/stock');
const Portfolio = require('../lib/portfolio');
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
  describe('#sellStock', () => {
    it('should sell stock shares for a client', (done) => {
      const c1 = new Client('Bob');
      c1.deposit(500);
      const s1 = new Stock('AMZN');
      s1.shares = 50;
      const s2 = new Stock('aapl');
      s2.shares = 5;
      const s3 = new Stock('aapl');
      s3.shares = 1;
      const s4 = new Stock('aapl');
      s4.shares = 10;

      const p1 = new Portfolio('Tech');
      p1.addStock(s1);
      p1.addStock(s2);
      p1.addStock(s3);
      p1.addStock(s4);

      c1.portfolios.push(new Portfolio('ABC'));
      c1.portfolios.push(p1);

      c1.sellStock('aapl', 7, 'Tech', (err, totalReceived) => {
        expect(err).to.be.null;
        expect(c1.portfolios).to.have.length(2);
        expect(c1.portfolios[1].stocks).to.have.length(2);
        expect(c1.cashBalance).to.equal(1200);
        expect(totalReceived).to.equal(700);
        done();
      });
    });
    it('should not sell stock shares for a client: no stock', (done) => {
      const c1 = new Client('Bob');
      c1.deposit(500);
      c1.portfolios.push(new Portfolio('ABC'));

      c1.sellStock('aapl', 3, 'Tech', (err) => {
        expect(err).to.be.not.null;
        expect(err.message).to.equal('NO SHARES TO SELL!');
        expect(c1.portfolios).to.have.length(1);
        expect(c1.cashBalance).to.equal(500);
        done();
      });
    });
    it('should not sell stock shares for a client: not enough shares', (done) => {
      const c1 = new Client('Bob');
      c1.deposit(500);

      c1.portfolios.push(new Portfolio('ABC'));

      const s1 = new Stock('aapl');
      s1.shares = 5;

      const s2 = new Stock('aapl');
      s2.shares = 5;

      const p1 = new Portfolio('Tech');
      p1.addStock(s1);
      p1.addStock(s2);

      c1.portfolios.push(p1);
      c1.sellStock('aapl', 30, 'Tech', (err) => {
        expect(err).to.be.not.null;
        expect(err.message).to.equal('NOT ENOUGH SHARES TO SELL!');
        expect(c1.portfolios).to.have.length(2);
        expect(c1.cashBalance).to.equal(500);
        done();
      });
    });
  });
});

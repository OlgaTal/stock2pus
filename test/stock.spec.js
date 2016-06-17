/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const Stock = require('../lib/stock');
const nock = require('nock');
const sinon = require('sinon');
let clock;

describe('Stock', () => {
  beforeEach(() => {
    // do mocking: if URL completely matching do redirect to a fake server.
    clock = sinon.useFakeTimers();
    nock('http://dev.markitondemand.com')
      .get('/MODApis/Api/v2/Quote/json?symbol=AMZN')
      .reply(200, { Status: 'SUCCESS', Name: 'Amazon', Symbol: 'AMZN',
                    LastPrice: 100, Timestamp: 'Fri Jun 17 10:40:07 UTC-04:00 2016' });
  });
  after(() => {
    // clear http mock
    clock.restore();
    nock.restore();
  });

  describe('constructor', () => {
    it('should construct a new Stock object', () => {
      const stock1 = new Stock('AMZN');
      expect(stock1).to.be.instanceof(Stock);
      expect(stock1.symbol).to.equal('AMZN');
    });
  });

  describe('#purchase', () => {
    it('should purchase stock', (done) => {
      clock.tick(150);
      const stock1 = new Stock('AMZN');
      stock1.purchase(50, (err, totalPaid) => {
        expect(err).to.be.null;
        expect(stock1.shares).to.equal(50);
        expect(stock1.name).to.equal('Amazon');
        expect(stock1.purchasePricePerShare).to.equal(100);
        expect(stock1.purchaseDate.getTime()).to.equal(150);
        expect(totalPaid).to.equal(5000);
        done();
      });
    });
  });
  describe('#sell', () => {
    it('should sell stock', (done) => {
      const stock1 = new Stock('AMZN');
      // stock1.purchase(50, (err, totalPaid) => {
      stock1.shares = 50;
      stock1.purchasePricePerShare = 100;

      stock1.sell(30, (err, sharePrice, totalGained) => {
        expect(err).to.be.null;
        expect(stock1.shares).to.equal(20);
        expect(sharePrice).to.equal(100);
        expect(totalGained).to.equal(3000);
        done();
      });
    });
    it('should not sell stock', (done) => {
      const stock1 = new Stock('AMZN');
      stock1.shares = 50;

      stock1.sell(200, (err) => {
        expect(err).to.be.not.null;
        expect(err.message).to.equal('NOT ENOUGH SHARES TO SELL!');
        expect(stock1.shares).to.equal(50);
        done();
      });
    });
  });
  describe('.getQuote', () => {
    it('should return price of one stock share', (done) => {
      Stock.getQuote('AMZN', (err, sharePrice) => {
        expect(err).to.be.null;
        expect(sharePrice).to.equal(100);
        done();
      });
    });
  });
});

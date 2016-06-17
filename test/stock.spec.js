/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const Stock = require('../lib/stock');
const nock = require('nock');

describe('Stock', () => {
  beforeEach(() => {
    // do mocking: if URL completely matching do redirect to a fake server.
    nock('http://dev.markitondemand.com')
      .get('/MODApis/Api/v2/Quote/json?symbol=AMZN')
      .reply(200, { Status: 'SUCCESS', Name: 'Amazon', Symbol: 'AMZN', LastPrice: 100 });
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
      const stock1 = new Stock('AMZN');
      stock1.purchase(50, (err, totalPaid) => {
        expect(err).to.be.null;
        expect(totalPaid).to.be.above(0);
        expect(stock1.shares).to.equal(50);
        expect(stock1.name).to.equal('Amazon');
        expect(stock1.purchasePricePerShare).to.equal(100);
        // expect(stock1.purchaseDate.getTime()).to.equal(222222);
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
        expect(totalGained).to.be.above(0);
        expect(stock1.shares).to.equal(20);
        expect(stock1.purchasePricePerShare).to.be.above(0);
        expect(totalGained).to.equal(30 * sharePrice);
        done();
      });

      // });
    });
  });
});

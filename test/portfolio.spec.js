const expect = require('chai').expect;
const Stock = require('../lib/stock');
const Portfolio = require('../lib/portfolio');

describe('Portfolio', () => {
  describe('constructor', () => {
    it('should create a portfolio', () => {
      const p1 = new Portfolio('Tech');
      expect(p1).to.be.instanceof(Portfolio);
      expect(p1.name).to.equal('Tech');
      expect(p1.stocks).to.have.length(0);
    });
  });
  describe('#addStock', () => {
    it('should add a stock to stock array in a portfolio', () => {
      const p1 = new Portfolio('Tech');
      const s1 = new Stock('AMZN');
      const s2 = new Stock('APPL');
      p1.addStock(s1);
      p1.addStock(s2);
      expect(p1.stocks).to.have.length(2);
    });
    it('should NOT add not a Stock to stock array in a portfolio', () => {
      const p1 = new Portfolio('Tech');
      const s1 = new Portfolio('AMZN');
      p1.addStock(s1);
      expect(p1.stocks).to.have.length(0);
    });

    it('should calcualte the position of a portfolio', () => {
      const p1 = new Portfolio('Tech');
      const s1 = new Stock('AMZN');
      const s2 = new Stock('APPL');

      s1.shares = 5;
      s1.purchasePricePerShare = 100;
      s2.shares = 3;
      s2.purchasePricePerShare = 50;

      p1.addStock(s1);
      p1.addStock(s2);
      expect(p1.position()).to.be.equal(650);

      s1.shares = 3;    // 'sell' 2 shares
      expect(p1.position()).to.be.equal(450);
    });
  });
});

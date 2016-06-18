/* eslint-disable func-names */
const Stock = require('../lib/stock');

function Portfolio(name) {
  this.name = name;
  this.stocks = [];
}
Portfolio.prototype.addStock = function (stock) {
  if (stock instanceof Stock) {
    this.stocks.push(stock);
  }
};
Portfolio.prototype.position = function () {
  return this.stocks.reduce((acc, s) => acc + (s.shares * s.purchasePricePerShare), 0);
};

module.exports = Portfolio;

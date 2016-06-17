/* eslint-disable func-names */

const Stock = require('../lib/stock');
const Portfolio = require('../lib/portfolio');

function Client(name) {
  this.name = name;
  this.portfolios = [];
  this.cashBalance = 0;
}

Client.prototype.deposit = function (money) {
  this.cashBalance += money;
};

Client.prototype.withdrawl = function (money) {
  if (this.cashBalance >= money) {
    this.cashBalance -= money;
  }
};

Client.prototype.purchaseStock = function (symbol, shares, portfolioName, cb) {
  const s1 = new Stock(symbol);
  Stock.getQuote(symbol, (err, sharePrice) => {
    if (err === null) {
      if (sharePrice * shares > this.cashBalance) {
        cb(new Error('NOT ENOUGH CASH TO PURCHASE!'));
        return;
      }

      s1.purchase(shares, (err1, totalPaid) => {
        if (err1 === null) {
          let p1 = null;
          // add stock to portfolio: does portfolio exist? or doesn't exist.
          for (let i = 0; i < this.portfolios.length; i++) {
            if (this.portfolios[i].name === portfolioName) {
              p1 = this.portfolios[i];
              break;
            }
          }
          if (!p1) {
            p1 = new Portfolio(portfolioName);
            this.portfolios.push(p1);
          }

          p1.addStock(s1);

          // substruct totoalPaid from cashBalance
          this.cashBalance -= totalPaid;
        } else {
          // call callback
          cb(err1, totalPaid);
          return;
        }
        cb(err1, totalPaid);
      });
    } else {
      cb(err, sharePrice);
    }
  });
};

module.exports = Client;

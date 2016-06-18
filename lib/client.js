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

Client.prototype.sellStock = function (symbol, shares, portfolioName, cb) {
  const s1 = new Stock(symbol);
  // check share quantities
  const ports = this.portfolios.filter(port => port.name === portfolioName);

  if (!ports || ports.length < 1) {
    cb(new Error('NO SHARES TO SELL!'));
    return;
  }

  // console.log('ports length:', ports.length);
  const stocks = ports[0].stocks.filter(stock => stock.symbol === symbol.toUpperCase());
  const stockQuantity = stocks.reduce((acc, stock) => acc + stock.shares, 0);

  // console.log('stockQuantity:', stockQuantity);
  // console.log('shares:', shares);
  if (stockQuantity < shares) {
    cb(new Error('NOT ENOUGH SHARES TO SELL!'));
    return;
  }

  // sell
  Stock.sellShares(symbol, shares, (err1, price, totalReceived) => {
    if (err1 === null) {
      // update cashBalance
      this.cashBalance += totalReceived;
      let cntLeft = shares;
      for (let i = 0; i < stocks.length; i++) {
        if (stocks[i].shares >= cntLeft) {
          stocks[i].shares -= cntLeft;
          break;
        } else {
          cntLeft -= stocks[i].shares;
          stocks[i].shares = 0;
        }

        if (cntLeft <= 0) {
          break;
        }
      }

      ports[0].stocks = ports[0].stocks.filter(stock => stock.shares > 0);

    }
    cb(err1, totalReceived);
  });
};

module.exports = Client;

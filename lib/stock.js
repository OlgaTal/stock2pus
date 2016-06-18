/* eslint-disable func-names */

const request = require('request');


function Stock(symbol) {
  this.symbol = symbol.toUpperCase();
}

Stock.getQuote = function (symbol, callback) {
  const url = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=${symbol.toUpperCase()}`;
  // console.log('url222:', url);
  request({ url, json: true }, (err, resp, body) => {
    let price = 0;
    if (! err) {
      price = body.LastPrice;
    }
    callback(err, price);
  });
};

Stock.sellShares = function (symbol, quantity, callback) {
  const url = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=${symbol.toUpperCase()}`;
  request({ url, json: true }, (err, resp, body) => {
    callback(err, body.LastPrice, quantity * body.LastPrice);
  });
};

Stock.prototype.purchase = function (quantity, callback) {
  const url = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=${this.symbol}`;
  // console.log('url:', url);
  request({ url, json: true }, (err, resp, body) => {
    // console.log('body:', body);
    this.name = body.Name;
    this.shares = quantity;
    this.purchasePricePerShare = body.LastPrice;
    this.purchaseDate = new Date();
    const totalPaid = this.purchasePricePerShare * this.shares;
    callback(err, totalPaid);
  });
};

Stock.prototype.sell = function (quantity, callback) {
  const url = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=${this.symbol}`;
  // console.log('url:', url);
  if (this.shares >= quantity) {
    request({ url, json: true }, (err, resp, body) => {
      // console.log('body:', body);

      this.shares -= quantity;
      callback(err, body.LastPrice, quantity * body.LastPrice);
    });
  } else {
    callback(new Error('NOT ENOUGH SHARES TO SELL!'));
  }
};

module.exports = Stock;

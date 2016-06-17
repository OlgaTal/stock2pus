/* eslint-disable func-names */

const request = require('request');

function Stock(symbol) {
  this.symbol = symbol.toUpperCase();
}

Stock.prototype.purchase = function (quantity, callback) {
  const url = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=${this.symbol}`;
  // console.log('url:', url);
  request({ url, json: true }, (err, resp, body) => {
    console.log('body:', body);
    this.name = body.Name;
    this.shares = quantity;
    this.purchasePricePerShare = body.LastPrice;
    const totalPaid = this.purchasePricePerShare * this.shares;
    callback(err, totalPaid);
  });
};

Stock.prototype.sell = function (quantity, callback) {
  const url = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=${this.symbol}`;
  // console.log('url:', url);
  request({ url, json: true }, (err, resp, body) => {
    console.log('body:', body);
    this.shares -= quantity;
    callback(err, body.LastPrice, quantity * body.LastPrice);
  });
};

module.exports = Stock;

/* eslint-disable func-names */

const Client = require('../lib/client');

function Brokerage(name) {
  this.name = name;
  this.clients = [];
}

Brokerage.prototype.addClient = function (name) {
  this.clients.push(new Client(name));
};

module.exports = Brokerage;

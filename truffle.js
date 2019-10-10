// Allows us to use ES6 in our migrations and tests.
require('babel-register')

var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "enter nature virtual globe finish mandate heart bracket liar multiply gentle luggage";

module.exports = {
  networks: {
  	ropsten: {
    provider: function() {
      return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/2abd2d97dcc3456997b35dcbdedb9faa");
    },
    network_id: '3',
    gas: 4700000
  },
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
      from: "0x00a329c0648769A73afAc7F9381E08FB43dBEA72", // default address to use for any transaction Truffle makes during migrations
      gas: 4700000
    }
  },
  build: "webpack"
}
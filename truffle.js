// Allows us to use ES6 in our migrations and tests.
require('babel-register')

var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "xxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxxx xxxx";

module.exports = {
  networks: {
  	ropsten: {
    provider: function() {
      return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/PUT_YOUR_INFURA_ACCOUNT");
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

const TDSicoToken = artifacts.require('TDSicoToken');
const TDSicoContract = artifacts.require('TDSicoContract');

module.exports = function(deployer) {
  deployer.deploy(
    TDSicoToken,
    'TDS Token',
    'TDS',
    '18',
    '1.0'
  ).then(() => {
    return deployer.deploy(
      TDSicoContract,
      '0xBc1ABBF7ac88908B8eea8Fca3249eC5914D62ab4', // The ETH Address of the ICO Owner (eth fund deposit @)
      TDSicoToken.address,
      '100000000000000000000000000', // 100000000 Token
      '1000', // 1 ETH = 1000 Token
      '1514922178', // 02/01/2018
      '1530820589', // 05/07/2018
      '100000000000000000' // 0.1 ETH minimum eth to send
    ).then(() => {
      return TDSicoToken.deployed().then(function(instance) {
        return instance.setTDSicoContract(TDSicoContract.address);
      });
    });
  });
};

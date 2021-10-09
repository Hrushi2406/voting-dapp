var Application = artifacts.require('./Application.sol');
var Election = artifacts.require('./Election.sol');

module.exports = function (deployer) {
  deployer.deploy(Application);
  // deployer.deploy(Election, 'Voting 101', 'This is voting 101', ['sumit', 'hrushi', 'pratik']);
};

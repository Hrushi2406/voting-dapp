var Voting = artifacts.require('./Voting.sol');

module.exports = function (deployer) {
  deployer.deploy(Voting, 'Voting 101', 'This is voting 101', ['sumit', 'hrushi', 'pratik']);
};

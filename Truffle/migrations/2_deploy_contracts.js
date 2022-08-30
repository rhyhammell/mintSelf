const NFTMe = artifacts.require("NFTMe");

module.exports = async function (deployer) {
  await deployer.deploy(NFTMe);
};
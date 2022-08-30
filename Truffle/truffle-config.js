require('dotenv').config({path: './../.env'});

const HDWalletProvider = require('@truffle/hdwallet-provider');
const { 
  MNEMONIC, 
  POLYGON_NODE_URL,
  MUMBAI_NODE_URL, 
  POLYGONSCAN_API_KEY
} = process.env;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     
      port: 8545,            
      network_id: "*",
    },
    polygon: {
      provider: () => new HDWalletProvider(MNEMONIC, POLYGON_NODE_URL),
      network_id: 137,
      gasPrice: 50000000000,
    },
    mumbai: {
      provider: () => new HDWalletProvider(MNEMONIC, MUMBAI_NODE_URL),
      network_id: 80001,
      gasPrice: 50000000000,
    },
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.13",
    }
  },

  // Required for etherscan/polygonscan verification using truffle-plugin-verify package
  plugins: [
    'truffle-plugin-verify'
  ],

  // API Keys requried for etherscan/polygonscan verification
  api_keys: {
    polygonscan: POLYGONSCAN_API_KEY,
  }
};
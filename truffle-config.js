const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_URL || "";

const ALCHEMY_TOKEN = process.env.ALCHEMY_TOKEN || "";

const URL = `${SEPOLIA_RPC_URL}${ALCHEMY_TOKEN}`;

const privateKey = process.env.PRIVATE_KEY || "";

const etherscanApiKey = process.env.ETHERSCAN_API_KEY || "";

module.exports = {
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider(
        privateKey, `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_TOKEN}`
      ),
      network_id: 11155111,
      gasPrice: 10e9, 
      skipDryRun: true
    },
  },

  compilers: {
    solc: {
      version: "0.8.20", // версия Solidity
    }
  },

  plugins: [
    'truffle-plugin-verify'
  ],

  api_keys: {
    etherscan: etherscanApiKey
  }
};
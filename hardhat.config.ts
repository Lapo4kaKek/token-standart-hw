import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-verify";

import dotenv from "dotenv";

import { vars } from "hardhat/config";

dotenv.config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_URL || "";

const ALCHEMY_TOKEN = process.env.ALCHEMY_TOKEN || "";

const URL = `${SEPOLIA_RPC_URL}${ALCHEMY_TOKEN}`;

const privateKey = process.env.PRIVATE_KEY || "";

const etherscanApiKey = process.env.ETHERSCAN_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    sepolia: {
      url: URL,
      accounts: [privateKey],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: etherscanApiKey,
    }
  }
};

export default config;

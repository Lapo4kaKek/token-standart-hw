import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_URL || "";

const ALCHEMY_TOKEN = process.env.ALCHEMY_TOKEN || "";

const URL = `${SEPOLIA_RPC_URL}${ALCHEMY_TOKEN}`;

const privateKey = process.env.PRIVATE_KEY || "";

console.log(`URL: ${URL}`)

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: URL,
      accounts: [privateKey],
    }
  }
};

export default config;

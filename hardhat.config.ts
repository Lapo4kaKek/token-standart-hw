import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_URL || "";

const alchemy_key = process.env.ALCHEMY_TOKEN || "";

const URL = `${SEPOLIA_RPC_URL}${alchemy_key}`;

const privateKey = process.env.PRIVATE_KEY || "";

console.log(`URL: ${URL}}`)

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

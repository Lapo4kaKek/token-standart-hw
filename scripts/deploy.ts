import {ethers} from "hardhat"
import * as dotenv from "dotenv";

dotenv.config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_URL || "";

const alchemy_key = process.env.ALCHEMY_TOKEN || "";

const URL = `${SEPOLIA_RPC_URL}${alchemy_key}`;

const privateKey = process.env.PRIVATE_KEY || "";

async function main() {
    // Deploy ERC20 contract (Carti.sol)
    const CartiFactory = await ethers.getContractFactory("Carti");
    const cartiContract = await CartiFactory.deploy();
    await cartiContract.deploymentTransaction();
    const cartiAddress = await cartiContract.getAddress();
    console.log(`Carti deployed to: ${cartiAddress}`);
  
    // // Deploy ERC721 contract (Kanye.sol)
    // const KanyeFactory = await ethers.getContractFactory("Kanye");
    // const kanyeContract = await KanyeFactory.deploy();
    // await kanyeContract.deploymentTransaction();
    // const kanyeAddress = await cartiContract.getAddress();
    // console.log(`Kanye deployed to: ${kanyeAddress}`);
  
    // Deploy ERC1155 contract (Rub.sol)
    const RubFactory = await ethers.getContractFactory("Rub");
    const rubContract = await RubFactory.deploy();
    await rubContract.deploymentTransaction();
    const rubAddress = await cartiContract.getAddress();
    console.log(`Rub deployed to: ${rubAddress}`);
}
  
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
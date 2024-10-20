import {ethers} from "hardhat"
import * as dotenv from "dotenv";

dotenv.config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_URL || "";

const alchemy_key = process.env.ALCHEMY_TOKEN || "";

const URL = `${SEPOLIA_RPC_URL}${alchemy_key}`;

const privateKey = process.env.PRIVATE_KEY || "";

async function deployERC20() {
    const CartiFactory = await ethers.getContractFactory("Carti");
    const cartiContract = await CartiFactory.deploy();
    await cartiContract.deploymentTransaction();
    const cartiAddress = await cartiContract.getAddress();
    console.log(`Carti (ERC20) deployed to: ${cartiAddress}`);
  
    const carti = await ethers.getContractAt("Carti", cartiAddress);
    const [owner] = await ethers.getSigners();
  
    const mintTx = await carti.mint(owner.address, ethers.parseUnits("1000", 18));
    await mintTx.wait();
    console.log(`Minted 1000 Carti tokens to ${owner.address}`);
}


async function deployERC721() {
    const KanyeFactory = await ethers.getContractFactory("KanyeTokenERC721");
    const kanyeContract = await KanyeFactory.deploy();
    await kanyeContract.deploymentTransaction();
    const kanyeAddress = await kanyeContract.getAddress();
    console.log(`KanyeTokenERC721 (ERC721) deployed to: ${kanyeAddress}`);

    const kanye = await ethers.getContractAt("KanyeTokenERC721", kanyeAddress);
    const [owner] = await ethers.getSigners();

    const mintTx = await kanye.buyToken("https://example.com/metadata.json", {
        value: ethers.parseEther("0.01"),
    });
    await mintTx.wait();
    console.log(`Minted 1 Kanye NFT to ${owner.address}`);
}
async function deployERC1155() {
    const RubFactory = await ethers.getContractFactory("Rub");
    const rubContract = await RubFactory.deploy();
    await rubContract.deploymentTransaction();
    const rubAddress = await rubContract.getAddress();
    console.log(`Rub (ERC1155) deployed to: ${rubAddress}`);

    const rub = await ethers.getContractAt("Rub", rubAddress);
    const [owner] = await ethers.getSigners();

    const mintTx = await rub.mint(owner.address, 0, 1000, "0x");
    await mintTx.wait();
    console.log(`Minted 1000 Rub tokens of ID 0 to ${owner.address}`);
}

// Main function to deploy and mint all contracts
async function main() {
    await deployERC20();
    await deployERC721();
    await deployERC1155();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
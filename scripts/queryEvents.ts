import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_URL || "";
const ALCHEMY_TOKEN = process.env.ALCHEMY_TOKEN || "";
const URL = `${SEPOLIA_RPC_URL}${ALCHEMY_TOKEN}`;

const provider = new ethers.JsonRpcProvider(URL);

const cartiAddress = "0xee408aEbCcFc3903a90e6E1e0d4F7231D5C67C08";
const kanyeAddress = "0xb83EdbB78B1f0B81A417426Fc6BAA9e312308913";
const rubAddress = "0x19D23776AdE766e3f7398F6121C1e81e9F17b3FF";

const cartiABI = [
    "event Transfer(address indexed from, address indexed to, uint256 value)"
];
const kanyeABI = [
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];
const rubABI = [
    "event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)",
    "event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)"
];

async function queryCartiTransferEvents() {
    const cartiContract = new ethers.Contract(cartiAddress, cartiABI, provider);
    const events = await cartiContract.queryFilter("Transfer", 0, "latest");
    console.log("Carti Transfer Events:", events);
}

async function queryKanyeTransferEvents() {
    const kanyeContract = new ethers.Contract(kanyeAddress, kanyeABI, provider);
    const events = await kanyeContract.queryFilter("Transfer", 0, "latest");
    console.log("Kanye Transfer Events:", events);
}

async function queryRubTransferEvents() {
    const rubContract = new ethers.Contract(rubAddress, rubABI, provider);
    const singleEvents = await rubContract.queryFilter("TransferSingle", 0, "latest");
    const batchEvents = await rubContract.queryFilter("TransferBatch", 0, "latest");
    
    console.log("Rub TransferSingle Events:", singleEvents);
    console.log("Rub TransferBatch Events:", batchEvents);
}

async function queryAllEvents() {
    await queryCartiTransferEvents();
    await queryKanyeTransferEvents();
    await queryRubTransferEvents();
}

queryAllEvents().catch((error) => {
    console.error("Error querying events:", error);
});
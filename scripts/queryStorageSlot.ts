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
    "function balanceOf(address account) view returns (uint256)"
];

function computeStorageSlot(address: string, slotIndex: number): string {
   
    const key = ethers.getBytes(address);
    const slot = ethers.zeroPadBytes(ethers.toBeHex(slotIndex), 32); 
    const storageSlot = ethers.keccak256(ethers.concat([key, slot]));
    return storageSlot;
}

async function getBalanceFromStorage(contractAddress: string, userAddress: string, slotIndex: number) {
    const storageSlot = computeStorageSlot(userAddress, slotIndex);
    const balanceHex = await provider.getStorage(contractAddress, storageSlot);
    const balance = ethers.toBigInt(balanceHex);
    console.log(`Баланс пользователя ${userAddress}:`, balance.toString());
}

async function queryStorageSlots() {
    const userAddress = "0xf92769A0dFee5B4807daC7De454a0AE009886Fb0";

    console.log("Баланс Carti (ERC20):");
    await getBalanceFromStorage(cartiAddress, userAddress, 0);
}

queryStorageSlots().catch((error) => {
    console.error("Error querying storage slots:", error);
});
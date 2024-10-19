import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { Carti } from "../typechain-types/contracts/CartiERC20.sol"
import hre from "hardhat"
import dotenv from "dotenv"

dotenv.config();

describe("Carti Token", function () {
    const getCustomSigner = (privateKey: string) => {
        return new ethers.Wallet(privateKey, ethers.provider);
    };
    
    async function deployTokenFixture() {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const CartiFactory = await ethers.getContractFactory("Carti");
        const carti = (await CartiFactory.deploy()) as Carti;

        return { carti, owner, addr1, addr2 };
    }
    it("Mint tokens not owner", async function () {
        const { carti, addr1 } = await loadFixture(deployTokenFixture);
    
        await expect(carti.connect(addr1).mint(addr1.address, 100)).to.be.reverted;
    });

    it("Set transfer fee not owner", async function () {
        const { carti, addr1 } = await loadFixture(deployTokenFixture);
    
        await expect(carti.connect(addr1).setTransferFee(5)).to.be.reverted;
    });
    it("Should allow the owner to set transfer fee", async function () {
        const { carti, owner } = await loadFixture(deployTokenFixture);
    
        await carti.setTransferFee(5);
        const fee = await carti.transferFee();
        expect(fee).to.equal(5);
    });
    it("Should revert if transfer fee exceeds 99%", async function () {
        const { carti, owner } = await loadFixture(deployTokenFixture);
    
        await expect(carti.setTransferFee(100)).to.be.revertedWith("Transfer fee cannot exceed 99%");
    });
    it("Buy tokens", async function () {
        const { carti, owner } = await loadFixture(deployTokenFixture);
    
        await carti.mint(await carti.getAddress(), 1000);
    
        await expect(
            carti.buy({
                value: ethers.parseEther("0.03"),
            })
        ).to.changeTokenBalance(carti, owner, 3);
    });
    
    it("Should allow successful token purchase", async function () {
        const { carti, owner, addr1 } = await loadFixture(deployTokenFixture);
    
        await carti.mint(await carti.getAddress(), 1000); // Mint tokens to contract
        await expect(
            carti.connect(addr1).buy({
                value: ethers.parseEther("0.02"), // 0.02 ETH for 2 tokens
            })
        ).to.changeTokenBalance(carti, addr1, 2); // Check if addr1 got 2 tokens
    });
    
    it("Should revert when buying more tokens than available", async function () {
        const { carti, owner, addr1 } = await loadFixture(deployTokenFixture);
    
        await carti.mint(await carti.getAddress(), 5); // Only 5 tokens available
        await expect(
            carti.connect(addr1).buy({
                value: ethers.parseEther("0.10"), // Trying to buy 10 tokens, but only 5 are available
            })
        ).to.be.revertedWith("Not enough tokens in the contract");
    });
    it("Should correctly apply transfer fee", async function () {
        const { carti, owner, addr1 } = await loadFixture(deployTokenFixture);
    
        await carti.mint(owner.address, 100); // Mint tokens to owner
        await carti.setTransferFee(5); // Set 5% transfer fee
    
        await expect(carti.transfer(addr1.address, 100)).to.changeTokenBalances(
            carti,
            [owner, addr1],
            [-100, 95] // 5% fee, so 95 tokens go to addr1
        );
    });
    
    it("Should allow transfer from owner with fee applied", async function () {
        const { carti, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
    
        await carti.mint(owner.address, 300); // Mint tokens to owner
        await carti.setTransferFee(10); // Set 10% fee
        await carti.connect(owner).approve(addr1.address, 100); // Allow addr1 to transfer 100 tokens on behalf of owner
    
        await expect(carti.connect(addr1).transferFrom(owner.address, addr2.address, 100)).to.changeTokenBalances(
            carti,
            [owner, addr2],
            [-100, 90] // 10% fee, so 90 tokens go to addr2
        );
    });
    it("Tax on transfer", async function () {
        const { carti, owner, addr1 } = await loadFixture(deployTokenFixture);

        await carti.mint(owner.address, 300); 
        await carti.setTransferFee(5); 

        await expect(carti.transfer(addr1.address, 300)).to.changeTokenBalances(
            carti,
            [owner, addr1],
            [-300, 285]
        );
    });

    it("Tax on transferFrom", async function () {
        const { carti, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);

        await carti.mint(addr1.address, 300); // Mint tokens to addr1
        await carti.connect(addr1).approve(owner.address, 300); 
        await carti.setTransferFee(5); 

        await expect(carti.transferFrom(addr1.address, addr2.address, 300)).to.changeTokenBalances(
            carti,
            [addr1, addr2],
            [-300, 285] 
        );
    });

    it("Permit", async function () { 
        const { carti, owner, addr1: spender } = await loadFixture(deployTokenFixture);
        const privateKey = process.env.PRIVATE_KEY || "";

        const wallet = getCustomSigner(privateKey);

        //const value = 1n;
        const value = ethers.parseEther("0.0001");
        const deadline = Math.floor(Date.now() / 1000) + 3600;
        console.log(owner.address)
        await carti.connect(owner).buy({
            value,
        });

        const { name, version, chainId, verifyingContract } = await carti.eip712Domain();

        // Domain for signature
        const domain = {
            name,
            version,
            chainId,
            verifyingContract,
        };

        // typedData
        const types = {
            Permit: [
                {
                    name: "owner",
                    type: "address",
                },
                {
                    name: "spender",
                    type: "address",
                },
                {
                    name: "value",
                    type: "uint256",
                },
                {
                    name: "nonce",
                    type: "uint256",
                },
                {
                    name: "deadline",
                    type: "uint256",
                },
            ],
        };

        const nonce = await carti.nonces(owner.address);

        const values = {
            owner: owner.address,
            spender: spender.address,
            value: value,
            nonce: nonce,
            deadline: deadline,
        };

        const signature = await owner.signTypedData(domain, types, values);

        const sig = hre.ethers.Signature.from(signature);

        await carti
            .connect(spender)
            .permit(owner.address, spender.address, value, deadline, sig.v, sig.r, sig.s);

        await expect(await carti.allowance(owner, spender)).to.equal(value);

        await expect(carti.connect(spender).transferFrom(owner, spender, value)).changeTokenBalances(
            carti,
            [owner, spender],
            [-value, Number(value) * 0.99]
        );
    });
});
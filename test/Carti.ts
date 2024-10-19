import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import hre from "hardhat";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Carti Token Contract", function () {
    async function deployTokenFixture() {
        const [owner, addr1, addr2] = await hre.ethers.getSigners();

        // Deploying Carti contract
        const cartiToken = await hre.ethers.deployContract("Carti");

        return { cartiToken, owner, addr1, addr2 };
    }

    // it("Should allow buying tokens with ETH", async function () {
    //     const { cartiToken, addr1 } = await loadFixture(deployTokenFixture);

    //     await cartiToken.mint(cartiToken.address, hre.ethers.parseEther("1000")); // Mint tokens to contract for sale
        
    //     await expect(
    //         cartiToken.connect(addr1).buy({
    //             value: hre.ethers.parseEther("1"), // 1 ETH for purchase
    //         })
    //     ).to.changeTokenBalance(cartiToken, addr1, hre.ethers.parseEther("100"));
    // });

    it("Should mint tokens for the owner", async function () {
        const { cartiToken, owner } = await loadFixture(deployTokenFixture);

        await expect(cartiToken.mint(owner.address, 100)).to.changeTokenBalance(cartiToken, owner, 100);
    });

    // it("Should revert minting tokens by non-owner", async function () {
    //     const { cartiToken, addr1 } = await loadFixture(deployTokenFixture);

    //     await expect(cartiToken.connect(addr1).mint(addr1.address, 100)).to.be.revertedWith("Ownable: caller is not the owner");
    // });

    it("Should correctly apply tax on transfer", async function () {
        const { cartiToken, owner, addr1 } = await loadFixture(deployTokenFixture);

        // Mint tokens for the owner
        await cartiToken.mint(owner.address, 300);

        // Set 5% transfer fee
        await cartiToken.setTransferFee(5);

        // Transfer 300 tokens from owner to addr1 (should apply a 5% tax)
        await expect(cartiToken.transfer(addr1.address, 300)).to.changeTokenBalances(
            cartiToken,
            [owner, addr1],
            [-300, 285] // 300 * 0.95 = 285 received
        );
    });

    // it("Should apply tax on transferFrom", async function () {
    //     const { cartiToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);

    //     // Mint tokens for addr1
    //     await cartiToken.mint(addr1.address, 300);

    //     // Approve owner to spend 300 tokens from addr1
    //     await cartiToken.connect(addr1).approve(owner.address, 300);

    //     // Transfer 300 tokens from addr1 to addr2 (with 5% tax)
    //     await expect(cartiToken.connect(owner).transferFrom(addr1.address, addr2.address, 300)).to.changeTokenBalances(
    //         cartiToken,
    //         [addr1, addr2],
    //         [-300, 285] // 300 * 0.95 = 285 received
    //     );
    // });

    // it("Should allow gasless transactions using Permit", async function () {
    //     const { cartiToken, owner, addr1: spender } = await loadFixture(deployTokenFixture);

    //     const value = 100n;
    //     const deadline = Math.floor(Date.now() / 1000) + 7200; // 2 hours

    //     // Mint tokens for the owner
    //     await cartiToken.mint(owner.address, value);

    //     // Get the domain data for signing Permit
    //     const { name, version, chainId, verifyingContract } = await cartiToken.eip712Domain();

    //     const domain = {
    //         name,
    //         version,
    //         chainId,
    //         verifyingContract,
    //     };

    //     const types = {
    //         Permit: [
    //             { name: "owner", type: "address" },
    //             { name: "spender", type: "address" },
    //             { name: "value", type: "uint256" },
    //             { name: "nonce", type: "uint256" },
    //             { name: "deadline", type: "uint256" },
    //         ],
    //     };

    //     const nonce = await cartiToken.nonces(owner.address);

    //     const values = {
    //         owner: owner.address,
    //         spender: spender.address,
    //         value: value,
    //         nonce: nonce,
    //         deadline: deadline,
    //     };

    //     // Sign the Permit
    //     const signature = await owner.signTypedData(domain, types, values);
    //     const sig = hre.ethers.Signature.from(signature);

    //     // Use Permit to allow spender to spend tokens without gas
    //     await cartiToken
    //         .connect(spender)
    //         .permit(owner.address, spender.address, value, deadline, sig.v, sig.r, sig.s);

    //     // Verify allowance and transfer
    //     await expect(await cartiToken.allowance(owner.address, spender.address)).to.equal(value);
    //     await expect(cartiToken.connect(spender).transferFrom(owner.address, spender.address, value)).to.changeTokenBalances(
    //         cartiToken,
    //         [owner.address, spender.address],
    //         [-value, Number(value) * 0.95]
    //     );
    // });
});
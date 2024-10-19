
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import hre from "hardhat";
import { expect } from "chai";


describe("Rub contract", function () {
    async function deployTokenFixture() {
        const [owner, addr1, addr2] = await hre.ethers.getSigners();

        const rubToken = await hre.ethers.deployContract("Rub");

        return { rubToken, owner, addr1, addr2 };
    }

    it("Buy tokens 100 tokens", async function () {
        const { rubToken, owner } = await loadFixture(deployTokenFixture);

        await rubToken.buy({ value: 100 });

        await expect(await rubToken.balanceOf(owner, await rubToken.TOKEN_ID())).to.equal(100);
    });
    it("Buy tokens 1 tokens", async function () {
        const { rubToken, owner } = await loadFixture(deployTokenFixture);

        await rubToken.buy({ value: 1 });

        await expect(await rubToken.balanceOf(owner, await rubToken.TOKEN_ID())).to.equal(1);
    });
    

    it("Mint tokens", async function () {
        const { rubToken, owner } = await loadFixture(deployTokenFixture);

        await rubToken.mint(owner, await rubToken.TOKEN_ID(), 300, Buffer.from("data"));
        await expect(await rubToken.balanceOf(owner, await rubToken.TOKEN_ID())).to.equal(300);
    });

    it("Mint tokens not owner", async function () {
        const { rubToken, owner, addr1 } = await loadFixture(deployTokenFixture);

        await expect(
            rubToken
                .connect(addr1)
                .mint(owner, await rubToken.TOKEN_ID(), 300, Buffer.from("data"))
        ).to.reverted;
    });
});

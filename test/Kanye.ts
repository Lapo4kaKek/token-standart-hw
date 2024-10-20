import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { KanyeTokenERC721 } from "../typechain-types/contracts/KanyeERC721.sol";

describe("KanyeTokenERC721 contract", function () {
    async function deployTokenFixture() {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const KanyeTokenFactory = await ethers.getContractFactory("KanyeTokenERC721");
        const kanyeToken = (await KanyeTokenFactory.deploy()) as KanyeTokenERC721;

        return { kanyeToken, owner, addr1, addr2 };
    }

    it("Should deploy with the correct name and symbol", async function () {
        const { kanyeToken } = await loadFixture(deployTokenFixture);
        expect(await kanyeToken.name()).to.equal("Kanye");
        expect(await kanyeToken.symbol()).to.equal("YE");
    });

    it("Should allow the owner to set the price of the token", async function () {
        const { kanyeToken, owner } = await loadFixture(deployTokenFixture);
        await kanyeToken.connect(owner).setPrice(ethers.parseEther("0.02"));
        expect(await kanyeToken.pricePerToken()).to.equal(ethers.parseEther("0.02"));
    });

    it("Should revert if a non-owner tries to set the price", async function () {
        const { kanyeToken, addr1 } = await loadFixture(deployTokenFixture);
        await expect(kanyeToken.connect(addr1).setPrice(ethers.parseEther("0.02"))).to.be.reverted;
    });

    it("Should mint a token when correct Ether is sent", async function () {
        const { kanyeToken, addr1 } = await loadFixture(deployTokenFixture);
        const tokenURI = "https://example.com/kanye-metadata.json";
        await kanyeToken.connect(addr1).buyToken(tokenURI, { value: ethers.parseEther("0.01") });
        expect(await kanyeToken.tokenCounter()).to.equal(1);
        expect(await kanyeToken.ownerOf(1)).to.equal(addr1.address);
    });

    it("Should revert if incorrect Ether is sent for buying a token", async function () {
        const { kanyeToken, addr1 } = await loadFixture(deployTokenFixture);
        const tokenURI = "https://example.com/kanye-metadata.json";
        await expect(kanyeToken.connect(addr1).buyToken(tokenURI, { value: ethers.parseEther("0.005") })).to.be.revertedWith("Incorrect Ether value sent for one NFT");
    });

    it("Should correctly track token ownership", async function () {
        const { kanyeToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
        const tokenURI1 = "https://example.com/kanye-metadata-1.json";
        const tokenURI2 = "https://example.com/kanye-metadata-2.json";
        
        // Addr1 buys token 1
        await kanyeToken.connect(addr1).buyToken(tokenURI1, { value: ethers.parseEther("0.01") });
        expect(await kanyeToken.ownerOf(1)).to.equal(addr1.address);

        // Addr2 buys token 2
        await kanyeToken.connect(addr2).buyToken(tokenURI2, { value: ethers.parseEther("0.01") });
        expect(await kanyeToken.ownerOf(2)).to.equal(addr2.address);
    });
});
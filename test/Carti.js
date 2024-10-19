import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import hre from "hardhat";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Carti Token", function () {
    let Carti;
    let carti;
    let owner;
    let addr1;
    let addr2;
    let addrs;
  
    beforeEach(async function () {
      Carti = await ethers.getContractFactory("Carti");
      [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
  
      carti = await Carti.deploy();
      await carti.deployed();
    });
  
    it("Should set the correct owner", async function () {
      expect(await carti.owner()).to.equal(owner.address);
    });
  
    it("Should allow the owner to mint tokens", async function () {
      await carti.mint(owner.address, 1000);
      const balance = await carti.balanceOf(owner.address);
      expect(balance).to.equal(1000);
    });
  
    it("Should prevent non-owners from minting tokens", async function () {
      await expect(carti.connect(addr1).mint(addr1.address, 1000)).to.be.revertedWith("Ownable: caller is not the owner");
    });
  
    it("Should allow buying tokens with ETH", async function () {
      await carti.mint(carti.address, 1000); // Mint tokens to contract itself for selling
      const initialBalance = await carti.balanceOf(addr1.address);
      expect(initialBalance).to.equal(0);
  
      await carti.connect(addr1).buy({ value: ethers.utils.parseEther("0.01") });
  
      const finalBalance = await carti.balanceOf(addr1.address);
      expect(finalBalance).to.equal(1); // 0.01 ETH = 1 token
    });
  
    it("Should fail if not enough ETH is sent to buy tokens", async function () {
      await carti.mint(carti.address, 1000); // Mint tokens to contract itself for selling
  
      await expect(carti.connect(addr1).buy({ value: ethers.utils.parseEther("0.001") })).to.be.revertedWith("Insufficient ETH to buy any tokens");
    });
  
    it("Should apply transfer fee correctly", async function () {
      await carti.mint(owner.address, 1000);
      await carti.setTransferFee(5); // Set transfer fee to 5%
  
      await carti.transfer(addr1.address, 100);
  
      const addr1Balance = await carti.balanceOf(addr1.address);
      const ownerBalance = await carti.balanceOf(owner.address);
  
      expect(addr1Balance).to.equal(95); // 100 - 5% fee = 95 tokens
      expect(ownerBalance).to.equal(900); // Owner lost 100 tokens
    });
  
    it("Should revert if the transfer fee is greater than 99%", async function () {
      await expect(carti.setTransferFee(100)).to.be.revertedWith("Transfer fee cannot exceed 99%");
    });
  
    it("Should burn transfer fee when transferring", async function () {
      await carti.mint(owner.address, 1000);
      await carti.setTransferFee(10); // 10% transfer fee
  
      await carti.transfer(addr1.address, 100);
  
      const ownerBalance = await carti.balanceOf(owner.address);
      const addr1Balance = await carti.balanceOf(addr1.address);
      const totalSupply = await carti.totalSupply();
  
      expect(addr1Balance).to.equal(90); // 100 - 10% = 90 tokens
      expect(ownerBalance).to.equal(900);
      expect(totalSupply).to.equal(990); // 10 tokens burned
    });
  
    it("Should allow transfers with transferFrom and apply fee", async function () {
      await carti.mint(owner.address, 1000);
      await carti.approve(addr1.address, 100);
      await carti.setTransferFee(10); // 10% transfer fee
  
      await carti.connect(addr1).transferFrom(owner.address, addr2.address, 100);
  
      const addr2Balance = await carti.balanceOf(addr2.address);
      const ownerBalance = await carti.balanceOf(owner.address);
  
      expect(addr2Balance).to.equal(90); // 100 - 10% = 90 tokens
      expect(ownerBalance).to.equal(900);
    });
  });
import { ethers } from "hardhat";
import { expect } from "chai";
//import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Carti } from "../typechain-types/contracts/CartiERC20.sol";

describe("Carti Token", function () {
  let carti: Carti;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    const CartiFactory = await ethers.getContractFactory("Carti");
    [owner, addr1, addr2] = await ethers.getSigners();

    carti = (await CartiFactory.deploy()) as Carti;
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
    await carti.mint(carti.address, 1000); // Mint tokens to contract for sale
    const initialBalance = await carti.balanceOf(addr1.address);
    expect(initialBalance).to.equal(0);

    await carti.connect(addr1).buy({ value: ethers.utils.parseEther("0.01") });

    const finalBalance = await carti.balanceOf(addr1.address);
    expect(finalBalance).to.equal(1); //
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KanyeTokenERC721 is ERC721URIStorage, Ownable {
    uint256 public pricePerToken = 0.01 ether;
    uint256 public tokenCounter;

    constructor() ERC721("Kanye", "YE") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    /// @notice Allows only the owner to set the price of the token
    /// @param new_price The new price to set for each token
    function setPrice(uint256 new_price) external onlyOwner {
        pricePerToken = new_price;
    }

    /// @notice Allows users to purchase an NFT by sending the exact amount of Ether specified as the token price.
    /// @param tokenURI The URI pointing to the metadata of the NFT being purchased.
    function buyToken(string memory tokenURI) external payable {
        require(msg.value == pricePerToken, "Incorrect Ether value sent for one NFT");
        tokenCounter += 1;
        _mint(msg.sender, tokenCounter);
        _setTokenURI(tokenCounter, tokenURI);
    }
}
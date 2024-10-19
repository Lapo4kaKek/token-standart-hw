
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Rub is ERC1155, Ownable {
    string private baseURI;
    uint256 public constant TOKEN_ID = 0;
    constructor(
    ) ERC1155("https://i-am-music.ru/static/images/1.png") Ownable(msg.sender) {
        baseURI="https://i-am-music.ru/static/images/1.png";
    }

    /**
     * @notice Allows the owner to update the base URI for token metadata.
     * @param newURI The new base URI.
     */
    function setURI(string memory newURI) public onlyOwner {
        baseURI = newURI;
        _setURI(newURI);
    }

    /**
     * @notice Allows a user to buy tokens by sending ETH.
     * The number of tokens bought is proportional to the amount of ETH sent.
     * @dev Tokens are automatically minted for the user based on the amount of ETH sent.
     */
    function buy() public payable {
        require(msg.value > 0, "Value must be more then zero");
        uint256 tokensToBuy = msg.value;

        _mint(msg.sender, TOKEN_ID, tokensToBuy, "");
    }

    /**
     * @notice Mints a specified amount of tokens to a given address. Can only be called by the owner.
     * @param account The address to mint the tokens to.
     * @param id The ID of the token type.
     * @param amount The number of tokens to mint.
     * @param data Additional data that can be passed with the minting process.
     */
    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        _mint(account, id, amount, data);
    }


    /**
     * @notice Returns the base URI.
     * @return The base URI for token metadata.
     */
    function _baseURI() internal view returns (string memory) {
        return baseURI;
    }
}
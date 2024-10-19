
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Kanye is ERC721, ERC721URIStorage, Ownable {
    string public baseURI;
    uint256 private _latestTokenId = 1;

    constructor(
    ) ERC721("Kanye", "YE") Ownable(msg.sender) {}

    /**
     * @notice Allows the caller to mint (buy) a new token. The token ID is automatically incremented.
     * @dev The token is minted using _safeMint, which ensures that contracts receiving tokens
     * implement the ERC721 receiver interface.
     * @dev Token ID starts from 2 (since _latestTokenId is incremented before minting).
     */
    function buy() public payable {
        require(msg.value > 0, "You must send some ETH to buy a token");
        _latestTokenId++;

        _safeMint(msg.sender, _latestTokenId);
    }

    /**
     * @notice Mints a new token to the specified address. Can only be called by the owner of the contract.
     * @dev The token's URI is set after minting using _setTokenURI.
     * @param to The address where the newly minted token will be assigned.
     * @param tokenId The unique ID of the token to be minted.
     */
    function safeMint(address to, uint256 tokenId) public onlyOwner {
        require(to != address(0), "Cannot mint to the zero address"); 
        require(tokenId > 0, "Token ID must be greater than 0"); 
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, "https://i-am-music.ru/static/images/1.pngT");
    }

    /**
    * @notice Sets a new base URI for token metadata
    * @param newBaseURI The new base URI to use
    */
    function setBaseURI(string memory newBaseURI) public onlyOwner {
        baseURI = newBaseURI;
    }
    
    /**
     * @notice Returns the current base URI
     * @return The base URI for token metadata
     */
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }


    /**
     * @notice Returns the URI (Uniform Resource Identifier) for a given token ID.
     * @dev This function overrides the ERC721 and ERC721URIStorage implementations.
     * @param tokenId The ID of the token whose URI is being requested
     * @return The URI of the specified token.
     */
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
     * @notice Checks if the contract supports a specific interface.
     * @dev This function overrides the ERC721 and ERC721URIStorage implementations.
     * @param interfaceId The ID of the interface to check.
     * @return True if the contract supports the given interface, false otherwise.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

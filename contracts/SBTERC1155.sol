// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

// contract SoulboundToken is ERC1155, Ownable {
//     uint256 public constant SBT_TOKEN_ID = 0;

//     constructor() ERC1155("https://example.com/metadata/SoulboundToken.json") Ownable(msg.sender) {}

//     function _beforeTokenTransfer(
//         address operator,
//         address from,
//         address to,
//         uint256[] memory ids,
//         uint256[] memory amounts,
//         bytes memory data
//     ) internal override(ERC1155) {
//         require(from == address(0), "Soulbound: token is non-transferable");
//         super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
//     }

//     function mint(address to, uint256 amount) public onlyOwner {
//         _mint(to, SBT_TOKEN_ID, amount, "");
//     }

//     function burn(address from, uint256 amount) public onlyOwner {
//         _burn(from, SBT_TOKEN_ID, amount);
//     }
// }
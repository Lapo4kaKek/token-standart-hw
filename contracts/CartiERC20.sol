 pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Carti is ERC20, ERC20Permit, Ownable {
    uint256 public transferFee;
    uint256 public pricePerToken = 0.01 ether;

    constructor(
    ) ERC20("Carti", "CARTI") ERC20Permit("Carti") Ownable(msg.sender) {
        transferFee = 1;
    }

    /**
     * @notice Sets a new transfer fee percentage.
     * @dev Transfer fee cannot exceed 100%.
     * @param _transferFee The new transfer fee percentage.
     */
    function setTransferFee(uint256 _transferFee) public onlyOwner {
        require(_transferFee <= 99, "Transfer fee cannot exceed 99%"); 
        require(_transferFee >= 0, "Transfer fee cannot be negative");
        transferFee = _transferFee;
    }

    /**
     * @notice Buys tokens by sending ETH to the contract.
     * @dev The number of tokens received is equal to the amount of ETH sent.
     */
    function buy() public payable {
        require(msg.value > 0, "You need to send some ETH to buy tokens");

        uint256 tokensToBuy = msg.value / pricePerToken;
        require(tokensToBuy > 0, "Insufficient ETH to buy any tokens");

        uint256 contractBalance = balanceOf(address(this));
        require(contractBalance >= tokensToBuy, "Not enough tokens in the contract");

        _transfer(address(this), msg.sender, tokensToBuy);
    }

    /**
     * @notice Mints new tokens to a specified address.
     * @dev Only the contract owner can call this function.
     * @param to The address where tokens will be minted.
     * @param amount The number of tokens to mint.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(amount > 0, "Amount must be more then 0");
        require(to != address(0), "Cannot mint to the zero address");
        _mint(to, amount);
    }

    /**
     * @notice Transfers tokens, applying a transfer fee.
     * @dev A percentage fee is deducted from the transfer amount.
     * @param to The address to transfer tokens to.
     * @param value The number of tokens to transfer.
     * @return A boolean indicating whether the operation succeeded.
     */
    function transfer(
        address to,
        uint256 value
    ) public virtual override returns (bool) {
        require(to != address(0), "Cannot transfer to the zero address");
        require(value > 0, "Transfer amount should be greater than zero");
        require(balanceOf(msg.sender) >= value, "Not enough tokens to transfer");

        address owner = _msgSender();
        uint256 feeAmount = (value * transferFee) / 100;
        uint256 actualAmount = value - feeAmount;

        _transfer(owner, to, actualAmount);

        if (to != address(this)) {
            _burn(owner, feeAmount);
        }
        return true;
    }

    /**
     * @notice Transfers tokens from one address to another, applying a transfer fee.
     * @dev A percentage fee is deducted from the transfer amount.
     * @param from The address to send tokens from.
     * @param to The address to send tokens to.
     * @param value The number of tokens to transfer.
     * @return A boolean indicating whether the operation succeeded.
     */
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public virtual override returns (bool) {
        require(from != address(0), "Cannot transfer from the zero address");
        require(to != address(0), "Cannot transfer to the zero address");
        require(value > 0, "Transfer amount should be greater than zero");
        require(balanceOf(from) >= value, "Not enough tokens to transfer");
        require(allowance(from, _msgSender()) >= value, "Transfer amount exceeds allowance");

        address spender = _msgSender();
        _spendAllowance(from, spender, value);

        uint256 feeAmount = (value * transferFee) / 100;
        uint256 actualAmount = value - feeAmount;

        _transfer(from, to, actualAmount);

        if (to != address(this)) {
            _burn(from, feeAmount);
        }

        return true;
    }
}
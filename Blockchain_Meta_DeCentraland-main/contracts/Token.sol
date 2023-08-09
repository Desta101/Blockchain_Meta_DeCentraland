// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import the ERC20 standard from OpenZeppelin. ERC20 standard is for fungible tokens.
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

// The Token contract extends ERC20.
contract Token is ERC20 {
    // Wallet to receive funds when tokens are purchased.
    address payable private fundsWallet;

    // Price for each token.
    uint256 private price;

    // Constructor of the contract.
    // It initializes the ERC20 contract, sets the wallet to receive funds, and sets the token price.
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        fundsWallet = payable(_msgSender()); // Set the wallet to receive funds.
        price = 0.1 ether; // Set the token price.
        _mint(_msgSender(), 10000 * 10**uint(decimals())); // Mint initial tokens.
    }

    // Function to get the token price.
    function getPrice() public view returns (uint256) {
        return price;
    }

    // Function to buy tokens.
    function buyTokens() public payable {
        require(_msgSender() != fundsWallet); // The sender cannot be the wallet to receive funds.
        uint256 amount = msg.value * (1 ether / price); // Calculate the amount of tokens to buy.
        require(balanceOf(fundsWallet) >= amount); // The wallet to receive funds must have enough balance.

        _transfer(fundsWallet, _msgSender(), amount); // Transfer the tokens.

        fundsWallet.transfer(msg.value); // Transfer the funds to the wallet.
    }
}

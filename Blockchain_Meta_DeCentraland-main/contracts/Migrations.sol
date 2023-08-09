// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// The Migrations contract is a helper provided by the Truffle Suite that allows you to handle additional 
// deployment steps, ensuring the deployment process is handled correctly with complex migrations scripts.
contract Migrations {
  // Owner address
  address public owner;

  // Last completed migration
  uint public last_completed_migration;

  // Modifier to restrict access to owner only
  modifier restricted() {
    if (msg.sender == owner) _; // If the sender is owner, continue execution
  }

  // Constructor. It initializes the contract setting the contract deployer as the owner.
  constructor() {
    owner = msg.sender;
  }

  // Method to mark a migration as completed. It can be executed only by the owner.
  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import the ERC721 standard and Ownable contract from OpenZeppelin. 
// ERC721 standard is for non-fungible tokens (NFTs), and Ownable restricts some functions to be called by the contract owner only.
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import "@openzeppelin/contracts/utils/Counters.sol"; // Counter to manage tokenIds.
import '@openzeppelin/contracts/access/Ownable.sol'; // Restricts some functionalities to contract owner.
import './Token.sol'; // Another contract used in this contract.

// Enumeration to define the type of Land.
enum LandType { NFT, PARK, ROAD }

// The World contract extends ERC721 and Ownable
contract World is ERC721, Ownable {
    using Counters for Counters.Counter;

    // Counter to manage tokenIds.
    Counters.Counter private _tokenIds;

    // Instance of Token contract.
    Token private token;

    // Land struct for each Land.
    struct Land {
        uint256 tokenId; // Unique ID for each Land.
        uint8 row; // The row coordinate of Land.
        uint8 col; // The column coordinate of Land.
        LandType landType; // The type of Land.
        string game; // The name of game.
        uint256 price; // The price of Land.
    }

    // Mapping from tokenId to Land. tokenId is unique for each Land.
    mapping(uint256 => Land) private lands;

    // Constructor of the contract.
    // It initializes the ERC721 contract and sets the instance of Token contract.
    constructor(Token _token) ERC721('Land', 'LAND') Ownable() {
        token = _token;
    }

    // Mint function to create new Lands.
    // This function is restricted to owner only.
    function mint(uint8 row, uint8 col, LandType landType, uint256 price) public onlyOwner {
        if (landType == LandType.PARK) {
            require(owner() == _msgSender(), 'Only the owner of the world can mint park');
        } else {
            require(landType == LandType.NFT);
        }

        _tokenIds.increment(); // Increase the tokenId for new Land.

        uint256 tokenId = _tokenIds.current(); // Get the current tokenId.
        _mint(_msgSender(), tokenId); // Mint the new Land.
        setLand(Land(tokenId, row, col, landType, '', price)); // Set the details of Land.
    }

    // Function to get the total number of tokens.
    function getTokensCount() public view returns (uint256) {
        return _tokenIds.current();
    }

    // Function to get the entire map of Lands.
    function getMap() public view returns (address[] memory, Land[] memory) {
        uint256 numOfTokens = getTokensCount(); // Get the total number of tokens.
        address[] memory owners = new address[](numOfTokens); // Array to store the owner of each Land.
        Land[] memory map = new Land[](numOfTokens); // Array to store the Land details of each Land.

        for (uint256 i = 0; i < numOfTokens; i++) {
            owners[i] = ownerOf(i + 1); // Get the owner of the Land.
            map[i] = lands[i + 1]; // Get the Land details.
        }

        return (owners, map); // Return the owner and Land details.
    }

    // Function to set the Land details.
    // This function can be called by any address, but the tokenId must exist and the price cannot be negative.
    function setLand(Land memory land) public {
        require(_exists(land.tokenId), 'Land set of nonexistent token'); // The tokenId must exist.
        require(land.price >= 0, 'Land price cannot be negative number'); // The price cannot be negative.

        lands[land.tokenId] = land; // Set the Land details.
    }

    // Function to transfer the Land.
    // This function can be called by any address, but the landType must be NFT and the sender cannot be the receiver.
    function transferLand(uint256 tokenId, address to) public payable {
        require(lands[tokenId].landType == LandType.NFT, 'Only NFT lands can be transfer'); // The landType must be NFT.
        require(_msgSender() != to, 'You cannot transfer land to yourself'); // The sender cannot be the receiver.

        // Transfer the tokens.
        token.transferFrom(to, _msgSender(), lands[tokenId].price * (10 ** token.decimals()));
        // Transfer the Land.
        _transfer(_msgSender(), to, tokenId);
    }
}

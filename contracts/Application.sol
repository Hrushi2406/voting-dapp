// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./Election.sol";

contract Application {
    // Owner
    address public owner;

    // To store all elections
    mapping(uint256 => address) public elections;

    // Total number of elections
    uint256 public nElections;

    // On successful election creation
    event ElectionCreated(address electionAddress, address ownerAddress);

    constructor() {
        owner = msg.sender;
    }

    // A function to deploy new election contract
    function createElection(
        string memory _title,
        string memory _description,
        string[] memory _options
    ) public {
        bytes32 emptyHash = keccak256(bytes(""));

        // To check _title is not empty string
        require(
            keccak256(bytes(_title)) != emptyHash,
            "Title or Description can't be empty"
        );
        // To check _description is not empty string
        require(
            keccak256(bytes(_description)) != emptyHash,
            "Title or Description can't be empty"
        );
        // To check _options is not empty string
        for (uint256 i = 0; i < _options.length; i++) {
            require(
                keccak256(bytes(_options[i])) != emptyHash,
                "Options can't be empty"
            );
        }

        // Create and deploy contract
        Election _election = new Election(
            msg.sender,
            _title,
            _description,
            _options
        );

        // Store election contract address for fetching afterwards
        elections[nElections] = address(_election);
        nElections++;

        // Let the frontend know after success
        emit ElectionCreated(address(_election), msg.sender);
    }

    // Get election overview by index
    function getElectionOverview(uint256 _index)
        public
        view
        returns (
            address electionAddress,
            string memory,
            string memory
        )
    {
        Election _election = Election(elections[_index]);
        // Returns contract address, title and description of election
        return (elections[_index], _election.title(), _election.description());
    }
}

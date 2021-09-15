// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract Voting {
    // Address that creates voting program
    address public owner;

    // Count of votes to A
    uint256 public countA;

    // Count of votes to B
    uint256 public countB;

    // Program Title
    string public title;

    // Program Description
    string public description;

    // To check if results have been announced
    bool public isResultAnnounced;

    // To store all the addresses who have already voted
    mapping(address => bool) public voters;

    // Emitted when results are announced successfully
    event ResultAnnounced(uint256 countA, uint256 countB);

    constructor(string memory _title, string memory _description) {
        // To check _title and _description are not empty strings
        // require(_title != "", "No title provided");
        // require(_description != "", "No description provided");

        owner = msg.sender;
        title = _title;
        description = _description;
    }

    // Function to cast vote to either A or B
    function vote(bool isA) public {
        // Check if result already announced
        require(!isResultAnnounced, "Cannot vote after result announcement");
        // Check if voter has already voted
        require(!voters[msg.sender], "You have already voted");
        // If true then vote for A else B
        if (isA) {
            countA++;
        } else {
            countB++;
        }
        // Mark as voted
        voters[msg.sender] = true;
    }

    // Function to announce results which can be called by only owner
    function announceResult() public {
        // Check if results already announced
        require(!isResultAnnounced, "Result already announced");
        // Check if caller is owner
        require(msg.sender == owner, "Only owner can announce result");

        // Mark result as announced
        isResultAnnounced = true;

        // Emit event along with result data
        emit ResultAnnounced(countA, countB);
    }
}

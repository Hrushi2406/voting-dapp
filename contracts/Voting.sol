// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract Voting {
    address public owner;
    uint public countA;
    uint public countB;
    string public title;
    string public description;
    bool public isResultDeclared;
    mapping(address => bool) public voters;
    event ResultAnnounced(uint countA, uint countB);

    constructor(string memory _title, string memory _description) {
        // require(_title != "", "No title provided");
        // require(_description != "", "No description provided");
        owner = msg.sender;
        title = _title;
        description = _description;
    }

    function vote(bool isA) public {
        require(!isResultDeclared, "Can't vote after result announcement");
        require(!voters[msg.sender], "You have already voted");
        voters[msg.sender] = true;
        if(isA) {
            countA++;
        } else{
            countB++;
        }
    }

    function announceResult() public {
        require(msg.sender == owner, "Only owner can announce result");
        isResultDeclared = true;
        emit ResultAnnounced(countA, countB);
    }
}

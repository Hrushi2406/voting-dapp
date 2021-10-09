// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract Election {
    // Address that creates voting program
    address public owner;

    // Program Title
    string public title;

    // Program Description
    string public description;

    // To check if results have been announced
    bool public isResultAnnounced;

    // To store all the addresses who have already voted
    mapping(address => bool) public voters;

    // Option struct
    struct Option {
        string name;
        uint256 count;
    }

    // Mapping for counting votes to each option
    mapping(uint256 => Option) public optionCounts;

    // Number of options
    uint256 public nOptions = 0;

    // Index of option with max votes
    uint256 public maxVotesIndex = 0;

    // Current max votes to any option
    uint256 public maxVotes = 0;

    // Emitted when results are announced successfully
    event ResultAnnounced(Option winnerOption, uint256 maxVotes);

    constructor(
        address _owner,
        string memory _title,
        string memory _description,
        string[] memory _options
    ) {
        // To check _title, _description and _options are not empty strings
        // require(_title != "", "No title provided");
        // require(_description != "", "No description provided");

        owner = _owner;
        title = _title;
        description = _description;
        nOptions = _options.length;
        // Create mapping of index => Option(name, count)
        for (uint256 i = 0; i < nOptions; i++) {
            optionCounts[i] = Option(_options[i], 0);
        }
    }

    // Function to cast vote
    function vote(uint256 index) public {
        // Check if result already announced
        require(!isResultAnnounced, "Cannot vote after result announcement");
        // Check if voter has already voted
        require(!voters[msg.sender], "You have already voted");
        // Vote for option corresponding to index
        optionCounts[index].count++;
        // Adjust option with maximum votes
        if (optionCounts[index].count > maxVotes) {
            maxVotes = optionCounts[index].count;
            maxVotesIndex = index;
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
        emit ResultAnnounced(optionCounts[maxVotesIndex], maxVotes);
    }
}

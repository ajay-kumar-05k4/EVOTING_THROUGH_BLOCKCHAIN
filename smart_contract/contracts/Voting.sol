// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    mapping(uint256 => Candidate) public candidates;

    mapping(address => bool) public voters;
    mapping(string => bool) public votersEmail;

    uint256 public candidatesCount;

    address public owner;

    event Voted(uint256 indexed candidateId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the election owner can do this.");
        _;
    }

    constructor(string[] memory candidateNames) {
        owner = msg.sender;
        for (uint256 i = 0; i < candidateNames.length; i++) {
            addCandidate(candidateNames[i]);
        }
    }

    function addCandidate(string memory name) public onlyOwner {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, name, 0);
    }

    function vote(uint256 candidateId, string memory userEmail) public {
        require(!voters[msg.sender] && !votersEmail[userEmail], "You have already voted.");

        require(candidateId > 0 && candidateId <= candidatesCount, "Invalid candidate ID.");

        candidates[candidateId].voteCount++;
        voters[msg.sender] = true;
        votersEmail[userEmail] = true;

        emit Voted(candidateId);
    }

    function getVotes(uint256 candidateId) public view returns (uint256) {
        require(candidateId > 0 && candidateId <= candidatesCount, "Invalid candidate ID.");
        return candidates[candidateId].voteCount;
    }

    function hasvoted(address voter, string memory userEmail) public view returns (bool) {
        return voters[voter] || votersEmail[userEmail];
    }

    function getWinner() public view returns (uint256) {
        uint256 winningVoteCount = 0;
        uint256 winningCandidateId = 0;

        for (uint256 i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winningCandidateId = i;
            }
        }

        return winningCandidateId;
    }
}
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging on local networks (hardhat). Remove for production.
import "hardhat/console.sol";

/**
 * YourContract — простая система децентрализованного голосования.
 * - Именованный массив кандидатов (name, voteCount)
 * - Голосовать может любой адрес, но только 1 раз
 * - Владелец (deployer) может добавлять кандидатов
 * - Голосование ограничено по времени (start / end)
 */
contract YourContract {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    Candidate[] public candidates;
    address public owner;
    mapping(address => bool) public voters;

    uint256 public votingStart;
    uint256 public votingEnd;

    event CandidateAdded(string name);
    event VoteCast(address indexed voter, uint256 indexed candidateIndex);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    /**
     * @param _candidateNames - начальный список кандидатов
     * @param _durationInMinutes - длительность голосования в минутах (от момента деплоя)
     */
    constructor(string[] memory _candidateNames, uint256 _durationInMinutes) {
        owner = msg.sender;
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);

        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate({name: _candidateNames[i], voteCount: 0}));
        }

        console.log("YourContract deployed by", msg.sender);
    }

    function addCandidate(string memory _name) public onlyOwner {
        candidates.push(Candidate({name: _name, voteCount: 0}));
        emit CandidateAdded(_name);
    }

    function vote(uint256 _candidateIndex) public {
        require(block.timestamp >= votingStart, "Voting has not started");
        require(block.timestamp < votingEnd, "Voting has ended");
        require(!voters[msg.sender], "You have already voted.");
        require(_candidateIndex < candidates.length, "Invalid candidate index.");

        candidates[_candidateIndex].voteCount += 1;
        voters[msg.sender] = true;

        emit VoteCast(msg.sender, _candidateIndex);
    }

    /// Возвращает всех кандидатов (имя + кол-во голосов)
    function getAllCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getCandidatesCount() public view returns (uint256) {
        return candidates.length;
    }

    /// true — если текущее время внутри окна голосования
    function getVotingStatus() public view returns (bool) {
        return block.timestamp >= votingStart && block.timestamp < votingEnd;
    }

    /// сколько секунд осталось до окончания (0 если уже окончено)
    function getRemainingTime() public view returns (uint256) {
        if (block.timestamp < votingStart) {
            // ещё не началось — возвращаем оставшееся до старта
            return votingStart - block.timestamp;
        }
        if (block.timestamp >= votingEnd) {
            return 0;
        }
        return votingEnd - block.timestamp;
    }

    // Для возможности отправить ETH на контракт
    receive() external payable {}
}

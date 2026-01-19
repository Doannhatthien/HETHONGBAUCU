const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');

// Load contract ABI
const contractABI = [
    {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"candidateId","type":"uint256"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"string","name":"position","type":"string"}],"name":"CandidateRegistered","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"enum ClassElection.ElectionState","name":"newState","type":"uint8"}],"name":"ElectionStateChanged","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"uint256","name":"candidateId","type":"uint256"}],"name":"Voted","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"voter","type":"address"}],"name":"VoterRegistered","type":"event"},
    {"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_position","type":"string"}],"name":"addCandidate","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"string","name":"_position","type":"string"}],"name":"addPosition","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"candidates","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"position","type":"string"},{"internalType":"uint256","name":"voteCount","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"candidatesCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"endElection","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"getCandidates","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"position","type":"string"},{"internalType":"uint256","name":"voteCount","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"internalType":"struct ClassElection.Candidate[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getPosition","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getPositionsCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getResults","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"position","type":"string"},{"internalType":"uint256","name":"voteCount","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"internalType":"struct ClassElection.Candidate[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getTotalVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"hasVoted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"positions","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_position","type":"string"}],"name":"registerCandidate","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"_voter","type":"address"}],"name":"registerVoter","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address[]","name":"_voters","type":"address[]"}],"name":"registerVoters","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"resetElection","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"startRegistration","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"startVoting","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"state","outputs":[{"internalType":"enum ClassElection.ElectionState","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_candidateId","type":"uint256"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"voterAddresses","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"voters","outputs":[{"internalType":"bool","name":"isRegistered","type":"bool"},{"internalType":"bool","name":"hasVoted","type":"bool"},{"internalType":"uint256","name":"votedCandidateId","type":"uint256"},{"internalType":"bool","name":"canRegisterCandidates","type":"bool"}],"stateMutability":"view","type":"function"}
];

const web3 = new Web3(process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545');

const getContract = () => {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error('CONTRACT_ADDRESS not configured in .env');
    }
    return new web3.eth.Contract(contractABI, contractAddress);
};

// Test blockchain connection
const testConnection = async () => {
    try {
        await web3.eth.getBlockNumber();
        console.log('✓ Đã kết nối Blockchain node');
        return true;
    } catch (error) {
        console.error('❌ Lỗi kết nối Blockchain:', error.message);
        console.log('⚠️ Chạy: npx hardhat node (để khởi động blockchain local)');
        return false;
    }
};

// Test connection on startup
testConnection();

module.exports = {
    web3,
    getContract,
    contractABI,
    testConnection
};

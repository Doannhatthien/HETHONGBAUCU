// private-voting.js - Xử lý bầu cử khép kín với mật khẩu và blockchain

// Blockchain Configuration
let web3;
let contract;
let userAccount;
let isAdmin = false;
let currentUser = null;
let selectedCandidate = null;

// Contract Configuration (same as app.js)
const CONTRACT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"candidateId","type":"uint256"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"string","name":"position","type":"string"}],"name":"CandidateRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"enum ClassElection.ElectionState","name":"newState","type":"uint8"}],"name":"ElectionStateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"uint256","name":"candidateId","type":"uint256"}],"name":"Voted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"voter","type":"address"}],"name":"VoterRegistered","type":"event"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_position","type":"string"}],"name":"addCandidate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_position","type":"string"}],"name":"addPosition","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"candidates","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"position","type":"string"},{"internalType":"uint256","name":"voteCount","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"candidatesCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"endElection","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getCandidates","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"position","type":"string"},{"internalType":"uint256","name":"voteCount","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"internalType":"struct ClassElection.Candidate[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPositions","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTotalVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hasVoted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"positions","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_voter","type":"address"}],"name":"registerVoter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startRegistration","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startVoting","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"state","outputs":[{"internalType":"enum ClassElection.ElectionState","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_candidateId","type":"uint256"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"voters","outputs":[{"internalType":"bool","name":"isRegistered","type":"bool"},{"internalType":"bool","name":"hasVoted","type":"bool"}],"stateMutability":"view","type":"function"}];

const CONTRACT_ADDRESS = '0x3Ef98db51C49080B3D615f79A64ce798711BA9f4'; // Địa chỉ contract ClassElection

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    displayUserInfo();
    setupEventListeners();
    
    // Connect to blockchain first
    await connectToBlockchain();
});

// Connect to blockchain
async function connectToBlockchain() {
    try {
        if (typeof window.ethereum === 'undefined') {
            alert('Vui lòng cài đặt MetaMask để sử dụng chức năng này!');
            return;
        }

        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        
        // Initialize Web3
        web3 = new Web3(window.ethereum);
        
        // Initialize contract
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        
        // Check if user is admin
        const adminAddress = await contract.methods.admin().call();
        isAdmin = userAccount.toLowerCase() === adminAddress.toLowerCase();
        
        // Update UI with wallet info
        document.getElementById('userRole').textContent = isAdmin ? 'Quản trị viên' : 'Cử tri';
        
        // Check if already voted
        await checkIfAlreadyVoted();
        
    } catch (error) {
        console.error('Error connecting to blockchain:', error);
        alert('Lỗi kết nối blockchain: ' + error.message);
    }
}

// Display user info
function displayUserInfo() {
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    
    if (currentUser) {
        userInfo.style.display = 'flex';
        userName.textContent = currentUser.username;
        userRole.textContent = currentUser.role === 'admin' ? 'Quản trị viên' : 'Sinh viên';
    }
}

// Setup event listeners
function setupEventListeners() {
    const logoutBtn = document.getElementById('logoutBtn');
    const unlockVotingBtn = document.getElementById('unlockVoting');
    const passwordInput = document.getElementById('electionPasswordInput');
    const confirmVoteBtn = document.getElementById('confirmVoteBtn');
    const cancelVoteBtn = document.getElementById('cancelVoteBtn');
    
    logoutBtn.addEventListener('click', logout);
    unlockVotingBtn.addEventListener('click', unlockVoting);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') unlockVoting();
    });
    passwordInput.addEventListener('input', clearError);
    
    confirmVoteBtn.addEventListener('click', confirmVote);
    cancelVoteBtn.addEventListener('click', cancelSelection);
}

// Check if user already voted
async function checkIfAlreadyVoted() {
    try {
        if (!contract || !userAccount) return;
        
        const hasVoted = await contract.methods.hasVoted(userAccount).call();
        
        if (hasVoted) {
            // If already voted, skip password and show voted notice
            document.getElementById('lockScreen').style.display = 'none';
            document.getElementById('votingArea').classList.add('unlocked');
            document.getElementById('candidatesListPrivate').style.display = 'none';
            document.getElementById('alreadyVotedNotice').style.display = 'block';
        }
    } catch (error) {
        console.error('Error checking vote status:', error);
    }
}

// Unlock voting with password
function unlockVoting() {
    const passwordInput = document.getElementById('electionPasswordInput');
    const passwordError = document.getElementById('passwordError');
    const enteredPassword = passwordInput.value.trim();
    
    // Get election config
    const electionConfig = JSON.parse(localStorage.getItem('election_config') || '{}');
    
    // Check if private mode is active
    if (electionConfig.mode !== 'private') {
        showError('Chế độ bầu cử khép kín chưa được kích hoạt!');
        return;
    }
    
    // Check password
    if (enteredPassword === electionConfig.password) {
        // Password correct - unlock voting area
        document.getElementById('lockScreen').style.display = 'none';
        document.getElementById('votingArea').classList.add('unlocked');
        loadCandidates();
    } else {
        // Password incorrect
        passwordInput.classList.add('error');
        passwordError.style.display = 'block';
        passwordInput.value = '';
        passwordInput.focus();
        
        // Remove error after animation
        setTimeout(() => {
            passwordInput.classList.remove('error');
        }, 500);
    }
}

// Clear password error
function clearError() {
    document.getElementById('passwordError').style.display = 'none';
}

// Show error message
function showError(message) {
    const passwordError = document.getElementById('passwordError');
    passwordError.textContent = '❌ ' + message;
    passwordError.style.display = 'block';
    
    const passwordInput = document.getElementById('electionPasswordInput');
    passwordInput.classList.add('error');
    
    setTimeout(() => {
        passwordInput.classList.remove('error');
    }, 500);
}

// Load candidates from blockchain
async function loadCandidates() {
    try {
        const candidatesList = document.getElementById('candidatesListPrivate');
        
        // Lấy từng ứng viên theo id để tiết kiệm gas
        const count = await contract.methods.candidatesCount().call();
        let candidates = [];
        for (let i = 1; i <= count; i++) {
            const c = await contract.methods.getCandidate(i).call();
            if (c.exists) candidates.push(c);
        }
        if (candidates.length === 0) {
            candidatesList.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">Chưa có ứng viên nào.</p>';
            return;
        }
        candidatesList.innerHTML = candidates.map(candidate => `
            <div class="candidate-card-private" data-candidate-id="${candidate.id}">
                <div style="display: flex; align-items: center; gap: 20px;">
                    <div style="font-size: 3em;">👤</div>
                    <div style="flex: 1;">
                        <h3 style="margin: 0; color: var(--dark-color);">${candidate.name}</h3>
                        <p style="margin: 5px 0 0 0; color: #666; font-size: 1.1em;">
                            <strong>${candidate.position}</strong>
                        </p>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 2em; font-weight: bold; color: var(--primary-color);">
                            ${candidate.voteCount}
                        </div>
                        <div style="color: #999; font-size: 0.9em;">phiếu bầu</div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add click handlers
        document.querySelectorAll('.candidate-card-private').forEach(card => {
            card.addEventListener('click', () => selectCandidate(card, candidates));
        });
    } catch (error) {
        console.error('Error loading candidates:', error);
        alert('Lỗi tải danh sách ứng viên: ' + error.message);
    }
}

// Select candidate
function selectCandidate(card, candidates) {
    // Remove previous selection
    document.querySelectorAll('.candidate-card-private').forEach(c => {
        c.classList.remove('selected');
    });
    
    // Add selection to clicked card
    card.classList.add('selected');
    
    const candidateId = card.dataset.candidateId;
    selectedCandidate = candidates.find(c => c.id == candidateId);
    
    // Show confirmation section
    document.getElementById('selectedCandidateName').textContent = selectedCandidate.name;
    document.getElementById('selectedCandidatePosition').textContent = selectedCandidate.position;
    document.getElementById('voteConfirmSection').style.display = 'block';
    
    // Scroll to confirmation section
    document.getElementById('voteConfirmSection').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Cancel selection
function cancelSelection() {
    document.querySelectorAll('.candidate-card-private').forEach(c => {
        c.classList.remove('selected');
    });
    selectedCandidate = null;
    document.getElementById('voteConfirmSection').style.display = 'none';
}

// Confirm vote
async function confirmVote() {
    if (!selectedCandidate) {
        alert('Vui lòng chọn một ứng viên!');
        return;
    }
    
    // Double confirm
    const confirmMessage = `Bạn có chắc chắn muốn bầu cho "${selectedCandidate.name}" không?\n\nSau khi xác nhận, bạn KHÔNG THỂ thay đổi lựa chọn.`;
    if (!confirm(confirmMessage)) {
        return;
    }
    
    try {
        // Show loading
        const confirmBtn = document.getElementById('confirmVoteBtn');
        const originalText = confirmBtn.textContent;
        confirmBtn.textContent = '⏳ Đang xử lý...';
        confirmBtn.disabled = true;
        
        // Send vote to blockchain
        await contract.methods.vote(selectedCandidate.id).send({ 
            from: userAccount,
            gas: 300000
        });
        
        // Show success message
        alert('✅ Bầu cử thành công!\n\nPhiếu bầu của bạn đã được ghi nhận trên blockchain. Cảm ơn bạn đã tham gia!');
        
        // Hide voting area and show already voted notice
        document.getElementById('candidatesListPrivate').style.display = 'none';
        document.getElementById('voteConfirmSection').style.display = 'none';
        document.getElementById('alreadyVotedNotice').style.display = 'block';
        
    } catch (error) {
        console.error('Error voting:', error);
        alert('❌ Lỗi bỏ phiếu: ' + (error.message || 'Đã có lỗi xảy ra'));
        
        // Restore button
        const confirmBtn = document.getElementById('confirmVoteBtn');
        confirmBtn.textContent = '✅ Xác nhận bỏ phiếu';
        confirmBtn.disabled = false;
    }
}

// Blockchain Configuration
let web3;
let contract;
let userAccount;
let isAdmin = false;

// Contract ABI - Cần thay thế bằng ABI thực tế sau khi compile
const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": false, "internalType": "uint256", "name": "candidateId", "type": "uint256"},
            {"indexed": false, "internalType": "string", "name": "name", "type": "string"},
            {"indexed": false, "internalType": "string", "name": "position", "type": "string"}
        ],
        "name": "CandidateRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": false, "internalType": "enum ClassElection.ElectionState", "name": "newState", "type": "uint8"}
        ],
        "name": "ElectionStateChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": false, "internalType": "address", "name": "voter", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "candidateId", "type": "uint256"}
        ],
        "name": "Voted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": false, "internalType": "address", "name": "voter", "type": "address"}
        ],
        "name": "VoterRegistered",
        "type": "event"
    },
    {
        "inputs": [{"internalType": "string", "name": "_name", "type": "string"}, {"internalType": "string", "name": "_position", "type": "string"}],
        "name": "addCandidate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "_position", "type": "string"}],
        "name": "addPosition",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "admin",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "name": "candidates",
        "outputs": [
            {"internalType": "uint256", "name": "id", "type": "uint256"},
            {"internalType": "string", "name": "name", "type": "string"},
            {"internalType": "string", "name": "position", "type": "string"},
            {"internalType": "uint256", "name": "voteCount", "type": "uint256"},
            {"internalType": "bool", "name": "exists", "type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "candidatesCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "endElection",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCandidates",
        "outputs": [
            {
                "components": [
                    {"internalType": "uint256", "name": "id", "type": "uint256"},
                    {"internalType": "string", "name": "name", "type": "string"},
                    {"internalType": "string", "name": "position", "type": "string"},
                    {"internalType": "uint256", "name": "voteCount", "type": "uint256"},
                    {"internalType": "bool", "name": "exists", "type": "bool"}
                ],
                "internalType": "struct ClassElection.Candidate[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "index", "type": "uint256"}],
        "name": "getPosition",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getPositionsCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getResults",
        "outputs": [
            {
                "components": [
                    {"internalType": "uint256", "name": "id", "type": "uint256"},
                    {"internalType": "string", "name": "name", "type": "string"},
                    {"internalType": "string", "name": "position", "type": "string"},
                    {"internalType": "uint256", "name": "voteCount", "type": "uint256"},
                    {"internalType": "bool", "name": "exists", "type": "bool"}
                ],
                "internalType": "struct ClassElection.Candidate[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalVotes",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "hasVoted",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "name": "positions",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "_name", "type": "string"}, {"internalType": "string", "name": "_position", "type": "string"}],
        "name": "registerCandidate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "_voter", "type": "address"}],
        "name": "registerVoter",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address[]", "name": "_voters", "type": "address[]"}],
        "name": "registerVoters",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "resetElection",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "startRegistration",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "startVoting",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "state",
        "outputs": [{"internalType": "enum ClassElection.ElectionState", "name": "", "type": "uint8"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_candidateId", "type": "uint256"}],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "name": "voterAddresses",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "", "type": "address"}],
        "name": "voters",
        "outputs": [
            {"internalType": "bool", "name": "isRegistered", "type": "bool"},
            {"internalType": "bool", "name": "hasVoted", "type": "bool"},
            {"internalType": "uint256", "name": "votedCandidateId", "type": "uint256"},
            {"internalType": "bool", "name": "canRegisterCandidates", "type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Địa chỉ contract - Cần deploy và thay thế
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Thay bằng địa chỉ contract sau khi deploy

// State mapping
const STATE_NAMES = ['Thiết lập', 'Đăng ký', 'Bỏ phiếu', 'Kết thúc'];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Đợi một chút để đảm bảo auth.js đã load
    setTimeout(() => {
        checkAuth();
        initializeUI();
        setupEventListeners();
    }, 100);
});

// Kiểm tra xác thực
function checkAuth() {
    try {
        // Kiểm tra xem authModule đã được load chưa
        if (!window.authModule || typeof window.authModule.getCurrentUser !== 'function') {
            console.warn('Auth module chưa sẵn sàng, bỏ qua kiểm tra đăng nhập');
            return;
        }
        
        const currentUser = window.authModule.getCurrentUser();
        
        if (!currentUser) {
            // Chưa đăng nhập, chuyển về trang login
            window.location.href = 'login.html';
            return;
        }
        
        // Hiển thị thông tin user
        const userInfo = document.getElementById('userInfo');
        const userName = document.getElementById('userName');
        const userRoleText = document.getElementById('userRole');
        
        if (userInfo && userName && userRoleText) {
            userInfo.style.display = 'flex';
            userName.textContent = currentUser.fullName;
            userRoleText.textContent = currentUser.role === 'admin' ? '👑 Quản trị viên' : '🎓 ' + currentUser.studentId;
        }
    } catch (error) {
        console.error('Lỗi kiểm tra auth:', error);
    }
}

// Initialize UI
function initializeUI() {
    // Force hide all tabs except voting tab on page load
    const allTabs = ['voting', 'results', 'registration', 'admin'];
    allTabs.forEach(tabId => {
        const tab = document.getElementById(tabId);
        if (tab) {
            if (tabId === 'voting') {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        }
    });
    
    // Hide tabs navigation initially
    document.getElementById('tabs').style.display = 'none';
    
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
        showAlert('Vui lòng cài đặt MetaMask để sử dụng ứng dụng này!', 'error');
        document.getElementById('connectWallet').disabled = true;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Connect wallet
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Bạn có chắc muốn đăng xuất?')) {
                window.authModule.logout();
            }
        });
    }
    
    // Tab navigation
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });
    
    // Voting
    document.getElementById('refreshResults').addEventListener('click', loadResults);
    
    // Registration
    document.getElementById('candidateForm').addEventListener('submit', registerAsCandidate);
    
    // Admin functions
    document.getElementById('registerVoter').addEventListener('click', registerVoter);
    document.getElementById('registerMultipleVoters').addEventListener('click', registerMultipleVoters);
    document.getElementById('addCandidate').addEventListener('click', addCandidateAdmin);
    document.getElementById('startRegistration').addEventListener('click', startRegistration);
    document.getElementById('startVoting').addEventListener('click', startVoting);
    document.getElementById('endElection').addEventListener('click', endElection);
    document.getElementById('resetElection').addEventListener('click', resetElection);
    document.getElementById('addPosition').addEventListener('click', addPosition);
}

// Connect to MetaMask
async function connectWallet() {
    try {
        showLoading();
        
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        
        // Initialize Web3
        web3 = new Web3(window.ethereum);
        
        // Initialize contract
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        
        // Update UI
        document.getElementById('statusText').textContent = 'Đã kết nối';
        document.getElementById('statusText').className = 'status-connected';
        document.getElementById('accountAddress').textContent = formatAddress(userAccount);
        
        // Check if user is admin
        const adminAddress = await contract.methods.admin().call();
        isAdmin = userAccount.toLowerCase() === adminAddress.toLowerCase();
        
        document.getElementById('userRole').textContent = isAdmin ? 'Quản trị viên' : 'Cử tri';
        
        // Show/hide admin features
        if (isAdmin) {
            document.querySelectorAll('.admin-only').forEach(el => el.classList.add('show'));
        }
        
        // Show tabs
        document.getElementById('tabs').style.display = 'flex';
        document.getElementById('connectWallet').style.display = 'none';
        
        // Load data
        await loadElectionData();
        
        // Setup account change listener
        window.ethereum.on('accountsChanged', handleAccountChange);
        
        hideLoading();
        showAlert('Kết nối ví thành công!', 'success');
        
    } catch (error) {
        hideLoading();
        console.error('Error connecting wallet:', error);
        showAlert('Lỗi kết nối ví: ' + error.message, 'error');
    }
}

// Handle account change
async function handleAccountChange(accounts) {
    if (accounts.length === 0) {
        location.reload();
    } else {
        userAccount = accounts[0];
        location.reload();
    }
}

// Load election data
async function loadElectionData() {
    try {
        // Get election state
        const state = await contract.methods.state().call();
        document.getElementById('electionState').textContent = STATE_NAMES[state];
        
        // Get candidate count
        const candidateCount = await contract.methods.candidatesCount().call();
        document.getElementById('candidateCount').textContent = candidateCount;
        
        // Get total votes
        const totalVotes = await contract.methods.getTotalVotes().call();
        document.getElementById('totalVotes').textContent = totalVotes;
        
        // Get voter status
        const voterInfo = await contract.methods.voters(userAccount).call();
        let voterStatus = 'Chưa đăng ký';
        if (voterInfo.isRegistered) {
            voterStatus = voterInfo.hasVoted ? 'Đã bỏ phiếu' : 'Chưa bỏ phiếu';
        }
        const voterStatusEl = document.getElementById('voterStatus');
        voterStatusEl.textContent = voterStatus;
        
        // Add quick register button if not registered and not admin
        if (!voterInfo.isRegistered && !isAdmin && state >= 1 && state < 3) {
            voterStatusEl.innerHTML = `
                <span style="color: #ff9800;">Chưa đăng ký</span>
                <button onclick="quickRegisterSelf()" style="margin-left: 10px; padding: 5px 15px; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.9em;">
                    ⚡ Đăng ký ngay
                </button>
            `;
        }
        
        // Load candidates
        await loadCandidates();
        
    } catch (error) {
        console.error('Error loading election data:', error);
        showAlert('Lỗi tải dữ liệu: ' + error.message, 'error');
    }
}

// Load candidates
async function loadCandidates() {
    try {
        const candidates = await contract.methods.getCandidates().call();
        const candidatesList = document.getElementById('candidatesList');
        
        if (candidates.length === 0) {
            candidatesList.innerHTML = '<p class="empty-state">Chưa có ứng viên nào</p>';
            return;
        }
        
        const state = await contract.methods.state().call();
        const voterInfo = await contract.methods.voters(userAccount).call();
        const canVote = state == 2 && voterInfo.isRegistered && !voterInfo.hasVoted;
        
        candidatesList.innerHTML = candidates.map(candidate => `
            <div class="candidate-card">
                <div class="candidate-header">
                    <div>
                        <div class="candidate-name">${candidate.name}</div>
                        <span class="candidate-position">${candidate.position}</span>
                    </div>
                    <div class="candidate-votes">
                        ${candidate.voteCount} phiếu
                    </div>
                </div>
                ${canVote ? `
                    <button class="btn btn-primary vote-button" onclick="vote(${candidate.id})">
                        Bỏ phiếu cho ứng viên này
                    </button>
                ` : ''}
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading candidates:', error);
    }
}

// Vote for candidate
async function vote(candidateId) {
    try {
        showLoading();
        
        await contract.methods.vote(candidateId).send({ from: userAccount });
        
        hideLoading();
        showAlert('Bỏ phiếu thành công!', 'success');
        
        await loadElectionData();
        
    } catch (error) {
        hideLoading();
        console.error('Error voting:', error);
        showAlert('Lỗi bỏ phiếu: ' + error.message, 'error');
    }
}

// Register as candidate
async function registerAsCandidate(e) {
    e.preventDefault();
    
    try {
        showLoading();
        
        const name = document.getElementById('candidateName').value;
        const position = document.getElementById('candidatePosition').value;
        
        await contract.methods.registerCandidate(name, position).send({ from: userAccount });
        
        hideLoading();
        showAlert('Đăng ký ứng cử thành công!', 'success');
        
        document.getElementById('candidateForm').reset();
        await loadElectionData();
        
    } catch (error) {
        hideLoading();
        console.error('Error registering candidate:', error);
        showAlert('Lỗi đăng ký: ' + error.message, 'error');
    }
}

// Load results
async function loadResults() {
    try {
        showLoading();
        
        const candidates = await contract.methods.getCandidates().call();
        const resultsList = document.getElementById('resultsList');
        
        if (candidates.length === 0) {
            resultsList.innerHTML = '<p class="empty-state">Chưa có kết quả</p>';
            hideLoading();
            return;
        }
        
        // Sort by vote count
        const sortedCandidates = [...candidates].sort((a, b) => b.voteCount - a.voteCount);
        const maxVotes = sortedCandidates[0].voteCount;
        const totalVotes = await contract.methods.getTotalVotes().call();
        
        resultsList.innerHTML = sortedCandidates.map((candidate, index) => {
            const percentage = totalVotes > 0 ? (candidate.voteCount / totalVotes * 100).toFixed(1) : 0;
            const isWinner = index === 0 && candidate.voteCount > 0;
            
            return `
                <div class="result-card">
                    <div class="result-header">
                        <div>
                            <div class="result-name">
                                ${candidate.name}
                                ${isWinner ? '<span class="winner-badge">🏆 Đang dẫn đầu</span>' : ''}
                            </div>
                            <span class="result-position">${candidate.position}</span>
                        </div>
                        <div class="result-votes">
                            ${candidate.voteCount} phiếu
                        </div>
                    </div>
                    <div class="vote-bar">
                        <div class="vote-bar-fill" style="width: ${percentage}%">
                            ${percentage}%
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Update chart
        updateChart(sortedCandidates);
        
        hideLoading();
        
    } catch (error) {
        hideLoading();
        console.error('Error loading results:', error);
        showAlert('Lỗi tải kết quả: ' + error.message, 'error');
    }
}

// Update chart
let resultsChart = null;

function updateChart(candidates) {
    const ctx = document.getElementById('resultsChart').getContext('2d');
    
    if (resultsChart) {
        resultsChart.destroy();
    }
    
    resultsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: candidates.map(c => c.name),
            datasets: [{
                label: 'Số phiếu bầu',
                data: candidates.map(c => c.voteCount),
                backgroundColor: 'rgba(52, 152, 219, 0.6)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Admin functions
async function registerVoter() {
    try {
        showLoading();
        
        const voterAddress = document.getElementById('voterAddress').value;
        
        if (!web3.utils.isAddress(voterAddress)) {
            throw new Error('Địa chỉ ví không hợp lệ');
        }
        
        await contract.methods.registerVoter(voterAddress).send({ from: userAccount });
        
        hideLoading();
        showAlert('Đăng ký cử tri thành công!', 'success');
        
        document.getElementById('voterAddress').value = '';
        
    } catch (error) {
        hideLoading();
        console.error('Error registering voter:', error);
        showAlert('Lỗi đăng ký cử tri: ' + error.message, 'error');
    }
}

async function registerMultipleVoters() {
    try {
        showLoading();
        
        const addresses = document.getElementById('voterAddresses').value
            .split('\n')
            .map(addr => addr.trim())
            .filter(addr => addr.length > 0);
        
        if (addresses.length === 0) {
            throw new Error('Vui lòng nhập ít nhất một địa chỉ');
        }
        
        // Validate addresses
        for (const addr of addresses) {
            if (!web3.utils.isAddress(addr)) {
                throw new Error(`Địa chỉ không hợp lệ: ${addr}`);
            }
        }
        
        await contract.methods.registerVoters(addresses).send({ from: userAccount });
        
        hideLoading();
        showAlert(`Đăng ký thành công ${addresses.length} cử tri!`, 'success');
        
        document.getElementById('voterAddresses').value = '';
        
    } catch (error) {
        hideLoading();
        console.error('Error registering voters:', error);
        showAlert('Lỗi đăng ký cử tri: ' + error.message, 'error');
    }
}

// Quick register self (for voters)
async function quickRegisterSelf() {
    try {
        showLoading();
        
        // Check if admin
        const adminAddress = await contract.methods.admin().call();
        if (userAccount.toLowerCase() === adminAddress.toLowerCase()) {
            throw new Error('Admin không cần đăng ký làm cử tri');
        }
        
        // Register self
        await contract.methods.registerVoter(userAccount).send({ 
            from: userAccount,
            gas: 200000 
        });
        
        hideLoading();
        showAlert('✅ Đăng ký làm cử tri thành công!', 'success');
        
        // Reload data
        await loadElectionData();
        
    } catch (error) {
        hideLoading();
        console.error('Error self-registering:', error);
        
        let errorMsg = 'Lỗi đăng ký: ' + error.message;
        
        // Check specific errors
        if (error.message.includes('Only admin')) {
            errorMsg = '❌ Chỉ admin mới có thể đăng ký cử tri. Vui lòng liên hệ quản trị viên!';
        } else if (error.message.includes('Already registered')) {
            errorMsg = '✅ Bạn đã được đăng ký làm cử tri rồi!';
            await loadElectionData();
        } else if (error.message.includes('Not in registration state')) {
            errorMsg = '❌ Hiện không trong giai đoạn đăng ký cử tri!';
        }
        
        showAlert(errorMsg, 'error');
    }
}

async function addCandidateAdmin() {
    try {
        showLoading();
        
        const name = document.getElementById('adminCandidateName').value;
        const position = document.getElementById('adminCandidatePosition').value;
        
        if (!name) {
            throw new Error('Vui lòng nhập tên ứng viên');
        }
        
        await contract.methods.addCandidate(name, position).send({ from: userAccount });
        
        hideLoading();
        showAlert('Thêm ứng viên thành công!', 'success');
        
        document.getElementById('adminCandidateName').value = '';
        await loadElectionData();
        
    } catch (error) {
        hideLoading();
        console.error('Error adding candidate:', error);
        showAlert('Lỗi thêm ứng viên: ' + error.message, 'error');
    }
}

async function startRegistration() {
    try {
        showLoading();
        
        // Check current state
        const currentState = await contract.methods.state().call();
        console.log('Current state:', currentState);
        
        if (currentState != 0) {
            throw new Error('Chỉ có thể bắt đầu đăng ký khi ở trạng thái Thiết lập (hiện tại: ' + STATE_NAMES[currentState] + ')');
        }
        
        await contract.methods.startRegistration().send({ 
            from: userAccount,
            gas: 300000 
        });
        
        hideLoading();
        showAlert('✅ Đã bắt đầu giai đoạn đăng ký ứng viên!', 'success');
        await loadElectionData();
        
    } catch (error) {
        hideLoading();
        console.error('Error starting registration:', error);
        
        let errorMsg = 'Lỗi bắt đầu đăng ký: ';
        if (error.message.includes('Only admin')) {
            errorMsg += 'Chỉ admin mới có quyền thực hiện!';
        } else if (error.message.includes('trạng thái')) {
            errorMsg = error.message;
        } else {
            errorMsg += error.message;
        }
        
        showAlert(errorMsg, 'error');
    }
}

async function startVoting() {
    try {
        showLoading();
        
        // Check current state
        const currentState = await contract.methods.state().call();
        if (currentState != 1) {
            throw new Error('Chỉ có thể bắt đầu bỏ phiếu khi ở trạng thái Đăng ký (hiện tại: ' + STATE_NAMES[currentState] + ')');
        }
        
        await contract.methods.startVoting().send({ 
            from: userAccount,
            gas: 300000 
        });
        
        hideLoading();
        showAlert('✅ Đã bắt đầu bỏ phiếu!', 'success');
        await loadElectionData();
    } catch (error) {
        hideLoading();
        console.error('Error starting voting:', error);
        showAlert('Lỗi: ' + error.message, 'error');
    }
}

async function endElection() {
    try {
        showLoading();
        await contract.methods.endElection().send({ from: userAccount });
        hideLoading();
        showAlert('Đã kết thúc bầu cử!', 'success');
        await loadElectionData();
    } catch (error) {
        hideLoading();
        console.error('Error ending election:', error);
        showAlert('Lỗi: ' + error.message, 'error');
    }
}

async function resetElection() {
    if (!confirm('Bạn có chắc chắn muốn reset hệ thống? Tất cả dữ liệu sẽ bị xóa!')) {
        return;
    }
    
    try {
        showLoading();
        await contract.methods.resetElection().send({ from: userAccount });
        hideLoading();
        showAlert('Đã reset hệ thống!', 'success');
        await loadElectionData();
    } catch (error) {
        hideLoading();
        console.error('Error resetting election:', error);
        showAlert('Lỗi: ' + error.message, 'error');
    }
}

async function addPosition() {
    try {
        showLoading();
        
        const position = document.getElementById('customPosition').value;
        
        if (!position) {
            throw new Error('Vui lòng nhập tên vị trí');
        }
        
        await contract.methods.addPosition(position).send({ from: userAccount });
        
        hideLoading();
        showAlert('Thêm vị trí thành công!', 'success');
        
        document.getElementById('customPosition').value = '';
        
    } catch (error) {
        hideLoading();
        console.error('Error adding position:', error);
        showAlert('Lỗi: ' + error.message, 'error');
    }
}

// Utility functions
function switchTab(tabName) {
    // Remove active from all tabs
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active from all buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active to selected tab
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Load data for specific tabs
    if (tabName === 'results') {
        loadResults();
    }
}

function formatAddress(address) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    document.querySelector('.container').insertBefore(
        alertDiv,
        document.querySelector('.container').firstChild.nextSibling
    );
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// ================== CONFIG ==================

// Địa chỉ và ABI contract ClassElection
const CONTRACT_ADDRESS = '0x3Ef98db51C49080B3D615f79A64ce798711BA9f4';
const CONTRACT_ABI = [
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

let web3;
let contract;
let userAccount = "";

// ================== CONNECT WALLET ==================
async function connectWallet() {
    if (!window.ethereum) {
        alert("Vui lòng cài MetaMask!");
        return;
    }

    try {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        userAccount = accounts[0];

        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        document.getElementById("wallet-address").innerText = userAccount;

        await renderAdminInfo();
        await renderElectionState();
        await safeLoadCandidates();
        await safeLoadResults();
    } catch (e) {
        alert("Lỗi kết nối ví: " + e.message);
    }
}

// ================== ADMIN CHECK ==================
async function isAdmin() {
    const admin = await contract.methods.admin().call();
    return admin.toLowerCase() === userAccount.toLowerCase();
}

async function renderAdminInfo() {
    const admin = await contract.methods.admin().call();
    document.getElementById("admin-address").innerText = admin;
}

// ================== STATE ==================
async function getElectionState() {
    return parseInt(await contract.methods.state().call());
}

async function renderElectionState() {
    const state = await getElectionState();
    const map = ["Chưa khởi tạo", "Đăng ký ứng viên", "Bầu cử đang mở", "Đã kết thúc"];
    document.getElementById("election-state").innerText = map[state] || "Không xác định";
}

// ================== REGISTER CANDIDATE ==================
async function registerCandidate() {
    const isAdminUser = await isAdmin();
    const state = await getElectionState();
    const name = document.getElementById("candidate-name").value;
    const position = document.getElementById("candidate-position").value;
    console.log("[registerCandidate] isAdmin:", isAdminUser, "state:", state, "name:", name, "position:", position, "account:", userAccount);
    if (!isAdminUser) {
        alert("Chỉ admin mới được đăng ký ứng viên!");
        return;
    }
    if (state !== 1) {
        alert("Chưa tới giai đoạn đăng ký ứng viên!");
        return;
    }
    if (!name || !position) {
        alert("Nhập đầy đủ thông tin!");
        return;
    }
    try {
        await contract.methods.registerCandidate(name, position).send({ from: userAccount });
        alert("Đăng ký ứng viên thành công!");
        await safeLoadCandidates();
    } catch (e) {
        alert("Lỗi: " + e.message + "\n[registerCandidate] isAdmin: " + isAdminUser + ", state: " + state + ", name: " + name + ", position: " + position + ", account: " + userAccount);
    }
}

// ================== LOAD CANDIDATES (SAFE) ==================
async function safeLoadCandidates() {
    const list = document.getElementById("candidate-list");
    list.innerHTML = "";

    try {
        const state = await getElectionState();
        if (state === 0) {
            list.innerText = "Bầu cử chưa khởi tạo";
            return;
        }

        const count = await contract.methods.candidatesCount().call();
        for (let i = 1; i <= count; i++) {
            const c = await contract.methods.getCandidate(i).call();
            if (!c.exists) continue;
            const li = document.createElement("li");
            li.innerText = `${c.name} (${c.position}) - ${c.voteCount} phiếu`;
            li.onclick = () => voteCandidate(c.id);
            list.appendChild(li);
        }
    } catch {
        list.innerText = "Không thể tải ứng viên";
    }
}

// ================== VOTE ==================
async function voteCandidate(id) {
    const state = await getElectionState();
    let voter = null;
    try {
        voter = await contract.methods.voters(userAccount).call();
    } catch {}
    console.log("[voteCandidate] state:", state, "voter:", voter, "candidateId:", id, "account:", userAccount);
    if (state !== 2) {
        alert("Chỉ được bỏ phiếu khi bầu cử đang mở!");
        return;
    }
    if (!voter || !voter.isRegistered) {
        alert("Bạn chưa được đăng ký làm cử tri!");
        return;
    }
    if (voter.hasVoted) {
        alert("Bạn đã bỏ phiếu rồi!");
        return;
    }
    try {
        await contract.methods.vote(id).send({ from: userAccount });
        alert("Bỏ phiếu thành công!");
        await safeLoadResults();
    } catch (e) {
        alert("Lỗi bỏ phiếu: " + e.message + "\n[voteCandidate] state: " + state + ", voter: " + JSON.stringify(voter) + ", candidateId: " + id + ", account: " + userAccount);
    }
}

// ================== RESULTS (SAFE) ==================
async function safeLoadResults() {
    const list = document.getElementById("result-list");
    list.innerHTML = "";

    try {
        const state = await getElectionState();
        if (state !== 3) {
            list.innerText = "Chưa có kết quả";
            try {
                const state = await getElectionState();
                console.log("[safeLoadCandidates] state:", state);
                if (state === 0) {
                    list.innerText = "Bầu cử chưa khởi tạo";
                    return;
                }
                const candidates = await contract.methods.getCandidates().call();
                console.log("[safeLoadCandidates] candidates:", candidates);
                candidates.forEach(c => {
                    if (!c.exists) return;
                    const li = document.createElement("li");
                    li.innerText = `${c.name} (${c.position}) - ${c.voteCount} phiếu`;
                    li.onclick = () => voteCandidate(c.id);
                    list.appendChild(li);
                });
            } catch (err) {
                console.log("[safeLoadCandidates] error:", err);
                list.innerText = "Không thể tải ứng viên";
            }
window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('connectWallet')) {
        document.getElementById('connectWallet').onclick = connectWallet;
    }
    if (document.getElementById('registerCandidateBtn')) {
        document.getElementById('registerCandidateBtn').onclick = registerCandidateForm;
    }
    if (document.getElementById('refreshResults')) {
        document.getElementById('refreshResults').onclick = loadResults;
    }
    // Tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
});

// Kết nối ví và contract
async function connectWallet() {
    if (!window.ethereum) {
        alert('Vui lòng cài MetaMask!');
        return;
    }
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await web3.eth.getAccounts();
    userAccount = accounts[0];
    contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    document.getElementById('accountAddress').innerText = userAccount;
    document.getElementById('statusText').innerText = 'Đã kết nối';
    await loadElectionData();
}

// Đăng ký ứng viên từ form
async function registerCandidateForm(e) {
    if (e) e.preventDefault();
    const name = document.getElementById('candidateName').value.trim();
    const position = document.getElementById('candidatePosition').value;
    if (!name || !position) return alert('Nhập đầy đủ thông tin!');
    try {
        await contract.methods.registerCandidate(name, position).send({ from: userAccount });
        alert('Đăng ký thành công!');
        await loadElectionData();
    } catch (err) {
        alert('Lỗi: ' + err.message);
    }
}

// Bỏ phiếu
async function voteForCandidate(id) {
    try {
        await contract.methods.vote(id).send({ from: userAccount });
        alert('Bỏ phiếu thành công!');
        await loadElectionData();
    } catch (err) {
        alert('Lỗi bỏ phiếu: ' + err.message);
    }
}

// Load dữ liệu bầu cử
async function loadElectionData() {
    if (!contract || !userAccount) return;
    // Trạng thái
    const state = await contract.methods.state().call();
    const stateNames = ['Thiết lập', 'Đăng ký ứng viên', 'Đang bỏ phiếu', 'Đã kết thúc'];
    document.getElementById('electionState').innerText = stateNames[state] || '-';
    // Ứng viên
    const candidates = await contract.methods.getCandidates().call();
    document.getElementById('candidateCount').innerText = candidates.length;
    // Tổng phiếu
    const totalVotes = await contract.methods.getTotalVotes().call();
    document.getElementById('totalVotes').innerText = totalVotes;
    // Trạng thái cử tri
    let voterStatus = '-';
    try {
        const voter = await contract.methods.voters(userAccount).call();
        if (!voter.isRegistered) voterStatus = 'Chưa đăng ký';
        else if (voter.hasVoted) voterStatus = 'Đã bỏ phiếu';
        else voterStatus = 'Có thể bỏ phiếu';
    } catch {}
    document.getElementById('voterStatus').innerText = voterStatus;
    await loadCandidates();
    await loadResults();
}

// Hiển thị danh sách ứng viên
async function loadCandidates() {
    const candidates = await contract.methods.getCandidates().call();
    const div = document.getElementById('candidatesList');
    if (!div) return;
    if (candidates.length === 0) {
        div.innerHTML = '<p class="empty-state">Chưa có ứng viên nào</p>';
        return;
    }
    const voter = await contract.methods.voters(userAccount).call();
    const canVote = voter.isRegistered && !voter.hasVoted;
    div.innerHTML = candidates.map(c =>
        `<div class="candidate-card">
            <h3>${c.name}</h3>
            <p class="candidate-position">${c.position}</p>
            <p class="candidate-votes">${c.voteCount} phiếu</p>
            ${canVote ? `<button onclick="voteForCandidate(${c.id})" class="btn btn-primary">Bầu cho ứng viên này</button>` : ''}
        </div>`
    ).join('');
}

// Hiển thị kết quả
async function loadResults() {
    const div = document.getElementById('resultsList');
    if (!div) return;
    const count = await contract.methods.candidatesCount().call();
    let results = [];
    for (let i = 1; i <= count; i++) {
        const c = await contract.methods.getCandidate(i).call();
        if (c.exists) results.push(c);
    }
    if (results.length === 0) {
        div.innerHTML = '<p class="empty-state">Chưa có kết quả</p>';
        return;
    }
    const sorted = [...results].sort((a, b) => Number(b.voteCount) - Number(a.voteCount));
    div.innerHTML = sorted.map((c, i) =>
        `<div class="result-card ${i === 0 ? 'winner' : ''}">
            <div class="result-rank">#${i + 1}</div>
            <div class="result-info"><h3>${c.name}</h3><p>${c.position}</p></div>
            <div class="result-votes"><span class="vote-count">${c.voteCount}</span> <span class="vote-label">phiếu</span></div>
        </div>`
    ).join('');
}

// Chuyển tab
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
        tab.style.display = 'none';
    });
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    const targetTab = document.getElementById(tabName);
    const targetBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (targetTab) {
        targetTab.classList.add('active');
        targetTab.style.display = 'block';
    }
    if (targetBtn) targetBtn.classList.add('active');
    if (tabName === 'results') loadResults();
    else if (tabName === 'voting') loadElectionData();
}
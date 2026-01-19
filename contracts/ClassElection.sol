    event ElectionReset();
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ClassElection {
    // Cấu trúc ứng viên
    struct Candidate {
        uint id;
        string name;
        string position; // Vị trí: Lớp trưởng, Lớp phó, Bí thư, etc.
        uint voteCount;
        bool exists;
    }
    
    // Cấu trúc cử tri
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedCandidateId;
        bool canRegisterCandidates;
    }
    
    // Admin của cuộc bầu cử
    address public admin;
    
    // Trạng thái bầu cử
    enum ElectionState { Setup, Registration, Voting, Ended }
    ElectionState public state;
    
    // Danh sách ứng viên
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;
    
    // Danh sách cử tri
    mapping(address => Voter) public voters;
    
    // Quy định chọn ban cán sự thủ công
    string[] public positions;
    
    // Events
    event CandidateRegistered(uint candidateId, string name, string position);
    event VoterRegistered(address voter);
    event Voted(address voter, uint candidateId);
    event ElectionStateChanged(ElectionState newState);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Chi admin moi co quyen thuc hien");
        _;
    }
    
    modifier inState(ElectionState _state) {
        require(state == _state, "Khong dung trang thai bau cu");
        _;
    }
    
    constructor() {
        admin = msg.sender;
        state = ElectionState.Setup;
        
        // Khởi tạo các vị trí ban cán sự
        positions.push("Lop truong");
        positions.push("Lop pho");
        positions.push("Bi thu");
        positions.push("Uyen van");
        positions.push("Hoc van");
    }
    
    // Admin thiết lập các vị trí tùy chỉnh
    function addPosition(string memory _position) public onlyAdmin inState(ElectionState.Setup) {
        positions.push(_position);
    }
    
    // Đăng ký cử tri
    function registerVoter(address _voter) public onlyAdmin {
        require(state == ElectionState.Setup || state == ElectionState.Registration, "Khong the dang ky cu tri o trang thai nay");
        require(!voters[_voter].isRegistered, "Cu tri da duoc dang ky");
        voters[_voter].isRegistered = true;
        voters[_voter].canRegisterCandidates = true;
        emit VoterRegistered(_voter);
    }
    
    // Đăng ký nhiều cử tri cùng lúc
    function registerVoters(address[] memory _voters) public onlyAdmin {
        require(state == ElectionState.Setup || state == ElectionState.Registration, "Khong the dang ky cu tri o trang thai nay");
        for (uint i = 0; i < _voters.length; i++) {
            if (!voters[_voters[i]].isRegistered) {
                voters[_voters[i]].isRegistered = true;
                voters[_voters[i]].canRegisterCandidates = true;
                emit VoterRegistered(_voters[i]);
            }
        }
    }
    
    // Chuyển sang giai đoạn đăng ký ứng viên
    function startRegistration() public onlyAdmin inState(ElectionState.Setup) {
        state = ElectionState.Registration;
        emit ElectionStateChanged(state);
    }
    
    // Đăng ký ứng viên (tự đăng ký)
    function registerCandidate(string memory _name, string memory _position) public inState(ElectionState.Registration) {
        require(voters[msg.sender].isRegistered, "Ban chua duoc dang ky lam cu tri");
        require(voters[msg.sender].canRegisterCandidates, "Ban khong co quyen dang ky ung vien");
        
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _position, 0, true);
        emit CandidateRegistered(candidatesCount, _name, _position);
    }
    
    // Admin thêm ứng viên thủ công
    function addCandidate(string memory _name, string memory _position) public onlyAdmin {
        require(state == ElectionState.Registration || state == ElectionState.Setup, "Khong the them ung vien");
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _position, 0, true);
        emit CandidateRegistered(candidatesCount, _name, _position);
    }
    
    // Bắt đầu bỏ phiếu
    function startVoting() public onlyAdmin inState(ElectionState.Registration) {
        require(candidatesCount > 0, "Phai co it nhat 1 ung vien");
        state = ElectionState.Voting;
        emit ElectionStateChanged(state);
    }
    
    // Bỏ phiếu (giơ tay phát phiếu)
    function vote(uint _candidateId) public inState(ElectionState.Voting) {
        require(voters[msg.sender].isRegistered, "Ban chua duoc dang ky");
        require(!voters[msg.sender].hasVoted, "Ban da binh chon roi");
        require(candidates[_candidateId].exists, "Ung vien khong ton tai");
        
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedCandidateId = _candidateId;
        candidates[_candidateId].voteCount++;
        
        emit Voted(msg.sender, _candidateId);
    }
    
    // Kết thúc bầu cử
    function endElection() public onlyAdmin inState(ElectionState.Voting) {
        state = ElectionState.Ended;
        emit ElectionStateChanged(state);
    }
    
    // Lấy danh sách ứng viên
    // Lưu ý: Trả về mảng lớn sẽ tốn gas nếu gọi từ contract khác. Nên dùng off-chain hoặc lấy từng phần tử.
    function getCandidate(uint id) public view returns (Candidate memory) {
        require(candidates[id].exists, "Ung vien khong ton tai");
        return candidates[id];
    }
    // Nếu cần tất cả ứng viên, nên dùng event CandidateRegistered để lấy off-chain.
    
    // Lấy kết quả bầu cử
    function getResults(uint id) public view returns (Candidate memory) {
        require(state == ElectionState.Ended, "Bau cu chua ket thuc");
        return getCandidate(id);
    }
    
    // Lấy số lượng vị trí
    function getPositionsCount() public view returns (uint) {
        return positions.length;
    }
    
    // Lấy vị trí theo index
    function getPosition(uint index) public view returns (string memory) {
        require(index < positions.length, "Index khong hop le");
        return positions[index];
    }
    
    // Kiểm tra trạng thái bỏ phiếu của cử tri
    function hasVoted() public view returns (bool) {
        return voters[msg.sender].hasVoted;
    }
    
    // Đếm tổng số phiếu bầu
    // Lưu ý: Hàm này sẽ tốn gas nếu số lượng ứng viên lớn. Nên lấy từng ứng viên hoặc dùng event CandidateRegistered để tổng hợp off-chain.
    function getTotalVotes() public view returns (uint) {
        uint total = 0;
        for (uint i = 1; i <= candidatesCount; i++) {
            total += candidates[i].voteCount;
        }
        return total;
    }
    
    // Reset hệ thống (chỉ khi kết thúc)
    function resetElection() public onlyAdmin inState(ElectionState.Ended) {
        // Xóa ứng viên
        for (uint i = 1; i <= candidatesCount; i++) {
            delete candidates[i];
        }
        candidatesCount = 0;
        // Không reset trạng thái cử tri trên chain nữa để tiết kiệm gas
        // Có thể dùng version election hoặc deploy contract mới cho mỗi kỳ bầu cử
        state = ElectionState.Setup;
        emit ElectionStateChanged(state);
        emit ElectionReset();
    }
}

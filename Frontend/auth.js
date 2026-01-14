// Lưu trữ người dùng (trong thực tế nên dùng database)
const STORAGE_KEY = 'voting_users';
const SESSION_KEY = 'current_user';

// Khởi tạo
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    setupEventListeners();
    
    // Kiểm tra nếu đã đăng nhập
    const currentUser = getCurrentUser();
    if (currentUser) {
        window.location.href = 'index.html';
    }
});

// Khởi tạo hệ thống xác thực
function initializeAuth() {
    // Tạo dữ liệu mẫu nếu chưa có
    if (!localStorage.getItem(STORAGE_KEY)) {
        const sampleUsers = [
            {
                id: 1,
                username: 'admin',
                password: 'admin123',
                fullName: 'Quản trị viên',
                studentId: 'ADMIN001',
                role: 'admin',
                walletAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
            },
            {
                id: 2,
                username: 'student1',
                password: '123456',
                fullName: 'Nguyễn Văn A',
                studentId: 'SV001',
                role: 'student',
                walletAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
            },
            {
                id: 3,
                username: 'student2',
                password: '123456',
                fullName: 'Nguyễn Văn B',
                studentId: 'SV002',
                role: 'student',
                walletAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
            }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleUsers));
    }
}

// Thiết lập sự kiện
function setupEventListeners() {
    // Chuyển đổi giữa đăng nhập và đăng ký
    document.getElementById('switchToRegister').addEventListener('click', function(e) {
        e.preventDefault();
        switchForm('register');
    });
    
    document.getElementById('switchToLogin').addEventListener('click', function(e) {
        e.preventDefault();
        switchForm('login');
    });
    
    // Xử lý đăng nhập
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    
    // Xử lý đăng ký
    document.getElementById('registerFormElement').addEventListener('submit', handleRegister);
}

// Chuyển đổi form
function switchForm(formType) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (formType === 'register') {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    } else {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    }
}

// Xử lý đăng nhập
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validation
    if (!username || !password) {
        showToast('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }
    
    // Hiển thị loading
    const submitBtn = e.target.querySelector('.btn-login');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Giả lập độ trễ API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Kiểm tra thông tin đăng nhập
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Lưu thông tin người dùng
        const userSession = {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            studentId: user.studentId,
            role: user.role,
            loginTime: new Date().toISOString()
        };
        
        if (rememberMe) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(userSession));
        } else {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(userSession));
        }
        
        showToast('Đăng nhập thành công! Đang chuyển hướng...', 'success');
        
        // Chuyển hướng sau 1.5 giây
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        showToast('Tên đăng nhập hoặc mật khẩu không đúng!', 'error');
    }
}

// Xử lý đăng ký
async function handleRegister(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('registerFullName').value.trim();
    const username = document.getElementById('registerUsername').value.trim();
    const studentId = document.getElementById('registerStudentId').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validation
    if (!fullName || !username || !studentId || !password || !confirmPassword) {
        showToast('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Mật khẩu phải có ít nhất 6 ký tự!', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Mật khẩu xác nhận không khớp!', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showToast('Vui lòng đồng ý với điều khoản sử dụng!', 'error');
        return;
    }
    
    // Hiển thị loading
    const submitBtn = e.target.querySelector('.btn-register');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Giả lập độ trễ API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Kiểm tra username đã tồn tại
    const users = getUsers();
    const existingUser = users.find(u => u.username === username);
    
    if (existingUser) {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        showToast('Tên đăng nhập đã tồn tại!', 'error');
        return;
    }
    
    // Kiểm tra mã sinh viên đã tồn tại
    const existingStudentId = users.find(u => u.studentId === studentId);
    if (existingStudentId) {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        showToast('Mã sinh viên đã được đăng ký!', 'error');
        return;
    }
    
    // Tạo user mới
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        username,
        password,
        fullName,
        studentId,
        role: 'student',
        createdAt: new Date().toISOString()
    };
    
    // Lưu user
    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    
    showToast('Đăng ký thành công! Đang chuyển sang đăng nhập...', 'success');
    
    // Chuyển sang form đăng nhập và điền sẵn username
    setTimeout(() => {
        switchForm('login');
        document.getElementById('loginUsername').value = username;
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        e.target.reset();
    }, 1500);
}

// Lấy danh sách users
function getUsers() {
    const usersJson = localStorage.getItem(STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
}

// Lấy user hiện tại
function getCurrentUser() {
    let userJson = sessionStorage.getItem(SESSION_KEY);
    if (!userJson) {
        userJson = localStorage.getItem(SESSION_KEY);
    }
    return userJson ? JSON.parse(userJson) : null;
}

// Đăng xuất
function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
}

// Hiển thị thông báo
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');
    
    // Đặt nội dung
    toastMessage.textContent = message;
    
    // Đặt icon và class
    if (type === 'success') {
        toastIcon.textContent = '✓';
        toast.classList.remove('error');
        toast.classList.add('success');
    } else {
        toastIcon.textContent = '✕';
        toast.classList.remove('success');
        toast.classList.add('error');
    }
    
    // Hiển thị toast
    toast.classList.add('show');
    
    // Ẩn sau 3 giây
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Export functions để sử dụng trong trang khác
if (typeof window !== 'undefined') {
    window.authModule = {
        getCurrentUser,
        logout,
        getUsers
    };
}

// API Configuration
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api'
    : `http://${window.location.hostname}:5000/api`;

// Khởi tạo
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    
    // Kiểm tra nếu đã đăng nhập
    const currentUser = getCurrentUser();
    if (currentUser) {
        window.location.href = 'index.html';
    }
});

// Thiết lập sự kiện
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Chuyển đổi giữa đăng nhập và đăng ký
    const switchToRegisterBtn = document.getElementById('switchToRegister');
    const switchToLoginBtn = document.getElementById('switchToLogin');
    
    console.log('switchToRegister button:', switchToRegisterBtn);
    console.log('switchToLogin button:', switchToLoginBtn);
    
    if (switchToRegisterBtn) {
        switchToRegisterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Switching to register form...');
            switchForm('register');
        });
    }
    
    if (switchToLoginBtn) {
        switchToLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Switching to login form...');
            switchForm('login');
        });
    }
    
    // Submit form đăng nhập
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Submit form đăng ký
    const registerForm = document.getElementById('registerFormElement');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// Đăng nhập
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        showMessage('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Lưu token và thông tin user
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('current_user', JSON.stringify(data.user));
            
            showMessage('Đăng nhập thành công!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showMessage(data.message || 'Sai tên đăng nhập hoặc mật khẩu!', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Lỗi kết nối server! Vui lòng kiểm tra backend đang chạy.', 'error');
    }
}

// Đăng ký
async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const fullName = document.getElementById('registerFullName').value.trim();
    const studentId = document.getElementById('registerStudentId').value.trim();
    
    if (!username || !password || !fullName || !studentId) {
        showMessage('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Mật khẩu xác nhận không khớp!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Mật khẩu phải có ít nhất 6 ký tự!', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                username, 
                password, 
                fullName, 
                studentId
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Lưu token và thông tin user
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('current_user', JSON.stringify(data.user));
            
            showMessage('Đăng ký thành công!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showMessage(data.message || 'Đăng ký thất bại!', 'error');
        }
    } catch (error) {
        console.error('Register error:', error);
        showMessage('Lỗi kết nối server! Vui lòng kiểm tra backend đang chạy.', 'error');
    }
}

// Lấy thông tin user hiện tại
function getCurrentUser() {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
}

// Đăng xuất
function logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    sessionStorage.clear();
    window.location.href = 'login.html';
}

// Chuyển đổi form
function switchForm(formType) {
    console.log('switchForm called with type:', formType);
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    console.log('loginForm:', loginForm);
    console.log('registerForm:', registerForm);
    
    if (formType === 'register') {
        if (loginForm) loginForm.classList.add('hidden');
        if (registerForm) registerForm.classList.remove('hidden');
        console.log('Switched to register form');
    } else {
        if (loginForm) loginForm.classList.remove('hidden');
        if (registerForm) registerForm.classList.add('hidden');
        console.log('Switched to login form');
    }
}

// Hiển thị thông báo
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getCurrentUser, logout };
}

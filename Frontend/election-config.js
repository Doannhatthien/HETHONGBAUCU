// election-config.js - Quản lý cấu hình chế độ bầu cử

let currentUser = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Check if admin
    if (currentUser.role !== 'admin') {
        alert('⚠️ Chỉ admin mới có quyền truy cập trang này!');
        window.location.href = 'index.html';
        return;
    }
    
    displayUserInfo();
    loadCurrentConfig();
    setupEventListeners();
});

// Display user info
function displayUserInfo() {
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    
    if (currentUser) {
        userInfo.style.display = 'flex';
        userName.textContent = currentUser.username;
        userRole.textContent = 'Quản trị viên';
    }
}

// Load current configuration
function loadCurrentConfig() {
    const config = JSON.parse(localStorage.getItem('election_config') || '{}');
    
    // Set default if not exists
    if (!config.mode) {
        config.mode = 'public';
        config.password = generateRandomPassword();
        localStorage.setItem('election_config', JSON.stringify(config));
    }
    
    updateUI(config);
}

// Setup event listeners
function setupEventListeners() {
    const logoutBtn = document.getElementById('logoutBtn');
    const activatePublicBtn = document.getElementById('activatePublicBtn');
    const activatePrivateBtn = document.getElementById('activatePrivateBtn');
    const copyPasswordBtn = document.getElementById('copyPasswordBtn');
    const regeneratePasswordBtn = document.getElementById('regeneratePasswordBtn');
    
    logoutBtn.addEventListener('click', logout);
    activatePublicBtn.addEventListener('click', activatePublicMode);
    activatePrivateBtn.addEventListener('click', activatePrivateMode);
    copyPasswordBtn.addEventListener('click', copyPassword);
    regeneratePasswordBtn.addEventListener('click', regeneratePassword);
}

// Update UI based on current mode
function updateUI(config) {
    const publicCard = document.getElementById('publicModeCard');
    const privateCard = document.getElementById('privateModeCard');
    const publicStatus = document.getElementById('publicStatus');
    const privateStatus = document.getElementById('privateStatus');
    const publicBtn = document.getElementById('activatePublicBtn');
    const privateBtn = document.getElementById('activatePrivateBtn');
    const passwordDisplay = document.getElementById('passwordDisplay');
    const passwordSection = document.querySelector('.password-section');
    
    if (config.mode === 'public') {
        // Public mode active
        publicCard.classList.add('active');
        privateCard.classList.remove('active');
        publicStatus.innerHTML = '<span class="status-badge active">✓ Đang hoạt động</span>';
        privateStatus.innerHTML = '<span class="status-badge inactive">○ Không hoạt động</span>';
        publicBtn.disabled = true;
        publicBtn.textContent = '✓ Đang kích hoạt';
        privateBtn.disabled = false;
        privateBtn.textContent = '🔒 Kích hoạt chế độ này';
        passwordSection.style.display = 'none';
    } else {
        // Private mode active
        publicCard.classList.remove('active');
        privateCard.classList.add('active');
        publicStatus.innerHTML = '<span class="status-badge inactive">○ Không hoạt động</span>';
        privateStatus.innerHTML = '<span class="status-badge active">✓ Đang hoạt động</span>';
        publicBtn.disabled = false;
        publicBtn.textContent = '🌐 Kích hoạt chế độ này';
        privateBtn.disabled = true;
        privateBtn.textContent = '✓ Đang kích hoạt';
        passwordSection.style.display = 'block';
        passwordDisplay.textContent = config.password;
    }
}

// Activate public mode
function activatePublicMode() {
    if (!confirm('Bạn có chắc chắn muốn chuyển sang chế độ Bầu cử Công khai?\n\nMọi người sẽ có thể bỏ phiếu mà không cần mật khẩu.')) {
        return;
    }
    
    const config = JSON.parse(localStorage.getItem('election_config') || '{}');
    config.mode = 'public';
    localStorage.setItem('election_config', JSON.stringify(config));
    
    updateUI(config);
    showNotification('✅ Đã chuyển sang chế độ Bầu cử Công khai!');
}

// Activate private mode
function activatePrivateMode() {
    if (!confirm('Bạn có chắc chắn muốn chuyển sang chế độ Bầu cử Khép kín?\n\nNgười dùng sẽ cần mật khẩu để bỏ phiếu.')) {
        return;
    }
    
    const config = JSON.parse(localStorage.getItem('election_config') || '{}');
    config.mode = 'private';
    localStorage.setItem('election_config', JSON.stringify(config));
    
    updateUI(config);
    showNotification('🔒 Đã chuyển sang chế độ Bầu cử Khép kín!');
}

// Generate random password
function generateRandomPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude similar characters
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Regenerate password
function regeneratePassword() {
    if (!confirm('Bạn có chắc chắn muốn tạo mật khẩu mới?\n\nMật khẩu cũ sẽ không còn hiệu lực.')) {
        return;
    }
    
    const config = JSON.parse(localStorage.getItem('election_config') || '{}');
    config.password = generateRandomPassword();
    localStorage.setItem('election_config', JSON.stringify(config));
    
    document.getElementById('passwordDisplay').textContent = config.password;
    showNotification('✅ Đã tạo mật khẩu mới thành công!');
}

// Copy password to clipboard
function copyPassword() {
    const passwordDisplay = document.getElementById('passwordDisplay');
    const password = passwordDisplay.textContent;
    
    // Create temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = password;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    
    // Select and copy
    textarea.select();
    textarea.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand('copy');
        showNotification('✅ Đã sao chép mật khẩu vào clipboard!');
        
        // Visual feedback
        const copyBtn = document.getElementById('copyPasswordBtn');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✓ Đã sao chép';
        copyBtn.style.background = 'var(--secondary-color)';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '';
        }, 2000);
    } catch (err) {
        showNotification('❌ Không thể sao chép. Vui lòng copy thủ công.', true);
    }
    
    // Remove temporary textarea
    document.body.removeChild(textarea);
}

// Show notification
function showNotification(message, isError = false) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${isError ? 'var(--danger-color)' : 'var(--secondary-color)'};
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        font-size: 1.1em;
        font-weight: bold;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

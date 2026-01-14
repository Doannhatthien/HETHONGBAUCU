# Web Bầu Cử Lớp - Blockchain

Hệ thống bầu cử trực tuyến dựa trên công nghệ Blockchain, đảm bảo tính minh bạch và bảo mật.

## 📁 Cấu trúc Project

Project được tổ chức theo các nhánh chuyên biệt:

### 🎨 Nhánh `Frontend`
Chứa toàn bộ giao diện người dùng và các tính năng bầu cử:
- **Hệ thống đăng nhập/đăng ký** với xác thực người dùng
- **Bầu cử công khai** - Mọi người có thể tham gia
- **Bầu cử khép kín** - Yêu cầu mật khẩu (chỉ admin quản lý)
- **Trang cấu hình admin** - Quản lý chế độ bầu cử
- **Auto-start server** - Tự động chạy khi khởi động máy

📂 Chi tiết: `contracts/Frontend/`

### ⚙️ Nhánh `backend`
Chứa Smart Contract và logic Blockchain:
- Smart Contract viết bằng Solidity
- Cấu hình Hardhat
- Scripts deploy và test
- ABI và artifacts

📂 Chi tiết: `contracts/`, `scripts/`, `test/`

### 🌿 Nhánh `main`
Nhánh chính chỉ chứa cấu trúc cơ bản và tài liệu hướng dẫn.

## 🚀 Hướng dẫn sử dụng

### Clone repository:
```bash
git clone https://github.com/Doannhatthien/Web_bau_cu.git
cd Web_bau_cu
```

### Làm việc với Frontend:
```bash
git checkout Frontend
cd contracts/Frontend
npm install
```

### Chạy web server:
```bash
# Windows
cd contracts/connect
RUN-WEB.bat
```

### Làm việc với Backend:
```bash
git checkout backend
npm install
npx hardhat compile
npx hardhat test
```

## 🔧 Công nghệ sử dụng

- **Frontend**: HTML5, CSS3, JavaScript
- **Blockchain**: Solidity, Hardhat, Ethers.js
- **Server**: Node.js, http-server
- **Version Control**: Git, GitHub

## 👥 Tính năng chính

### 🔐 Xác thực & Bảo mật
- Hệ thống đăng nhập/đăng ký
- Phân quyền Admin/User
- Lưu trữ session an toàn với localStorage

### 🗳️ Chế độ bầu cử
1. **Công khai**: Mọi người tự do tham gia
2. **Khép kín**: Cần mật khẩu do admin cấp

### 📊 Quản lý
- Đăng ký ứng viên
- Theo dõi kết quả real-time
- Thống kê số phiếu bầu
- Quản lý trạng thái bầu cử (Admin)

## 📱 Truy cập hệ thống

- **Local**: http://localhost:8000/login.html
- **Network**: http://[YOUR_IP]:8000/login.html

## 👤 Tài khoản mặc định

**Admin:**
- Username: `admin`
- Password: `admin123`

**Student:**
- Username: `student1`
- Password: `123456`

## 📝 License

© 2025 - Hệ Thống Bầu Cử Lớp Blockchain

---

**Lưu ý**: Để làm việc với các tính năng cụ thể, vui lòng checkout sang nhánh tương ứng (Frontend hoặc backend).

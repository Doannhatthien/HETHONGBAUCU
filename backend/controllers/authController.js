const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });

const sendUserResponse = (user, statusCode, res, token) => {
    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            studentId: user.studentId,
            walletAddress: user.walletAddress,
            role: user.role,
            hasVoted: user.hasVoted
        }
    });
};

// Đăng ký user mới
exports.register = async (req, res, next) => {
    try {
        const { username, password, fullName, studentId, walletAddress } = req.body;

        // Kiểm tra user đã tồn tại
        const existing = await User.findOne({ 
            $or: [{ username }, { studentId }] 
        });

        if (existing) {
            return res.status(400).json({ 
                success: false, 
                message: 'Tên đăng nhập hoặc mã sinh viên đã tồn tại' 
            });
        }

        // Tự động tạo wallet address nếu không có
        let finalWalletAddress = walletAddress;
        if (!finalWalletAddress) {
            // Tạo wallet address ngẫu nhiên (trong thực tế nên dùng Web3)
            const randomWallet = '0x' + Math.random().toString(16).substring(2, 42).padEnd(40, '0');
            finalWalletAddress = randomWallet;
        }

        // Kiểm tra nếu là admin
        const isAdmin = finalWalletAddress.toLowerCase() === (process.env.ADMIN_ADDRESS || '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266').toLowerCase();
        
        const user = await User.create({
            username, 
            password, 
            fullName, 
            studentId,
            walletAddress: finalWalletAddress.toLowerCase(),
            role: isAdmin ? 'admin' : 'student'
        });

        sendUserResponse(user, 201, res, generateToken(user._id));
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Đăng nhập
exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Please provide username and password' });
        }

        const user = await User.findOne({ username }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        sendUserResponse(user, 200, res, generateToken(user._id));
    } catch (error) {
        next(error);
    }
};

exports.walletLogin = async (req, res, next) => {
    try {
        const { walletAddress } = req.body;

        if (!walletAddress) {
            return res.status(400).json({ success: false, message: 'Provide wallet address' });
        }

        const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found. Register first.' });
        }

        sendUserResponse(user, 200, res, generateToken(user._id));
    } catch (error) {
        next(error);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json({ 
            success: true, 
            count: users.length,
            data: users 
        });
    } catch (error) {
        next(error);
    }
};

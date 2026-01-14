require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/error');

const app = express();

// Connect Database
connectDB().catch(err => console.log('MongoDB connection error:', err.message));

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors({ 
    origin: true, // Cho phép tất cả origins trong development
    credentials: true 
}));
app.use(morgan('dev'));
app.use('/api/', rateLimit({ windowMs: 10 * 60 * 1000, max: 100 }));

// Routes
try {
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/candidates', require('./routes/candidates'));
    app.use('/api/votes', require('./routes/votes'));
    app.use('/api/election', require('./routes/election'));
    console.log('✓ Routes loaded successfully');
} catch (error) {
    console.error('Error loading routes:', error.message);
}

// Health & Root
app.get('/health', (req, res) => res.json({ success: true, message: 'Server running' }));
app.get('/', (req, res) => res.json({ success: true, version: '1.0.0', endpoints: { auth: '/api/auth', candidates: '/api/candidates', votes: '/api/votes', election: '/api/election' } }));

// Error Handlers
app.use(errorHandler);
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on:`);
    console.log(`   - Local:   http://localhost:${PORT}`);
    console.log(`   - Network: http://172.20.10.7:${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.log(`❌ Error: ${err.message}`);
    server.close(() => process.exit(1));
});

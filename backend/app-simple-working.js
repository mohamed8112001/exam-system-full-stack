const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Basic middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Exam System API is running',
    version: '1.0.0',
    status: 'OK',
    endpoints: {
      auth: '/api/auth',
      exams: '/api/exams',
      submissions: '/api/submissions'
    }
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Import and use routes with error handling
try {
  console.log('Loading routes...');
  
  const authRoutes = require('./routes/authRoutes');
  const examRoutes = require('./routes/examRoutes');
  const submissionRoutes = require('./routes/submissionRoutes');

  app.use('/api/auth', authRoutes);
  app.use('/api/exams', examRoutes);
  app.use('/api/submissions', submissionRoutes);
  
  console.log('✅ Routes loaded successfully');
} catch (routeError) {
  console.error('❌ Error loading routes:', routeError.message);
  console.log('🔄 Server will continue with basic routes only...');
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(err.statusCode || 500).json({ 
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Connect to MongoDB
console.log('🔄 Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exam-system')
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('🔄 Server will continue without database...');
  });

// Start server
const server = app.listen(PORT, () => {
  console.log('\n🎉 EXAM SYSTEM SERVER STARTED');
  console.log('================================');
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`📊 Status: http://localhost:${PORT}/api/test`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log(`📝 Exams: http://localhost:${PORT}/api/exams`);
  console.log(`📋 Submissions: http://localhost:${PORT}/api/submissions`);
  console.log('================================');
  console.log('✅ Ready for testing!\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('\n🔄 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

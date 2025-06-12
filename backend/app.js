// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const compression = require('compression');

// // Import routes with error handling
// let authRoutes, examRoutes, submissionRoutes, errorHandler;

// try {
//   authRoutes = require('./routes/authRoutes');
//   examRoutes = require('./routes/examRoutes');
//   submissionRoutes = require('./routes/submissionRoutes');
//   errorHandler = require('./middleware/errorHandler');
//   console.log('All modules loaded successfully');
// } catch (moduleError) {
//   console.error(' Error loading modules:', moduleError.message);
//   console.log(' Server will continue with basic functionality...');
// }

// // Load environment variables
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Security middleware
// app.use(helmet());
// app.use(compression());

// // Logging
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// // Rate limiting - Temporarily disabled for testing
// // app.use('/api/', apiLimiter);
// // app.use('/api/auth', authLimiter);
// // app.use('/api/submissions', submissionLimiter);
// console.log('⚠️ Rate limiting temporarily disabled for testing');

// // CORS - Allow all origins for development
// app.use(cors({
//   origin: true,
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//   preflightContinue: false,
//   optionsSuccessStatus: 200
// }));

// // Body parsing
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Root route
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Exam System API is running',
//     endpoints: {
//       auth: '/api/auth',
//       exams: '/api/exams',
//       submissions: '/api/submissions'
//     }
//   });
// });

// // Debug route to test server
// app.get('/api/test', (req, res) => {
//   res.json({ message: 'API is working' });
// });

// // Test CORS endpoint
// app.post('/api/test-cors', (req, res) => {
//   res.json({
//     message: 'CORS is working',
//     body: req.body,
//     headers: req.headers
//   });
// });

// // Handle preflight requests
// app.options('*', cors());

// // Routes (with error handling)
// if (authRoutes) app.use('/api/auth', authRoutes);
// if (examRoutes) app.use('/api/exams', examRoutes);
// if (submissionRoutes) app.use('/api/submissions', submissionRoutes);

// // 404 handler
// app.use((req, res, next) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route not found'
//   });
// });

// // Global error handler
// if (errorHandler) {
//   app.use(errorHandler);
// } else {
//   app.use((err, req, res, next) => {
//     console.error('❌ Server Error:', err.message);
//     res.status(err.statusCode || 500).json({
//       success: false,
//       message: 'Something went wrong!'
//     });
//   });
// }

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exam-system')
//   .then(async () => {
//     console.log('MongoDB connected');
//     // Create indexes after connection
//     const { createIndexes } = require('./config/indexes');
//     await createIndexes();
//   })
//   .catch(err => console.error('MongoDB connection error:', err));

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



const express = require('express');
const connectDB = require('./config/database');
require('dotenv').config();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes')
const submissionRoutes = require('./routes/submissionRoutes');

const app = express();

app.use(cors());

// Middlewares
app.use(express.json()); 

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/submissions', submissionRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('✅ Server is working');
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});


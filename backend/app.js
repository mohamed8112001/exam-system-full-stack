const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Exam System API is running',
    endpoints: {
      auth: '/api/auth',
      exams: '/api/exams',
      submissions: '/api/submissions'
    }
  });
});

// Debug route to test server
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/submissions', submissionRoutes);

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exam-system')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

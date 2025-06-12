console.log('Starting server test...');

try {
  const express = require('express');
  console.log('✅ Express loaded');
  
  const mongoose = require('mongoose');
  console.log('✅ Mongoose loaded');
  
  const cors = require('cors');
  console.log('✅ CORS loaded');
  
  const dotenv = require('dotenv');
  console.log('✅ Dotenv loaded');
  
  // Load environment variables
  dotenv.config();
  console.log('✅ Environment variables loaded');
  
  const app = express();
  console.log('✅ Express app created');
  
  // Basic middleware
  app.use(cors());
  app.use(express.json());
  console.log('✅ Basic middleware configured');
  
  // Test route
  app.get('/', (req, res) => {
    res.json({ message: 'Test server is working!' });
  });
  console.log('✅ Test route configured');
  
  const PORT = process.env.PORT || 3001;
  
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 Test URL: http://localhost:${PORT}`);
  });
  
} catch (error) {
  console.error('❌ Error starting server:', error);
  process.exit(1);
}

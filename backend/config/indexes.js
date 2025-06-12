const mongoose = require('mongoose');

const createIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    
    // User indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    
    // Exam indexes
    await db.collection('exams').createIndex({ created_by: 1 });
    await db.collection('exams').createIndex({ title: 1 });
    await db.collection('exams').createIndex({ createdAt: -1 });
    await db.collection('exams').createIndex({ created_by: 1, createdAt: -1 });
    
    // Submission indexes
    await db.collection('submissions').createIndex({ exam_id: 1 });
    await db.collection('submissions').createIndex({ student_id: 1 });
    await db.collection('submissions').createIndex({ submitted_at: -1 });
    await db.collection('submissions').createIndex({ exam_id: 1, student_id: 1 }, { unique: true });
    await db.collection('submissions').createIndex({ exam_id: 1, score: -1 });
    await db.collection('submissions').createIndex({ student_id: 1, submitted_at: -1 });
    
    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  }
};

module.exports = { createIndexes };

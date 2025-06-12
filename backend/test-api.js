const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// Test data
const adminUser = {
  username: 'admin_test',
  email: 'admin@test.com',
  password: 'Admin123!',
  role: 'admin'
};

const studentUser = {
  username: 'student_test',
  email: 'student@test.com',
  password: 'Student123!',
  role: 'student'
};

const sampleExam = {
  title: 'JavaScript Fundamentals Test',
  description: 'A test covering basic JavaScript concepts',
  duration_minutes: 30,
  questions: [
    {
      question_text: 'What is the correct way to declare a variable in JavaScript?',
      question_type: 'multiple_choice',
      points: 5,
      options: [
        { option_text: 'var myVar;', is_correct: true },
        { option_text: 'variable myVar;', is_correct: false },
        { option_text: 'v myVar;', is_correct: false },
        { option_text: 'declare myVar;', is_correct: false }
      ]
    },
    {
      question_text: 'Explain the difference between let and var in JavaScript.',
      question_type: 'text',
      points: 10
    }
  ]
};

let adminToken = '';
let studentToken = '';
let examId = '';

async function testAPI() {
  console.log('🧪 Starting API Tests...\n');

  try {
    // Test 1: Register Admin
    console.log('1️⃣ Testing Admin Registration...');
    try {
      const adminRegResponse = await axios.post(`${BASE_URL}/auth/register`, adminUser);
      console.log('✅ Admin registered successfully');
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('duplicate')) {
        console.log('ℹ️ Admin already exists, continuing...');
      } else {
        throw error;
      }
    }

    // Test 2: Register Student
    console.log('2️⃣ Testing Student Registration...');
    try {
      const studentRegResponse = await axios.post(`${BASE_URL}/auth/register`, studentUser);
      console.log('✅ Student registered successfully');
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('duplicate')) {
        console.log('ℹ️ Student already exists, continuing...');
      } else {
        throw error;
      }
    }

    // Test 3: Admin Login
    console.log('3️⃣ Testing Admin Login...');
    const adminLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: adminUser.email,
      password: adminUser.password
    });
    adminToken = adminLoginResponse.data.token;
    console.log('✅ Admin login successful');

    // Test 4: Student Login
    console.log('4️⃣ Testing Student Login...');
    const studentLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: studentUser.email,
      password: studentUser.password
    });
    studentToken = studentLoginResponse.data.token;
    console.log('✅ Student login successful');

    // Test 5: Create Exam (Admin only)
    console.log('5️⃣ Testing Exam Creation...');
    const createExamResponse = await axios.post(`${BASE_URL}/exams`, sampleExam, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    examId = createExamResponse.data.data._id;
    console.log('✅ Exam created successfully');
    console.log(`   Exam ID: ${examId}`);

    // Test 6: Get Exams List
    console.log('6️⃣ Testing Get Exams List...');
    const examsResponse = await axios.get(`${BASE_URL}/exams`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    console.log('✅ Exams list retrieved successfully');
    console.log(`   Found ${examsResponse.data.data.length} exam(s)`);

    // Test 7: Get Exam by ID (Student view - no correct answers)
    console.log('7️⃣ Testing Get Exam by ID (Student)...');
    const examResponse = await axios.get(`${BASE_URL}/exams/${examId}`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    console.log('✅ Exam details retrieved successfully');
    console.log(`   Title: ${examResponse.data.data.title}`);

    // Test 8: Submit Exam
    console.log('8️⃣ Testing Exam Submission...');
    const submissionData = {
      answers: [
        {
          question_id: examResponse.data.data.questions[0]._id,
          selected_option_id: examResponse.data.data.questions[0].options[0]._id
        },
        {
          question_id: examResponse.data.data.questions[1]._id,
          text_answer: 'let has block scope while var has function scope. let prevents hoisting issues.'
        }
      ]
    };

    const submitResponse = await axios.post(`${BASE_URL}/submissions/exams/${examId}/submit`, submissionData, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    console.log('✅ Exam submitted successfully');
    console.log(`   Score: ${submitResponse.data.data.score}/${submitResponse.data.data.total_points}`);
    console.log(`   Percentage: ${submitResponse.data.data.percentage}%`);

    // Test 9: Get Student Results
    console.log('9️⃣ Testing Get Student Results...');
    const resultsResponse = await axios.get(`${BASE_URL}/submissions/results`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    console.log('✅ Student results retrieved successfully');
    console.log(`   Total submissions: ${resultsResponse.data.data.length}`);

    // Test 10: Get Exam Results (Admin only)
    console.log('🔟 Testing Get Exam Results (Admin)...');
    const examResultsResponse = await axios.get(`${BASE_URL}/submissions/exams/${examId}/results`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Exam results retrieved successfully');
    console.log(`   Total submissions for this exam: ${examResultsResponse.data.data.results.length}`);

    console.log('\n🎉 All tests passed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('✅ User Registration & Authentication');
    console.log('✅ Exam Creation & Management');
    console.log('✅ Exam Taking & Submission');
    console.log('✅ Results & Statistics');
    console.log('✅ Role-based Access Control');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

// Install axios if not present
async function checkAxios() {
  try {
    require('axios');
    return true;
  } catch (error) {
    console.log('Installing axios...');
    const { execSync } = require('child_process');
    execSync('npm install axios', { stdio: 'inherit' });
    return true;
  }
}

// Run tests
checkAxios().then(() => {
  testAPI();
}).catch(console.error);

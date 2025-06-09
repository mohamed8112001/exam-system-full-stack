1. Check if your backend server is running:
   - Open a browser and navigate to http://localhost:3001/api/test
   - You should see {"message":"API is working"}

2. Check your routes with a tool like Postman:
   - Try a POST request to http://localhost:3001/api/auth/register with this body:
     {
       "username": "testuser",
       "email": "test@example.com",
       "password": "password123",
       "role": "student"
     }

3. Check server logs:
   - Look at your terminal where the backend is running
   - Check for any error messages

4. Verify frontend API calls:
   - In your browser dev tools (F12), go to Network tab
   - Make sure the request URL is correct: http://localhost:3001/api/auth/register
   - Check that the request payload contains the correct data
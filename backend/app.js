const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('../backend/config/database');
const authRoutes = require('../backend/routes/authRoutes')
const examRoutes = require('../backend/routes/examRoutes')

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());

connectDB();
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes); 
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
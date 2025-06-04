const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("../backend/config/database");
const authRoutes = require("../backend/routes/authRoutes");
const examRoutes = require("../backend/routes/examRoutes");
const questionRoutes = require("../backend/routes/questionRoutes");
const submissionRoutes = require("../backend/routes/submissionRoutes");

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());

connectDB();
app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/exams/:exam_id/questions", questionRoutes);
app.use('/api/exams/:exam_id/submissions', submissionRoutes);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

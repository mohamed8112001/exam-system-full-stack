const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('../backend/config/database');

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
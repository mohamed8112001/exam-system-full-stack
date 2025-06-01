const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables from .env file

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected')
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;

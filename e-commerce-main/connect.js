const mongoose = require("mongoose");
require('dotenv').config();
const uri = process.env.DATABASE;


// Connect to the MongoDB database
const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = {
  connectToDatabase
};
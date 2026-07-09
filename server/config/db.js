const mongoose = require('mongoose');

// Define an async function named connectDB to connect to MongoDB.
const connectDB = async () => {
  try {
    // Read the MongoDB connection string from the environment variable MONGO_URI.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Print a success message when the database connection is established.
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Handle any connection errors and print the error message.
    console.error(`Error: ${error.message}`);

    // Stop the process if the database connection fails.
    process.exit(1);
  }
};

// Export the connectDB function so it can be used in other files.
module.exports = connectDB;

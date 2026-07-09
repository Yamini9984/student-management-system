const mongoose = require('mongoose');

// Create a schema for student documents.
const studentSchema = new mongoose.Schema(
  {
    // Store the student's full name as a required string and trim extra spaces.
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Store the student's email as a required, unique, lowercase string.
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    // Store the student's course as a required string.
    course: {
      type: String,
      required: true,
    },

    // Store the student's age as a required number with a minimum value of 18.
    age: {
      type: Number,
      required: true,
      min: 18,
    },

    // Store the student's uploaded photo path if one is provided.
    photo: {
      type: String,
      default: '',
    },
  },
  {
    // Add createdAt and updatedAt timestamps to each document.
    timestamps: true,
  }
);

// Export the Student model based on the schema.
module.exports = mongoose.model('Student', studentSchema);

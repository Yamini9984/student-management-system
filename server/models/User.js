const mongoose = require('mongoose');

// Create a schema for user accounts with validation and default role values.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['Admin', 'User'],
      default: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Export the User model for authentication and role-based access control.
module.exports = mongoose.model('User', userSchema);

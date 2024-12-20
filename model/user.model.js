const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Define schema for user model
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },  // User's full name
  emailAddress: { type: String, required: true, unique: true }, // User's email (unique)
  userPassword: { type: String, required: true, select: false }, // Password field (not selected by default)
  userUpi: { type: String, required: true }, // Unique UPI ID for the user
  accountBalance: { type: Number, default: 0 }, // User's balance (default to 0)
});

// Instance method to generate authentication token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {});
  return token;
};

// Instance method to compare the provided password with stored password
userSchema.methods.isPasswordValid = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.userPassword);
};

// Static method to hash the password before saving
userSchema.statics.hashUserPassword = async function (inputPassword) {
  return await bcrypt.hash(inputPassword, 10);
};

// Create and export the user model
const User = mongoose.model('User', userSchema);

module.exports = User;

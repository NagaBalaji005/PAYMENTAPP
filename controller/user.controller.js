const userModel = require('../models/User');
const transactionModel = require('../models/Transaction');
const userService = require('../services/userService');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

module.exports.createUser = async (req, res) => { 
  const generateUniqueUpi = () => {
    const randomHex = crypto.randomBytes(4).toString('hex');
    return `${randomHex}`;
  };

  try {
    // Validate incoming data
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const { name, email, password } = req.body;
    const uniqueUpi = generateUniqueUpi();
    console.log(uniqueUpi);

    // Check if the email is already registered
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'This email is already registered' });
    }

    // Hash the password
    const hashedPassword = await userModel.hashPassword(password);

    // Create a new user with default balance and generated UPI ID
    const newUser = await userService.createUser({
      name,
      email,
      password: hashedPassword,
      upi_id: uniqueUpi,
      balance: 0, // Default balance
      alert: "newUserAlert"
    });

    // Generate authentication token
    const authToken = newUser.generateAuthToken();

    // Return success response with user details and token
    res.status(201).json({
      message: 'User registration successful',
      token: authToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        upi_id: newUser.upi_id,
        balance: newUser.balance,
        alert: "newUserAlert"
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during registration', error: error.message });
  }
};

module.exports.authenticateUser = async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(400).json({ errors: validationErrors.array() });
  }

  const { email, password } = req.body;

  try {
    // Find user by email
    const existingUser = await userModel.findOne({ email }).select('+password');
    if (!existingUser) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password match
    const isPasswordValid = await existingUser.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate auth token for the user
    const authToken = existingUser.generateAuthToken();

    // Return authentication token and user data
    res.status(200).json({ token: authToken, user: existingUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Authentication failed', error: error.message });
  }
};

module.exports.getUserDetailsByUpi = async (req, res) => {
  try {
    const { upi_id } = req.params; // Extract UPI ID from the request parameters

    if (!upi_id) {
      return res.status(400).json({ message: 'UPI ID is required' });
    }

    // Retrieve user details based on the provided UPI ID, excluding the password
    const user = await userModel.findOne({ upi_id }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found for the provided UPI ID' });
    }

    // Respond with user details
    res.status(200).json({
      message: 'User details fetched successfully',
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

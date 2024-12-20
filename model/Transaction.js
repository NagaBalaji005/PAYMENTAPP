const mongoose = require('mongoose');

// Define schema for transactions
const transactionSchema = new mongoose.Schema({
  senderUpi: { type: String, required: true },  // Sender's UPI ID
  receiverUpi: { type: String, required: true }, // Receiver's UPI ID
  transactionAmount: { type: Number, required: true }, // Transaction amount
  transactionTime: { type: Date, default: Date.now }, // Timestamp for the transaction
});

// Create the model for transaction
const Transaction = mongoose.model('Transaction', transactionSchema);

// Export the transaction model for use in other parts of the application
module.exports = Transaction;

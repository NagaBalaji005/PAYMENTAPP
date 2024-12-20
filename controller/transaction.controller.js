const transactionModel = require('../models/Transaction');



const userModel = require('../models/User');

module.exports.processTransaction = async (req, res) => {
  try {
    const { sender_upi, receiver_upi, transactionAmount } = req.body;

    // Input validation
    if (!sender_upi || !receiver_upi || !transactionAmount) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    if (sender_upi === receiver_upi) {
      return res.status(400).json({ message: 'Sender and receiver cannot be the same person' });
    }   

    if (transactionAmount <= 0) {
      return res.status(400).json({ message: 'Transaction amount must be greater than zero' });
    }

    // Retrieve sender and receiver data
    const senderUser = await userModel.findOne({ upi_id: sender_upi });
    const receiverUser = await userModel.findOne({ upi_id: receiver_upi });

    if (!senderUser) return res.status(404).json({ message: 'Sender not found' });
    if (!receiverUser) return res.status(404).json({ message: 'Receiver not found' });

    // Verify sender's balance
    if (senderUser.balance < transactionAmount) {
      return res.status(400).json({ message: 'Insufficient funds in sender’s account' });
    }

    // Proceed with transaction
    senderUser.balance -= transactionAmount;
    receiverUser.balance += transactionAmount;

    // Save the updated user balances
    await senderUser.save();
    await receiverUser.save();

    // Create transaction record
    const newTransaction = await transactionModel.create({
      sender_upi,
      receiver_upi,
      amount: transactionAmount,
      timestamp: new Date(),
    });

    // Return transaction success response
    res.status(200).json({
      message: 'Transaction completed successfully',
      transactionDetails: newTransaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during the transaction', error: error.message });
  }
};

module.exports.fetchTransactionsByUpi = async (req, res) => {
  try {
    const { upi_id } = req.params; // Get UPI ID from the request parameter

    if (!upi_id) {
      return res.status(400).json({ message: 'UPI ID must be provided' });
    }

    // Fetch all transactions where the user is either sender or receiver
    const userTransactions = await transactionModel.find({
      $or: [{ sender_upi_id: upi_id }, { receiver_upi_id: upi_id }],
    }).sort({ timestamp: -1 }); // Sort by the most recent transaction

    if (userTransactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for this UPI ID' });
    }

    res.status(200).json({
      message: 'Transaction history retrieved successfully',
      transactions: userTransactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};

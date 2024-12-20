const express = require('express')
const router = express.Router();
const transactionController = require('../controller/transaction.controller')



router.post('/transaction',transactionController.makeTransaction)
router.get('/transaction/:upi_id', transactionController.getTransactionsByUpi);


module.exports = router;
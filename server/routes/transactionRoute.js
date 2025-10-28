const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Get all transactions
router.get('/', transactionController.getAllTransactions);

// Get transaction by ID
router.get('/:id', transactionController.getTransactionById);

// Create new transaction
router.post('/', transactionController.createTransaction);

// Update transaction
router.put('/:id', transactionController.updateTransaction);

// Delete transaction
router.delete('/:id', transactionController.deleteTransaction);

// Get transactions by account number
router.get('/account/:accountNumber', transactionController.getTransactionsByAccount);

// Get total amount by account
router.get('/account/:accountNumber/total', transactionController.getTotalAmountByAccount);

module.exports = router;
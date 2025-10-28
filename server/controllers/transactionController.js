const Transaction = require('../models/Transaction')

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 })
    
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    })
  }
}

const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      })
    }

    res.status(200).json({
      success: true,
      data: transaction
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    })
  }
}

const createTransaction = async (req, res) => {
  try {
    const { debitedFrom, creditedTo, amount, date } = req.body

    // Validate required fields
    if (!debitedFrom || !creditedTo || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide debitedFrom, creditedTo, and amount'
      })
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      })
    }

    const transaction = await Transaction.create({
      debitedFrom,
      creditedTo,
      amount,
      date: date || new Date()
    })

    res.status(201).json({
      success: true,
      data: transaction
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    })
  }
}

const updateTransaction = async (req, res) => {
  try {
    const { debitedFrom, creditedTo, amount, date } = req.body

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { debitedFrom, creditedTo, amount, date },
      { new: true, runValidators: true }
    )

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      })
    }

    res.status(200).json({
      success: true,
      data: transaction
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    })
  }
}

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id)

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    })
  }
}

const getTransactionsByAccount = async (req, res) => {
  try {
    const { accountNumber } = req.params

    const transactions = await Transaction.find({
      $or: [
        { debitedFrom: accountNumber },
        { creditedTo: accountNumber }
      ]
    }).sort({ date: -1 })

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    })
  }
}

const getTotalAmountByAccount = async (req, res) => {
  try {
    const { accountNumber } = req.params

    const totals = await Transaction.getTotalAmountByAccount(accountNumber)

    res.status(200).json({
      success: true,
      data: totals
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    })
  }
}

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByAccount,
  getTotalAmountByAccount
}
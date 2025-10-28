const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  debitedFrom: {
    type: String,
    required: [true, 'Debited account number is required'],
    trim: true
  },
  creditedTo: {
    type: String,
    required: [true, 'Credited account number is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Transaction amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Index for better query performance
transactionSchema.index({ debitedFrom: 1, date: -1 })
transactionSchema.index({ creditedTo: 1, date: -1 })
transactionSchema.index({ date: -1 })

// Static method to get total amount for an account
transactionSchema.statics.getTotalAmountByAccount = async function(accountNumber) {
  const creditedResult = await this.aggregate([
    {
      $match: {
        creditedTo: accountNumber
      }
    },
    {
      $group: {
        _id: null,
        totalCredited: { $sum: '$amount' }
      }
    }
  ])

  const debitedResult = await this.aggregate([
    {
      $match: {
        debitedFrom: accountNumber
      }
    },
    {
      $group: {
        _id: null,
        totalDebited: { $sum: '$amount' }
      }
    }
  ])

  const totalCredited = creditedResult[0]?.totalCredited || 0
  const totalDebited = debitedResult[0]?.totalDebited || 0

  return {
    totalCredited,
    totalDebited,
    netAmount: totalCredited - totalDebited
  }
}

transactionSchema.methods.toJSON = function() {
  const transaction = this.toObject()
  
  transaction.formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(transaction.amount)

  transaction.formattedDate = new Date(transaction.date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

  return transaction
}

module.exports = mongoose.model('Transaction', transactionSchema)
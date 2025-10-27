import React, { useState } from 'react'
import './transactions.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCalendar, faReceipt } from '@fortawesome/free-solid-svg-icons'
import { AddTransaction } from '../../components/addTransaction/AddTransaction'

export const Transactions = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      debitedFrom: '123456789012',
      creditedTo: '987654321098',
      amount: 15000,
      date: '2024-01-15'
    },
    {
      id: 2,
      debitedFrom: '555566667777',
      creditedTo: '123456789012',
      amount: 25000,
      date: '2024-01-10'
    },
    {
      id: 3,
      debitedFrom: '123456789012',
      creditedTo: '444433332222',
      amount: 8000,
      date: '2024-01-05'
    },
    {
      id: 4,
      debitedFrom: '123456789012',
      creditedTo: '111122223333',
      amount: 12000,
      date: '2024-01-02'
    }
  ])

  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0)

  const handleAddTransaction = (newTransaction) => {
    const transaction = {
      ...newTransaction,
      id: transactions.length + 1,
      amount: parseFloat(newTransaction.amount)
    }
    setTransactions([transaction, ...transactions])
    setShowAddModal(false)
  }

  const formatAccountNumber = (account) => {
    return account
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="transactionsContainer">
      {/* Header */}
      <div className="transactionsHeader">
        <div className="headerLeft">
          <h1>
            <FontAwesomeIcon icon={faReceipt} className="headerIcon" />
            Transactions
          </h1>
        </div>
        <button 
          className="addTransactionBtn"
          onClick={() => setShowAddModal(true)}
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Transaction
        </button>
      </div>

      {/* Transactions Cards */}
      <div className="transactionsList">
        <div className="listHeader">
          <h2>All Transactions</h2>
          <span className="transactionCount">{transactions.length} transactions</span>
        </div>

        <div className="transactionsGrid">
          {transactions.map(transaction => (
            <div key={transaction.id} className="transactionCard">
              <div className="transactionIcon">
                <FontAwesomeIcon icon={faReceipt} />
              </div>
              
              <div className="transactionDetails">
                <div className="transactionAccounts">
                  <div className="accountRow">
                    <span className="label">Debited From:</span>
                    <span className="accountNumber">
                      {formatAccountNumber(transaction.debitedFrom)}
                    </span>
                  </div>
                  <div className="accountRow">
                    <span className="label">Credited To:</span>
                    <span className="accountNumber">
                      {formatAccountNumber(transaction.creditedTo)}
                    </span>
                  </div>
                </div>

                <div className="transactionMeta">
                  <div className="date">
                    <FontAwesomeIcon icon={faCalendar} />
                    {formatDate(transaction.date)}
                  </div>
                  <div className="amount">
                    {formatAmount(transaction.amount)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Amount */}
        <div className="totalAmountSection">
          <div className="totalAmountCard">
            <h3>Total Amount</h3>
            <span className="totalAmount">{formatAmount(totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <AddTransaction
          onClose={() => setShowAddModal(false)}
          onAddTransaction={handleAddTransaction}
        />
      )}
    </div>
  )
}
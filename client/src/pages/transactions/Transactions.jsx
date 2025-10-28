import React, { useState, useEffect } from 'react'
import './transactions.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlus, 
  faCalendar, 
  faReceipt, 
  faExclamationTriangle, 
  faSyncAlt,
  faSearch,
  faFilter,
  faMoneyBillWave,
  faExchangeAlt,
  faDatabase
} from '@fortawesome/free-solid-svg-icons'
import { AddTransaction } from '../../components/addTransaction/AddTransaction'
import axios from 'axios'

export const Transactions = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [isAdding, setIsAdding] = useState(false) // Add this state

  useEffect(() => {
    fetchTransactions()
  }, [])

  useEffect(() => {
    filterTransactions()
  }, [transactions, searchTerm])

  const fetchTransactions = async () => {
    try {
      setError(null)
      if (!refreshing) setLoading(true)
      
      const response = await axios.get('/transactions')
      setTransactions(response.data.data || [])
    } catch (err) {
      console.error('Error fetching transactions:', err)
      setError('Failed to load transactions. Please try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const filterTransactions = () => {
    if (!searchTerm.trim()) {
      setFilteredTransactions(transactions)
      return
    }

    const filtered = transactions.filter(transaction =>
      transaction.debitedFrom.includes(searchTerm) ||
      transaction.creditedTo.includes(searchTerm) ||
      transaction.amount.toString().includes(searchTerm) ||
      transaction.date.includes(searchTerm)
    )
    setFilteredTransactions(filtered)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchTransactions()
  }

  // FIXED: Prevent duplicate transactions
  const handleAddTransaction = async (newTransaction) => {
    if (isAdding) return; // Prevent multiple submissions
    
    setIsAdding(true); // Set adding state
    try {
      const response = await axios.post('/transactions', newTransaction)
      
      // Use functional update to ensure we have the latest state
      setTransactions(prevTransactions => [response.data.data, ...prevTransactions])
      setShowAddModal(false)
    } catch (err) {
      console.error('Error adding transaction:', err)
      setError('Failed to add transaction. Please try again.')
    } finally {
      setIsAdding(false); // Reset adding state
    }
  }

  const formatAccountNumber = (account) => {
    return account.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')
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

  const getTotalAmount = () => {
    return filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)
  }

  const getTransactionStats = () => {
    const total = getTotalAmount()
    const count = filteredTransactions.length
    const average = count > 0 ? total / count : 0
    
    return {
      total,
      count,
      average: formatAmount(average)
    }
  }

  // Loading State
  if (loading) {
    return (
      <div className="transactionsContainer">
        <div className="loadingState">
          <div className="spinner"></div>
          <p>Loading transactions...</p>
        </div>
      </div>
    )
  }

  // Error State
  if (error && transactions.length === 0) {
    return (
      <div className="transactionsContainer">
        <div className="errorState">
          <div className="errorIcon">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <h3>Unable to Load Transactions</h3>
          <p>{error}</p>
          <div className="errorActions">
            <button className="retryBtn" onClick={handleRefresh}>
              <FontAwesomeIcon icon={faSyncAlt} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const stats = getTransactionStats()

  return (
    <div className="transactionsContainer">
      {/* Header */}
      <div className="transactionsHeader">
        <div className="headerLeft">
          <h1>
            <FontAwesomeIcon icon={faExchangeAlt} className="headerIcon" />
            Transactions
          </h1>
          {refreshing && (
            <div className="refreshingIndicator">
              <FontAwesomeIcon icon={faSyncAlt} spin />
              Updating...
            </div>
          )}
        </div>
        <div className="headerRight">
          {error && transactions.length > 0 && (
            <div className="inlineError">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              {error}
              <button onClick={handleRefresh} className="refreshSmall">
                <FontAwesomeIcon icon={faSyncAlt} />
              </button>
            </div>
          )}
          <button 
            className="addTransactionBtn"
            onClick={() => setShowAddModal(true)}
            disabled={refreshing || isAdding} // Disable when adding
          >
            <FontAwesomeIcon icon={faPlus} />
            New Transaction
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="statsSection">
        <div className="statsGrid">
          <div className="statCard total">
            <div className="statIcon">
              <FontAwesomeIcon icon={faMoneyBillWave} />
            </div>
            <div className="statContent">
              <h3>Total Amount</h3>
              <div className="statAmount">{formatAmount(stats.total)}</div>
              <div className="statSubtitle">Across all transactions</div>
            </div>
          </div>
          
          <div className="statCard count">
            <div className="statIcon">
              <FontAwesomeIcon icon={faReceipt} />
            </div>
            <div className="statContent">
              <h3>Total Transactions</h3>
              <div className="statCount">{stats.count}</div>
              <div className="statSubtitle">Transactions processed</div>
            </div>
          </div>
          
          <div className="statCard average">
            <div className="statIcon">
              <FontAwesomeIcon icon={faDatabase} />
            </div>
            <div className="statContent">
              <h3>Average Amount</h3>
              <div className="statAverage">{stats.average}</div>
              <div className="statSubtitle">Per transaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="searchSection">
        <div className="searchBox">
          <FontAwesomeIcon icon={faSearch} className="searchIcon" />
          <input
            type="text"
            placeholder="Search by account number, amount, or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="searchInput"
          />
          {searchTerm && (
            <button 
              className="clearSearch"
              onClick={() => setSearchTerm('')}
            >
              ×
            </button>
          )}
        </div>
        <div className="filterInfo">
          <FontAwesomeIcon icon={faFilter} />
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </div>
      </div>

      {/* Transactions Cards */}
      <div className="transactionsList">
        <div className="listHeader">
          <h2>Transaction History</h2>
          <div className="headerMeta">
            <span className="transactionCount">
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </span>
            <button 
              className="refreshBtn"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <FontAwesomeIcon icon={faSyncAlt} spin={refreshing} />
              Refresh
            </button>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">
              <FontAwesomeIcon icon={faReceipt} />
            </div>
            <h3>
              {searchTerm ? 'No Matching Transactions' : 'No Transactions Found'}
            </h3>
            <p>
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first transaction'
              }
            </p>
            {!searchTerm && (
              <button 
                className="addFirstTransactionBtn"
                onClick={() => setShowAddModal(true)}
                disabled={isAdding} // Disable when adding
              >
                <FontAwesomeIcon icon={faPlus} />
                Create First Transaction
              </button>
            )}
            {searchTerm && (
              <button 
                className="clearSearchBtn"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="transactionsGrid">
            {filteredTransactions.map(transaction => (
              <div key={transaction._id} className="transactionCard">
                <div className="transactionIcon">
                  <FontAwesomeIcon icon={faExchangeAlt} />
                </div>
                
                <div className="transactionDetails">
                  <div className="transactionAccounts">
                    <div className="accountRow">
                      <span className="label">From Account</span>
                      <span className="accountNumber">
                        {formatAccountNumber(transaction.debitedFrom)}
                      </span>
                    </div>
                    <div className="accountRow">
                      <span className="label">To Account</span>
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
        )}
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <AddTransaction
          onClose={() => setShowAddModal(false)}
          onAddTransaction={handleAddTransaction}
          loading={isAdding} // Pass loading state to modal
        />
      )}
    </div>
  )
}
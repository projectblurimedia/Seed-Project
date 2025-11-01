import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  faDatabase,
  faChevronLeft,
  faXmark,
  faFileExport,
  faMoneyBillTransfer
} from '@fortawesome/free-solid-svg-icons'
import { AddTransaction } from '../../components/addTransaction/AddTransaction'
import { Toast } from '../../components/toast/Toast'
import axios from 'axios'
import * as XLSX from 'xlsx'

export const Transactions = () => {
  const navigate = useNavigate()
  const [showAddModal, setShowAddModal] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [toast, setToast] = useState(null)
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  })

  // Show toast message
  const showToast = (message, type = 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      setError(null)
      if (!refreshing) setLoading(true)
      
      const response = await axios.get('/transactions', {
        timeout: 100000,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.data) {
        throw new Error('No data received from server')
      }
      
      setTransactions(response.data.data || [])
    } catch (err) {
      console.error('Error fetching transactions:', err)
      
      let errorMessage = 'Failed to load transactions. '
      
      if (err.code === 'ECONNABORTED') {
        errorMessage += 'Request timed out. Please check your internet connection.'
      } else if (err.response) {
        errorMessage += `Server error: ${err.response.status}`
      } else if (err.request) {
        errorMessage += 'No response from server. Please try again.'
      } else {
        errorMessage += 'Please try again.'
      }
      
      setError(errorMessage)
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Filter transactions based on search and date range
  const filteredTransactions = transactions.filter(transaction => {
    const searchLower = searchTerm.toLowerCase().trim()
    const transactionDate = new Date(transaction.date)
    
    // Search filter
    const matchesSearch = searchLower ? (
      transaction.debitedFrom?.includes(searchTerm) ||
      transaction.creditedTo?.includes(searchTerm) ||
      transaction.amount?.toString().includes(searchTerm) ||
      transaction.date?.includes(searchTerm)
    ) : true

    // Date range filter
    const matchesDateRange = (!dateRange.from || transactionDate >= new Date(dateRange.from)) &&
                           (!dateRange.to || transactionDate <= new Date(dateRange.to))

    return matchesSearch && matchesDateRange
  })

  const handleRefresh = () => {
    setRefreshing(true)
    fetchTransactions()
  }

  const handleBack = () => {
    navigate('/') 
  }

  const handleAddTransaction = async (newTransaction) => {
    if (isAdding) return
    
    setIsAdding(true)
    try {
      const response = await axios.post('/transactions', newTransaction)
      
      setTransactions(prevTransactions => [response.data.data, ...prevTransactions])
      setShowAddModal(false)
      showToast('Transaction added successfully', 'success')
    } catch (err) {
      console.error('Error adding transaction:', err)
      const errorMsg = err.response?.data?.message || 'Failed to add transaction. Please try again.'
      showToast(errorMsg, 'error')
    } finally {
      setIsAdding(false)
    }
  }

  const formatAccountNumber = (account) => {
    if (!account) return 'N/A'
    const cleaned = account.toString().replace(/\s/g, '')
    if (cleaned.length !== 12) return cleaned
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8, 12)}`
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Fixed date formatting for consistent DD/MM/YYYY across all devices
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Format date for display in filters (DD/MM/YYYY)
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const getTransactionStats = () => {
    const total = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)
    const count = filteredTransactions.length
    const average = count > 0 ? total / count : 0
    
    return {
      total: formatAmount(total),
      count,
      average: formatAmount(average)
    }
  }

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('')
    setDateRange({ from: '', to: '' })
    setShowFilters(false)
    showToast('All filters cleared', 'info')
  }

  // Check if any filter is active
  const hasActiveFilters = searchTerm || dateRange.from || dateRange.to

  // Export transactions to Excel
  const exportToExcel = () => {
    try {
      const transactionsToExport = filteredTransactions.length > 0 ? filteredTransactions : transactions
      
      if (transactionsToExport.length === 0) {
        showToast('No transactions data to export', 'warning')
        return
      }

      // Prepare data for export
      const exportData = transactionsToExport.map(transaction => ({
        'From Account': formatAccountNumber(transaction.debitedFrom),
        'To Account': formatAccountNumber(transaction.creditedTo),
        'Amount': transaction.amount,
        'Date': formatDate(transaction.date)
      }))

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(exportData)

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Transactions Data')

      // Generate Excel file and download
      const fileName = `transactions_${new Date().toISOString().split('T')[0]}.xlsx`
      XLSX.writeFile(wb, fileName)
      
      showToast(`Exported ${transactionsToExport.length} transactions to Excel`, 'success')
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      showToast('Failed to export data. Please try again.', 'error')
    }
  }

  // Enhanced loading state
  if (loading) {
    return (
      <div className="transactionsPage">
        <div className="loadingState">
          <div className="loadingContent">
            <div className="loadingSpinner">
              <FontAwesomeIcon icon={faReceipt} className="spinnerIcon" />
              <div className="spinnerRing"></div>
            </div>
            <h3>Loading Transactions</h3>
            <p>Please wait while we fetch your transaction history...</p>
            <div className="loadingProgress">
              <div className="progressBar"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Enhanced error state
  if (error && transactions.length === 0) {
    return (
      <div className="transactionsPage">
        <div className="errorState">
          <div className="errorContent">
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
              <button className="backBtn" onClick={handleBack}>
                <FontAwesomeIcon icon={faChevronLeft} />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const stats = getTransactionStats()

  return (
    <div className="transactionsPage">
      {/* Toast Component */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          position="top-right"
        />
      )}

      {/* Header */}
      <div className="transactionsHeader">
        <div className="left">
          <button className="backButton" onClick={handleBack}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <FontAwesomeIcon icon={faReceipt} className="icon" />
          <div className="title">Payments</div>
        </div>
        
        <div className="right">
          <div className="navIcons">  
            <button 
              className={`iconBtn searchBtn ${showSearch ? 'active' : ''}`}
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Search"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
            
            <button 
              className={`iconBtn filterBtn ${hasActiveFilters ? 'hasFilters' : ''} ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Filters"
            >
              <FontAwesomeIcon icon={faFilter} />
              {hasActiveFilters && <span className="filterIndicator"></span>}
            </button>

            <button 
              className="iconBtn addTransactionBtn"
              onClick={() => setShowAddModal(true)}
              aria-label="Add Transaction"
              disabled={isAdding}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>

            <button 
              className="iconBtn exportBtn"
              onClick={exportToExcel}
              aria-label="Export to Excel"
              title="Export to Excel"
            >
              <FontAwesomeIcon icon={faFileExport} />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="searchSection">
          <div className={`searchContainer ${isSearchFocused ? 'focused' : ''}`}>
            <FontAwesomeIcon icon={faSearch} className="searchIcon" />
            <input
              type="text"
              placeholder="Search by account number, amount, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {searchTerm && (
              <button 
                className="clearSearch"
                onClick={() => setSearchTerm('')}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="filtersSection">
          <div className="filtersPanel">
            <div className="filtersHeader">
              <h4>Filter Transactions</h4>
              <button className="closeFilters" onClick={() => setShowFilters(false)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            
            <div className="filterGroup">
              <label>Date Range</label>
              <div className="dateRangeInputs">
                <div className="dateInput">
                  <FontAwesomeIcon icon={faCalendar} className="dateIcon" />
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                    className="datePicker"
                  />
                  <span className="dateLabel">From</span>
                </div>
                <div className="dateInput">
                  <FontAwesomeIcon icon={faCalendar} className="dateIcon" />
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                    className="datePicker"
                  />
                  <span className="dateLabel">To</span>
                </div>
              </div>
            </div>

            <div className="filterActions">
              <button className="clearAllBtn" onClick={clearAllFilters}>
                Clear All
              </button>
              <button className="applyBtn" onClick={() => setShowFilters(false)}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="activeFilters">
          <span className="filtersLabel">Active Filters:</span>
          {searchTerm && (
            <span className="filterTag">
              Search: "{searchTerm}"
              <button onClick={() => setSearchTerm('')}>×</button>
            </span>
          )}
          {dateRange.from && (
            <span className="filterTag">
              <FontAwesomeIcon icon={faCalendar} />
              From: {formatDateForDisplay(dateRange.from)}
              <button onClick={() => setDateRange(prev => ({ ...prev, from: '' }))}>×</button>
            </span>
          )}
          {dateRange.to && (
            <span className="filterTag">
              <FontAwesomeIcon icon={faCalendar} />
              To: {formatDateForDisplay(dateRange.to)}
              <button onClick={() => setDateRange(prev => ({ ...prev, to: '' }))}>×</button>
            </span>
          )}
          <button className="clearAllFilters" onClick={clearAllFilters}>
            Clear All
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="pageContent">
        <div className="transactionsContainer">
          {/* Stats Cards */}
          <div className="statsSection">
            <div className="statsGrid">
              <div className="statCard total">
                <div className="statIcon">
                  <FontAwesomeIcon icon={faMoneyBillWave} />
                </div>
                <div className="statContent">
                  <h3>Total Amount</h3>
                  <div className="statAmount">{stats.total}</div>
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

          {/* Transactions List */}
          <div className="transactionsList">
            <div className="containerHeader">
              <h2>Transaction History ({filteredTransactions.length})</h2>
              {hasActiveFilters && (
                <span className="filteredCount">
                  Showing {filteredTransactions.length} of {transactions.length} transactions
                </span>
              )}
            </div>

            {filteredTransactions.length === 0 ? (
              <div className="emptyState">
                <div className="emptyIllustration">
                  <FontAwesomeIcon icon={faMoneyBillTransfer} className="emptyIcon" />
                </div>
                <h3>No Transactions Found</h3>
                <p>
                  {hasActiveFilters 
                    ? "No transactions match your current search criteria. Try adjusting your filters."
                    : "No transactions are currently recorded in the system."
                  }
                </p>
                {hasActiveFilters ? (
                  <button className="clearFiltersBtn" onClick={clearAllFilters}>
                    Clear All Filters
                  </button>
                ) : (
                  <button 
                    className="addFirstTransactionBtn"
                    onClick={() => setShowAddModal(true)}
                    disabled={isAdding}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    Create First Transaction
                  </button>
                )}
              </div>
            ) : (
              <div className="transactionsGrid">
                {filteredTransactions.map(transaction => (
                  <div key={transaction._id} className="transactionCard">
                    <div className="transactionMain">
                      <div className="transactionIcon">
                        <FontAwesomeIcon icon={faExchangeAlt} />
                      </div>
                      <div className="transactionInfo">
                        <div className="transactionMeta">
                          <div className="date">
                            <FontAwesomeIcon icon={faCalendar} />
                            {formatDate(transaction.date)}
                          </div>
                          <div className="amount">
                            {formatAmount(transaction.amount)}
                          </div>
                        </div>
                        <div className="accountDetails">
                          <div className="accountRow">
                            <span className="accountLabel">From:</span>
                            <span className="accountNumber">
                              {formatAccountNumber(transaction.debitedFrom)}
                            </span>
                          </div>
                          <div className="accountRow">
                            <span className="accountLabel">To:</span>
                            <span className="accountNumber">
                              {formatAccountNumber(transaction.creditedTo)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <AddTransaction
          onClose={() => setShowAddModal(false)}
          onAddTransaction={handleAddTransaction}
          loading={isAdding}
        />
      )}
    </div>
  )
}
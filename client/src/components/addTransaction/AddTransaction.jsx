import React, { useState, useEffect } from 'react'
import './addTransaction.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCalendar, 
  faWallet, 
  faExchangeAlt, 
  faRupeeSign, 
  faTimes,
  faCheckCircle,
  faSpinner,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

export const AddTransaction = ({ onClose, onAddTransaction }) => {
  const [newTransaction, setNewTransaction] = useState({
    debitedFrom: '',
    creditedTo: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Auto-close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const validateForm = () => {
    const newErrors = {}
    
    // Remove spaces for validation
    const debitedFromClean = newTransaction.debitedFrom.replace(/\s/g, '')
    const creditedToClean = newTransaction.creditedTo.replace(/\s/g, '')
    const amountClean = newTransaction.amount.replace(/,/g, '')

    if (!debitedFromClean.trim()) {
      newErrors.debitedFrom = 'Debited account is required'
    } else if (!/^\d{12}$/.test(debitedFromClean)) {
      newErrors.debitedFrom = 'Account number must be 12 digits'
    }

    if (!creditedToClean.trim()) {
      newErrors.creditedTo = 'Credited account is required'
    } else if (!/^\d{12}$/.test(creditedToClean)) {
      newErrors.creditedTo = 'Account number must be 12 digits'
    }

    if (debitedFromClean === creditedToClean) {
      newErrors.creditedTo = 'Accounts must be different'
    }

    if (!amountClean || parseFloat(amountClean) <= 0) {
      newErrors.amount = 'Valid amount is required'
    }

    if (!newTransaction.date) {
      newErrors.date = 'Date is required'
    } else if (new Date(newTransaction.date) > new Date()) {
      newErrors.date = 'Future dates are not allowed'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Format account number with spaces for display (XXXX XXXX XXXX)
  const formatAccountNumber = (value) => {
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 4) return digits
    if (digits.length <= 8) return `${digits.slice(0, 4)} ${digits.slice(4)}`
    return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)}`
  }

  // Indian number formatting: 1000000 -> 10,00,000
  const formatIndianNumber = (value) => {
    // Remove all commas for processing
    let cleanValue = value.replace(/,/g, '')
    
    // Allow only numbers and one decimal point
    cleanValue = cleanValue.replace(/[^\d.]/g, '')
    
    // Split integer and decimal parts
    const parts = cleanValue.split('.')
    let integerPart = parts[0]
    const decimalPart = parts[1] ? `.${parts[1]}` : ''
    
    // Indian numbering system formatting
    if (integerPart) {
      const lastThree = integerPart.slice(-3)
      const otherNumbers = integerPart.slice(0, -3)
      
      if (otherNumbers !== '') {
        integerPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
      } else {
        integerPart = lastThree
      }
    }
    
    return integerPart + decimalPart
  }

  const handleAccountNumberChange = (e) => {
    const { name, value } = e.target
    const formattedValue = formatAccountNumber(value)
    
    setNewTransaction(prev => ({
      ...prev,
      [name]: formattedValue
    }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (submitError) setSubmitError('')
  }

  const handleAmountChange = (e) => {
    const { name, value } = e.target
    const formattedValue = formatIndianNumber(value)
    
    setNewTransaction(prev => ({
      ...prev,
      [name]: formattedValue
    }))

    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }))
    }
    if (submitError) setSubmitError('')
  }

  const handleDateChange = (e) => {
    const { name, value } = e.target
    setNewTransaction(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors.date) {
      setErrors(prev => ({ ...prev, date: '' }))
    }
    if (submitError) setSubmitError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      // Clean the data before sending (remove formatting)
      const transactionData = {
        debitedFrom: newTransaction.debitedFrom.replace(/\s/g, ''),
        creditedTo: newTransaction.creditedTo.replace(/\s/g, ''),
        amount: parseFloat(newTransaction.amount.replace(/,/g, '')),
        date: newTransaction.date
      }

      const response = await axios.post('/transactions', transactionData)
      onAddTransaction(response.data.data)
      onClose()
    } catch (error) {
      console.error('Error adding transaction:', error)
      
      if (error.response) {
        const serverError = error.response.data
        setSubmitError(serverError.message || serverError.error || 'Failed to add transaction. Please try again.')
      } else if (error.request) {
        setSubmitError('Network error. Please check your connection and try again.')
      } else {
        setSubmitError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose()
    }
  }

  return (
    <div className="modalOverlay" onClick={handleOverlayClick}>
      <div className="modalContent">
        <div className="modalHeader">
          <div className="titleSection">
            <div className="iconWrapper">
              <FontAwesomeIcon icon={faExchangeAlt} className="titleIcon" />
            </div>
            <div>
              <h2>New Transaction</h2>
              <p className="subtitle">Transfer funds between accounts</p>
            </div>
          </div>
          <button 
            className="closeBtn"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="transactionForm" noValidate>
          {submitError && (
            <div className="submitError">
              <FontAwesomeIcon icon={faExclamationCircle} />
              {submitError}
            </div>
          )}

          <div className="inputRow">
            <div className="inputGroup">
              <label htmlFor="debitedFrom">
                <FontAwesomeIcon icon={faWallet} className="inputIcon" />
                From Account
              </label>
              <input
                id="debitedFrom"
                type="text"
                name="debitedFrom"
                value={newTransaction.debitedFrom}
                onChange={handleAccountNumberChange}
                placeholder="1234 5678 9012"
                maxLength="14"
                className={errors.debitedFrom ? 'error' : ''}
                disabled={isSubmitting}
                required
              />
              {errors.debitedFrom && (
                <span className="errorMessage">{errors.debitedFrom}</span>
              )}
            </div>

            <div className="inputGroup">
              <label htmlFor="creditedTo">
                <FontAwesomeIcon icon={faWallet} className="inputIcon" />
                To Account
              </label>
              <input
                id="creditedTo"
                type="text"
                name="creditedTo"
                value={newTransaction.creditedTo}
                onChange={handleAccountNumberChange}
                placeholder="1234 5678 9012"
                maxLength="14"
                className={errors.creditedTo ? 'error' : ''}
                disabled={isSubmitting}
                required
              />
              {errors.creditedTo && (
                <span className="errorMessage">{errors.creditedTo}</span>
              )}
            </div>
          </div>

          <div className="inputRow">
            <div className="inputGroup">
              <label htmlFor="amount">
                <FontAwesomeIcon icon={faRupeeSign} className="inputIcon" />
                Amount
              </label>
              <div className="amountInputContainer">
                <span className="currencySymbol">₹</span>
                <input
                  id="amount"
                  type="text"
                  name="amount"
                  value={newTransaction.amount}
                  onChange={handleAmountChange}
                  placeholder="10,00,000"
                  className={errors.amount ? 'error' : ''}
                  disabled={isSubmitting}
                  required
                  inputMode="decimal"
                />
              </div>
              {errors.amount && (
                <span className="errorMessage">{errors.amount}</span>
              )}
            </div>

            <div className="inputGroup">
              <label htmlFor="date">
                <FontAwesomeIcon icon={faCalendar} className="inputIcon" />
                Date
              </label>
              <div className="dateInputContainer">
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={newTransaction.date}
                  onChange={handleDateChange}
                  className={errors.date ? 'error' : ''}
                  max={new Date().toISOString().split('T')[0]}
                  disabled={isSubmitting}
                  required
                />
                <FontAwesomeIcon icon={faCalendar} className="calendarIcon" />
              </div>
              {errors.date && (
                <span className="errorMessage">{errors.date}</span>
              )}
            </div>
          </div>

          <div className="formActions">
            <button 
              type="button" 
              className="cancelBtn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submitBtn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Processing...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCheckCircle} />
                  Confirm Transfer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
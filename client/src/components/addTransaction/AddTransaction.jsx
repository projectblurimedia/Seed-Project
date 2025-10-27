import React, { useState, useEffect } from 'react'
import './addTransaction.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCalendar, 
  faWallet, 
  faExchangeAlt, 
  faRupeeSign, 
  faTimes,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons'

export const AddTransaction = ({ onClose, onAddTransaction }) => {
  const [newTransaction, setNewTransaction] = useState({
    debitedFrom: '',
    creditedTo: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    
    if (!newTransaction.debitedFrom.trim()) {
      newErrors.debitedFrom = 'Debited account is required'
    } else if (!/^\d{12}$/.test(newTransaction.debitedFrom)) {
      newErrors.debitedFrom = 'Account number must be 12 digits'
    }

    if (!newTransaction.creditedTo.trim()) {
      newErrors.creditedTo = 'Credited account is required'
    } else if (!/^\d{12}$/.test(newTransaction.creditedTo)) {
      newErrors.creditedTo = 'Account number must be 12 digits'
    }

    if (newTransaction.debitedFrom === newTransaction.creditedTo) {
      newErrors.creditedTo = 'Accounts must be different'
    }

    if (!newTransaction.amount || parseFloat(newTransaction.amount) <= 0) {
      newErrors.amount = 'Valid amount is required'
    } else if (parseFloat(newTransaction.amount) > 10000000) {
      newErrors.amount = 'Amount cannot exceed ₹1,00,00,000'
    }

    if (!newTransaction.date) {
      newErrors.date = 'Date is required'
    } else if (new Date(newTransaction.date) > new Date()) {
      newErrors.date = 'Future dates are not allowed'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewTransaction(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onAddTransaction({
      ...newTransaction,
      amount: parseFloat(newTransaction.amount)
    })
    
    setIsSubmitting(false)
    onClose()
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
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
            aria-label="Close modal"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="transactionForm" noValidate>
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
                onChange={handleInputChange}
                placeholder="123456789012"
                maxLength="12"
                className={errors.debitedFrom ? 'error' : ''}
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
                onChange={handleInputChange}
                placeholder="123456789012"
                maxLength="12"
                className={errors.creditedTo ? 'error' : ''}
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
                  type="number"
                  name="amount"
                  value={newTransaction.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="1"
                  max="10000000"
                  className={errors.amount ? 'error' : ''}
                  required
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
                  onChange={handleInputChange}
                  className={errors.date ? 'error' : ''}
                  max={new Date().toISOString().split('T')[0]}
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
                  <div className="spinner"></div>
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
import React, { useState } from 'react'
import './createFarmer.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Toast } from '../../components/toast/Toast'

export const CreateFarmer = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    aadhar: '',
    mobile: '',
    bankAccountNumber: '',
    village: '',
  })
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState([])

  // Efficient toast management
  const showToast = (message, type = 'error') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    // Input validation patterns
    const patterns = {
      aadhar: /^\d{0,12}$/,
      mobile: /^\d{0,10}$/,
      bankAccountNumber: /^[\d]*$/
    }

    if (patterns[name] && !patterns[name].test(value)) return

    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleBack = () => {
    navigate(-1)
  }

  const validateForm = () => {
    const errors = []

    if (!form.firstName.trim()) errors.push('First name is required')
    if (!form.lastName.trim()) errors.push('Last name is required')
    
    if (!form.aadhar || form.aadhar.length !== 12) {
      errors.push('Valid 12-digit Aadhar number is required')
    }
    
    if (!form.mobile || form.mobile.length !== 10) {
      errors.push('Valid 10-digit mobile number is required')
    }
    
    if (!form.bankAccountNumber.trim()) errors.push('Bank account number is required')
    if (!form.village.trim()) errors.push('Village name is required')

    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear previous toasts
    setToasts([])

    // Validate form and show only first error
    const errors = validateForm()
    if (errors.length > 0) {
      // Show only the first error message
      showToast(errors[0], 'error')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post('/farmers', form, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 201) {
        showToast('Farmer created successfully!', 'success')
        
        setTimeout(() => {
          navigate(`/create-crop/${form.aadhar}`)
        }, 500)
      }
      
    } catch (error) {
      console.error('Error creating farmer:', error)
      
      let errorMessage = 'Failed to create farmer'

      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.'
      } else if (error.response) {
        // Server responded with error status
        const { data, status } = error.response
        
        if (status === 409) {
          errorMessage = 'Farmer with this Aadhar number already exists'
        } else if (status === 400) {
          errorMessage = data.message || 'Invalid data provided'
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.'
        } else if (data.errors && Array.isArray(data.errors)) {
          // Show first validation error
          errorMessage = data.errors[0]
        } else if (data.message) {
          errorMessage = data.message
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.'
      }

      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="createFarmerContainer">
      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          position="top-right"
        />
      ))}

      <div className="formCard">
        <div className="formHeader">
          <button className="backButton" onClick={handleBack}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h2>Create Farmer</h2>
          {/* Empty div for proper centering */}
          <div className="placeholder"></div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* First Name & Last Name Row */}
          <div className="inputRow">
            <div className="inputGroup">
              <label>First Name <span className="required">*</span></label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                disabled={loading}
              />
            </div>

            <div className="inputGroup">
              <label>Last Name <span className="required">*</span></label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                disabled={loading}
              />
            </div>
          </div>

          {/* Aadhar & Mobile Row */}
          <div className="inputRow">
            <div className="inputGroup">
              <label>Aadhar Number <span className="required">*</span></label>
              <input
                type="text"
                name="aadhar"
                value={form.aadhar}
                onChange={handleChange}
                placeholder="Enter 12-digit Aadhar"
                maxLength="12"
                disabled={loading}
              />
            </div>

            <div className="inputGroup">
              <label>Mobile Number <span className="required">*</span></label>
              <input
                type="text"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Enter 10-digit mobile"
                maxLength="10"
                disabled={loading}
              />
            </div>
          </div>

          {/* Bank Account & Village Row */}
          <div className="inputRow">
            <div className="inputGroup">
              <label>Account Number <span className="required">*</span></label>
              <input
                type="text"
                name="bankAccountNumber"
                value={form.bankAccountNumber}
                onChange={handleChange}
                placeholder="Enter Account Number"
                disabled={loading}
              />
            </div>

            <div className="inputGroup">
              <label>Village Name <span className="required">*</span></label>
              <input
                type="text"
                name="village"
                value={form.village}
                onChange={handleChange}
                placeholder="Enter Village Name"
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={`createBtn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Farmer'}
          </button>
        </form>
      </div>
    </div>
  )
}
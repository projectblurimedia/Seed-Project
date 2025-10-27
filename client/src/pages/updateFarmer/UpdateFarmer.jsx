import React, { useState, useEffect } from 'react'
import './updateFarmer.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

export const UpdateFarmer = () => {
  const navigate = useNavigate()
  const { aadhar } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    aadhar: '',
    mobile: '',
    bankAccountNumber: '',
    village: '',
  })

  // Fetch farmer details on component mount
  useEffect(() => {
    const fetchFarmerDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch farmer details by Aadhar
        const response = await axios.get(`/farmers/${aadhar}`)
        const farmerData = response.data
        
        setForm({
          firstName: farmerData.firstName || '',
          lastName: farmerData.lastName || '',
          aadhar: farmerData.aadhar || '',
          mobile: farmerData.mobile || '',
          bankAccountNumber: farmerData.bankAccountNumber || '',
          village: farmerData.village || '',
        })
        
      } catch (err) {
        console.error('Error fetching farmer details:', err)
        setError('Failed to load farmer details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (aadhar) {
      fetchFarmerDetails()
    }
  }, [aadhar])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'aadhar' && !/^\d{0,12}$/.test(value)) return
    if (name === 'mobile' && !/^\d{0,10}$/.test(value)) return

    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleUndo = () => {
    navigate(-1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      await axios.put(`/farmers/${aadhar}`, form)
      
      alert('Farmer details updated successfully!')
      navigate(`/farmers/${aadhar}`)
      
    } catch (err) {
      console.error('Error updating farmer:', err)
      alert('Error updating farmer details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Loading State
  if (loading) {
    return (
      <div className="updateFarmerContainer">
        <div className="loadingState">
          <div className="spinner"></div>
          <p>Loading farmer details...</p>
        </div>
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="updateFarmerContainer">
        <div className="errorState">
          <div className="errorIcon">⚠️</div>
          <h3>Unable to Load Farmer Details</h3>
          <p>{error}</p>
          <button className="retryBtn" onClick={() => window.location.reload()}>
            Try Again
          </button>
          <button className="backBtn" onClick={handleUndo}>
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="updateFarmerContainer">
      <div className="formCard">
        <div className="formHeader">
          <button className="undoBtn" onClick={handleUndo}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h2>Update Farmer</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* First Name & Last Name */}
          <div className="inputRow">
            <div className="inputGroup">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="inputGroup">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Aadhar & Mobile */}
          <div className="inputRow">
            <div className="inputGroup">
              <label>Aadhar Number</label>
              <input
                type="text"
                name="aadhar"
                value={form.aadhar}
                onChange={handleChange}
                maxLength="12"
                required
              />
            </div>

            <div className="inputGroup">
              <label>Mobile Number</label>
              <input
                type="text"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                maxLength="10"
                required
              />
            </div>
          </div>

          {/* Account & Village */}
          <div className="inputRow">
            <div className="inputGroup">
              <label>Account Number</label>
              <input
                type="text"
                name="bankAccountNumber"
                value={form.bankAccountNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="inputGroup">
              <label>Village Name</label>
              <input
                type="text"
                name="village"
                value={form.village}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="updateBtn" disabled={loading}>
            {loading ? 'Updating...' : 'Update Farmer'}
          </button>
        </form>
      </div>
    </div>
  )
}
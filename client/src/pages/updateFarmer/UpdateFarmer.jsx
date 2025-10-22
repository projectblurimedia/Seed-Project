import React, { useState } from 'react'
import './updateFarmer.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

export const UpdateFarmer = () => {
  const navigate = useNavigate()

  // Static sample data (to simulate an existing farmer record)
  const [form, setForm] = useState({
    firstName: 'Ravi',
    lastName: 'Patel',
    aadhar: '123456789012',
    mobile: '9876543210',
    account: '1234567890',
    village: 'Shantipur',
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'aadhar' && !/^\d{0,12}$/.test(value)) return
    if (name === 'mobile' && !/^\d{0,10}$/.test(value)) return

    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleUndo = () => {
    navigate('/')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Farmer details updated successfully!')
    navigate('/')
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
                name="account"
                value={form.account}
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

          <button type="submit" className="updateBtn">
            Update Farmer
          </button>
        </form>
      </div>
    </div>
  )
}

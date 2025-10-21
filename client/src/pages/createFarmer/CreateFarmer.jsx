import React, { useState } from 'react'
import './createFarmer.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

export const CreateFarmer = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    aadhar: '',
    mobile: '',
    account: '',
    village: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'aadhar' && !/^\d{0,12}$/.test(value)) return
    if (name === 'mobile' && !/^\d{0,10}$/.test(value)) return

    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleUndo = () => {
    setForm({ firstName: '', lastName: '', aadhar: '', mobile: '', village: '' })
    navigate('/')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(`/create-crop/${form.aadhar}`)
  }

  return (
    <div className="createFarmerContainer">
      <div className="formCard">
        <div className="formHeader">
          <button className="undoBtn" onClick={handleUndo}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h2>Create Farmer</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* First Name & Last Name Row */}
          <div className="inputRow">
            <div className="inputGroup">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
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
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          {/* Aadhar & Mobile Row */}
          <div className="inputRow">
            <div className="inputGroup">
              <label>Aadhar Number</label>
              <input
                type="text"
                name="aadhar"
                value={form.aadhar}
                onChange={handleChange}
                placeholder="Enter 12-digit Aadhar"
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
                placeholder="Enter 10-digit mobile"
                maxLength="10"
                required
              />
            </div>
          </div>

          <div className="inputRow">
            <div className="inputGroup">
              <label>Account Number</label>
              <input
                type="text"
                name="account"
                value={form.account}
                onChange={handleChange}
                placeholder="Enter Account Number"
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
                placeholder="Enter Village Name"
                required
              />
            </div>
          </div>

          <button type="submit" className="createBtn">
            Create Farmer
          </button>
        </form>
      </div>
    </div>
  )
}
import React, { useState } from 'react'
import './createFarmer.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCaretLeft, faChevronLeft, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'

export const CreateFarmer = () => {
  const [locations, setLocations] = useState(['Vijayawada', 'Guntur', 'Nellore', 'Kurnool'])
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    aadhar: '',
    mobile: '',
    location: '',
  })
  const [isCustom, setIsCustom] = useState(false)
  const [customLocation, setCustomLocation] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'aadhar' && !/^\d{0,12}$/.test(value)) return
    if (name === 'mobile' && !/^\d{0,10}$/.test(value)) return

    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddLocation = () => {
    const trimmed = customLocation.trim()
    if (trimmed && !locations.includes(trimmed)) {
      setLocations((prev) => [...prev, trimmed])
      setForm((prev) => ({ ...prev, location: trimmed }))
    }
    setCustomLocation('')
    setIsCustom(false)
  }

  const handleUndo = () => {
    setForm({ firstName: '', lastName: '', aadhar: '', mobile: '', location: '' })
    setCustomLocation('')
    setIsCustom(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`✅ Farmer Created Successfully!\n\n${JSON.stringify(form, null, 2)}`)
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

          <div className="inputGroup">
            <label>Aadhar Number</label>
            <input
              type="text"
              name="aadhar"
              value={form.aadhar}
              onChange={handleChange}
              placeholder="Enter 12-digit Aadhar number"
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
              placeholder="Enter 10-digit mobile number"
              maxLength="10"
              required
            />
          </div>

          <div className="inputGroup locationGroup">
            <label>Location</label>
            {!isCustom ? (
              <div className="locationRow">
                <select
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select location</option>
                  {locations.map((loc, i) => (
                    <option key={i} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="customBtn"
                  onClick={() => setIsCustom(true)}
                >
                  Custom
                </button>
              </div>
            ) : (
              <div className="locationRow">
                <input
                  type="text"
                  placeholder="Enter new location"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                />
                <button
                  type="button"
                  className="addBtn"
                  onClick={handleAddLocation}
                >
                  <FontAwesomeIcon icon={faPlus} /> Add
                </button>
                <button
                  type="button"
                  className="cancelBtn"
                  onClick={() => {
                    setIsCustom(false)
                    setCustomLocation('')
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} /> Cancel
                </button>
              </div>
            )}
          </div>

          <button type="submit" className="createBtn">
            Create Farmer
          </button>
        </form>
      </div>
    </div>
  )
}

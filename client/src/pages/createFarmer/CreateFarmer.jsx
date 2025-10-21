import React, { useState, useRef, useEffect } from 'react'
import './createFarmer.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faPlus, faXmark, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

export const CreateFarmer = () => {
  const navigate = useNavigate()
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

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
    setIsDropdownOpen(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(`/create-crop/${form.aadhar}`)
  }

  const handleLocationSelect = (location) => {
    setForm((prev) => ({ ...prev, location }))
    setIsDropdownOpen(false)
  }

  const handleCustomClick = () => {
    setIsCustom(true)
    setIsDropdownOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
              <div className="locationRow" ref={dropdownRef}>
                <div 
                  className="customSelect"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className={`selectedValue ${!form.location ? 'placeholder' : ''}`}>
                    {form.location || 'Select location'}
                  </span>
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={`dropdownIcon ${!isDropdownOpen ? 'open' : ''}`}
                  />
                </div>
                
                {isDropdownOpen && (
                  <div className="dropdownMenu">
                    {locations.map((location, index) => (
                      <div
                        key={index}
                        className={`dropdownItem ${
                          form.location === location ? 'selected' : ''
                        }`}
                        onClick={() => handleLocationSelect(location)}
                      >
                        {location}
                      </div>
                    ))}
                    <div 
                      className="dropdownItem customOption"
                      onClick={handleCustomClick}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      Add Custom Location
                    </div>
                  </div>
                )}
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
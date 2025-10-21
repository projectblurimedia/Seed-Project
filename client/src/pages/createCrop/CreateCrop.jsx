import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './createCrop.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faPlus, faXmark, faChevronDown, faCalendar } from '@fortawesome/free-solid-svg-icons'

export const CreateCrop = () => {
  const { aadhar } = useParams()
  const navigate = useNavigate()
  
  const [seedTypes, setSeedTypes] = useState(['Babycorn Seed', 'Popcorn', 'Maize 161', 'Sweet Corn', 'Field Corn'])
  const [regions, setRegions] = useState(['Jangareddygudem', 'Vijayanagaram'])
  const [pesticides, setPesticides] = useState(['Urea', 'DAP', 'NPK', 'Organic Manure', 'Potassium Nitrate'])
  const [form, setForm] = useState({
    seedType: '',
    region: '',
    acres: '',
    malePackets: '',
    femalePackets: '',
    sowingDateMale: '',
    sowingDateFemale: '',
    firstDetachingDate: '',
    secondDetachingDate: '',
    pesticide: '',
    harvestingDate: '',
    payment: '',
    yield: ''
  })
  const [isCustomSeed, setIsCustomSeed] = useState(false)
  const [isCustomRegion, setIsCustomRegion] = useState(false)
  const [isCustomPesticide, setIsCustomPesticide] = useState(false)
  const [customSeed, setCustomSeed] = useState('')
  const [customRegion, setCustomRegion] = useState('')
  const [customPesticide, setCustomPesticide] = useState('')
  const [isSeedDropdownOpen, setIsSeedDropdownOpen] = useState(false)
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false)
  const [isPesticideDropdownOpen, setIsPesticideDropdownOpen] = useState(false)
  
  const seedDropdownRef = useRef(null)
  const regionDropdownRef = useRef(null)
  const pesticideDropdownRef = useRef(null)
  const sowingDateMaleRef = useRef(null)
  const sowingDateFemaleRef = useRef(null)
  const firstDetachingDateRef = useRef(null)
  const secondDetachingDateRef = useRef(null)
  const harvestingDateRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSeed = () => {
    const trimmed = customSeed.trim()
    if (trimmed && !seedTypes.includes(trimmed)) {
      setSeedTypes((prev) => [...prev, trimmed])
      setForm((prev) => ({ ...prev, seedType: trimmed }))
    }
    setCustomSeed('')
    setIsCustomSeed(false)
  }

  const handleAddRegion = () => {
    const trimmed = customRegion.trim()
    if (trimmed && !regions.includes(trimmed)) {
      setRegions((prev) => [...prev, trimmed])
      setForm((prev) => ({ ...prev, region: trimmed }))
    }
    setCustomRegion('')
    setIsCustomRegion(false)
  }

  const handleAddPesticide = () => {
    const trimmed = customPesticide.trim()
    if (trimmed && !pesticides.includes(trimmed)) {
      setPesticides((prev) => [...prev, trimmed])
      setForm((prev) => ({ ...prev, pesticide: trimmed }))
    }
    setCustomPesticide('')
    setIsCustomPesticide(false)
  }

  const handleUndo = () => {
    navigate(-1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`✅ Crop Created Successfully!\n\nFarmer Aadhar: ${aadhar}\n${JSON.stringify(form, null, 2)}`)
  }

  const handleSeedSelect = (seedType) => {
    setForm((prev) => ({ ...prev, seedType }))
    setIsSeedDropdownOpen(false)
  }

  const handleRegionSelect = (region) => {
    setForm((prev) => ({ ...prev, region }))
    setIsRegionDropdownOpen(false)
  }

  const handlePesticideSelect = (pesticide) => {
    setForm((prev) => ({ ...prev, pesticide }))
    setIsPesticideDropdownOpen(false)
  }

  const handleDateContainerClick = (dateRef) => {
    if (dateRef.current) {
      dateRef.current.showPicker()
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (seedDropdownRef.current && !seedDropdownRef.current.contains(event.target)) {
        setIsSeedDropdownOpen(false)
      }
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target)) {
        setIsRegionDropdownOpen(false)
      }
      if (pesticideDropdownRef.current && !pesticideDropdownRef.current.contains(event.target)) {
        setIsPesticideDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="createCropContainer">
      <div className="formCard">
        <div className="formHeader">
          <button className="undoBtn" onClick={handleUndo}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h2>Create Crop</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Seed Type & Region */}
          <div className="inputRow">
            <div className="inputGroup">
              <label>Seed Type</label>
              {!isCustomSeed ? (
                <div className="dropdownContainer" ref={seedDropdownRef}>
                  <div 
                    className="customSelect"
                    onClick={() => setIsSeedDropdownOpen(!isSeedDropdownOpen)}
                  >
                    <span className={`selectedValue ${!form.seedType ? 'placeholder' : ''}`}>
                      {form.seedType || 'Select seed type'}
                    </span>
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className={`dropdownIcon ${isSeedDropdownOpen ? 'open' : ''}`}
                    />
                  </div>
                  
                  {isSeedDropdownOpen && (
                    <div className="dropdownMenu">
                      {seedTypes.map((seed, index) => (
                        <div
                          key={index}
                          className={`dropdownItem ${
                            form.seedType === seed ? 'selected' : ''
                          }`}
                          onClick={() => handleSeedSelect(seed)}
                        >
                          {seed}
                        </div>
                      ))}
                      <div 
                        className="dropdownItem customOption"
                        onClick={() => setIsCustomSeed(true)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                        Add Custom Seed
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="customInputRow">
                  <input
                    type="text"
                    placeholder="Enter new seed type"
                    value={customSeed}
                    onChange={(e) => setCustomSeed(e.target.value)}
                  />
                  <div className="customButtons">
                    <button
                      type="button"
                      className="addBtn"
                      onClick={handleAddSeed}
                    >
                      <FontAwesomeIcon icon={faPlus} /> Add
                    </button>
                    <button
                      type="button"
                      className="cancelBtn"
                      onClick={() => {
                        setIsCustomSeed(false)
                        setCustomSeed('')
                      }}
                    >
                      <FontAwesomeIcon icon={faXmark} /> Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="inputGroup">
              <label>Region</label>
              {!isCustomRegion ? (
                <div className="dropdownContainer" ref={regionDropdownRef}>
                  <div 
                    className="customSelect"
                    onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
                  >
                    <span className={`selectedValue ${!form.region ? 'placeholder' : ''}`}>
                      {form.region || 'Select region'}
                    </span>
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className={`dropdownIcon ${isRegionDropdownOpen ? 'open' : ''}`}
                    />
                  </div>
                  
                  {isRegionDropdownOpen && (
                    <div className="dropdownMenu">
                      {regions.map((region, index) => (
                        <div
                          key={index}
                          className={`dropdownItem ${
                            form.region === region ? 'selected' : ''
                          }`}
                          onClick={() => handleRegionSelect(region)}
                        >
                          {region}
                        </div>
                      ))}
                      <div 
                        className="dropdownItem customOption"
                        onClick={() => setIsCustomRegion(true)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                        Add Custom Region
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="customInputRow">
                  <input
                    type="text"
                    placeholder="Enter new region"
                    value={customRegion}
                    onChange={(e) => setCustomRegion(e.target.value)}
                  />
                  <div className="customButtons">
                    <button
                      type="button"
                      className="addBtn"
                      onClick={handleAddRegion}
                    >
                      <FontAwesomeIcon icon={faPlus} /> Add
                    </button>
                    <button
                      type="button"
                      className="cancelBtn"
                      onClick={() => {
                        setIsCustomRegion(false)
                        setCustomRegion('')
                      }}
                    >
                      <FontAwesomeIcon icon={faXmark} /> Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Male & Female Packets */}
          <div className="inputRow">
            <div className="inputGroup">
              <label>Male Packets Count</label>
              <input
                type="number"
                name="malePackets"
                value={form.malePackets}
                onChange={handleChange}
                placeholder="Enter count"
                min="0"
                required
              />
            </div>

            <div className="inputGroup">
              <label>Female Packets Count</label>
              <input
                type="number"
                name="femalePackets"
                value={form.femalePackets}
                onChange={handleChange}
                placeholder="Enter count"
                min="0"
                required
              />
            </div>
          </div>

          {/* Sowing Dates */}
          <div className="inputRow">
            <div className="inputGroup">
              <label>Date of Sowing (Male)</label>
              <div 
                className="dateInputContainer"
                onClick={() => handleDateContainerClick(sowingDateMaleRef)}
              >
                <input
                  ref={sowingDateMaleRef}
                  type="date"
                  name="sowingDateMale"
                  value={form.sowingDateMale}
                  onChange={handleChange}
                  required
                />
                <FontAwesomeIcon icon={faCalendar} className="calendarIcon" />
              </div>
            </div>

            <div className="inputGroup">
              <label>Date of Sowing (Female)</label>
              <div 
                className="dateInputContainer"
                onClick={() => handleDateContainerClick(sowingDateFemaleRef)}
              >
                <input
                  ref={sowingDateFemaleRef}
                  type="date"
                  name="sowingDateFemale"
                  value={form.sowingDateFemale}
                  onChange={handleChange}
                  required
                />
                <FontAwesomeIcon icon={faCalendar} className="calendarIcon" />
              </div>
            </div>
          </div>

          {/* Detaching Dates */}
          <div className="inputRow">
            <div className="inputGroup">
              <label>First Detaching Date</label>
              <div 
                className="dateInputContainer"
                onClick={() => handleDateContainerClick(firstDetachingDateRef)}
              >
                <input
                  ref={firstDetachingDateRef}
                  type="date"
                  name="firstDetachingDate"
                  value={form.firstDetachingDate}
                  onChange={handleChange}
                  required
                />
                <FontAwesomeIcon icon={faCalendar} className="calendarIcon" />
              </div>
            </div>

            <div className="inputGroup">
              <label>Second Detaching Date</label>
              <div 
                className="dateInputContainer"
                onClick={() => handleDateContainerClick(secondDetachingDateRef)}
              >
                <input
                  ref={secondDetachingDateRef}
                  type="date"
                  name="secondDetachingDate"
                  value={form.secondDetachingDate}
                  onChange={handleChange}
                  required
                />
                <FontAwesomeIcon icon={faCalendar} className="calendarIcon" />
              </div>
            </div>
          </div>

          {/* Pesticide & Harvesting Date */}
          <div className="inputRow">
            <div className="inputGroup">
              <label>Pesticides/Fertilizers</label>
              {!isCustomPesticide ? (
                <div className="dropdownContainer" ref={pesticideDropdownRef}>
                  <div 
                    className="customSelect"
                    onClick={() => setIsPesticideDropdownOpen(!isPesticideDropdownOpen)}
                  >
                    <span className={`selectedValue ${!form.pesticide ? 'placeholder' : ''}`}>
                      {form.pesticide || 'Select pesticide'}
                    </span>
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className={`dropdownIcon ${isPesticideDropdownOpen ? 'open' : ''}`}
                    />
                  </div>
                  
                  {isPesticideDropdownOpen && (
                    <div className="dropdownMenu">
                      {pesticides.map((pesticide, index) => (
                        <div
                          key={index}
                          className={`dropdownItem ${
                            form.pesticide === pesticide ? 'selected' : ''
                          }`}
                          onClick={() => handlePesticideSelect(pesticide)}
                        >
                          {pesticide}
                        </div>
                      ))}
                      <div 
                        className="dropdownItem customOption"
                        onClick={() => setIsCustomPesticide(true)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                        Add Custom Pesticide
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="customInputRow">
                  <input
                    type="text"
                    placeholder="Enter new pesticide"
                    value={customPesticide}
                    onChange={(e) => setCustomPesticide(e.target.value)}
                  />
                  <div className="customButtons">
                    <button
                      type="button"
                      className="addBtn"
                      onClick={handleAddPesticide}
                    >
                      <FontAwesomeIcon icon={faPlus} /> Add
                    </button>
                    <button
                      type="button"
                      className="cancelBtn"
                      onClick={() => {
                        setIsCustomPesticide(false)
                        setCustomPesticide('')
                      }}
                    >
                      <FontAwesomeIcon icon={faXmark} /> Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="inputGroup">
              <label>Date of Harvesting</label>
              <div 
                className="dateInputContainer"
                onClick={() => handleDateContainerClick(harvestingDateRef)}
              >
                <input
                  ref={harvestingDateRef}
                  type="date"
                  name="harvestingDate"
                  value={form.harvestingDate}
                  onChange={handleChange}
                  required
                />
                <FontAwesomeIcon icon={faCalendar} className="calendarIcon" />
              </div>
            </div>
          </div>

          {/* Acres, Payment & Yield - Three Items Row */}
          <div className="inputRow threeColumns">
            <div className="inputGroup">
              <label>Acres</label>
              <input
                type="number"
                name="acres"
                value={form.acres}
                onChange={handleChange}
                placeholder="Enter acres"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="inputGroup">
              <label>Payment (₹)</label>
              <input
                type="number"
                name="payment"
                value={form.payment}
                onChange={handleChange}
                placeholder="Enter amount"
                min="0"
                required
              />
            </div>

            <div className="inputGroup">
              <label>Yield (kg)</label>
              <input
                type="number"
                name="yield"
                value={form.yield}
                onChange={handleChange}
                placeholder="Enter yield"
                min="0"
                required
              />
            </div>
          </div>

          <button type="submit" className="createBtn">
            Create Crop
          </button>
        </form>
      </div>
    </div>
  )
}
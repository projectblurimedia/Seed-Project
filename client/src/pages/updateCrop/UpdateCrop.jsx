import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './updateCrop.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faPlus, faXmark, faChevronDown, faCalendar, faTrash } from '@fortawesome/free-solid-svg-icons'

export const UpdateCrop = () => {
  const { aadhar } = useParams()
  const navigate = useNavigate()

  const [seedTypes, setSeedTypes] = useState(['Babycorn Seed', 'Popcorn', 'Maize 161', 'Sweet Corn', 'Field Corn'])
  const [regions, setRegions] = useState(['Jangareddygudem', 'Vijayanagaram'])
  const [pesticides, setPesticides] = useState(['Urea', 'DAP', 'NPK', 'Organic Manure', 'Potassium Nitrate'])
  
  // Static crop data that will pre-fill the form
  const staticCropData = {
    seedType: 'Babycorn Seed',
    region: 'Jangareddygudem',
    acres: '5.5',
    malePackets: '25',
    femalePackets: '30',
    sowingDateMale: '2024-03-15',
    sowingDateFemale: '2024-03-20',
    firstDetachingDate: '2024-04-10',
    secondDetachingDate: '2024-04-25',
    harvestingDate: '2024-06-15',
    payment: '25000',
    yield: '1200'
  }

  const staticPesticideEntries = [
    { pesticide: 'Urea', quantity: '50', amount: '1500' },
    { pesticide: 'DAP', quantity: '25', amount: '2000' }
  ]

  const staticCoolieEntries = [
    { count: '5', amount: '2500' },
    { count: '3', amount: '1500' }
  ]

  const [form, setForm] = useState(staticCropData)
  const [pesticideEntries, setPesticideEntries] = useState(staticPesticideEntries)
  const [coolieEntries, setCoolieEntries] = useState(staticCoolieEntries)
  
  const [isCustomSeed, setIsCustomSeed] = useState(false)
  const [isCustomRegion, setIsCustomRegion] = useState(false)
  const [isCustomPesticide, setIsCustomPesticide] = useState(false)
  const [customSeed, setCustomSeed] = useState('')
  const [customRegion, setCustomRegion] = useState('')
  const [customPesticide, setCustomPesticide] = useState('')
  const [isSeedDropdownOpen, setIsSeedDropdownOpen] = useState(false)
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false)
  const [isPesticideDropdownOpen, setIsPesticideDropdownOpen] = useState(false)

  const [showPesticideForm, setShowPesticideForm] = useState(true)
  const [showCoolieForm, setShowCoolieForm] = useState(true)

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

  const handlePesticideChange = (index, field, value) => {
    const updatedEntries = [...pesticideEntries]
    updatedEntries[index] = { ...updatedEntries[index], [field]: value }
    setPesticideEntries(updatedEntries)
  }

  const handleCoolieChange = (index, field, value) => {
    const updatedEntries = [...coolieEntries]
    updatedEntries[index] = { ...updatedEntries[index], [field]: value }
    setCoolieEntries(updatedEntries)
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
    }
    setCustomPesticide('')
    setIsCustomPesticide(false)
  }

  const handleAddPesticideEntry = () => {
    setPesticideEntries(prev => [...prev, { pesticide: '', quantity: '', amount: '' }])
    setShowPesticideForm(true)
  }

  const handleRemovePesticideEntry = (index) => {
    setPesticideEntries(prev => prev.filter((_, i) => i !== index))
    if (pesticideEntries.length === 1) {
      setShowPesticideForm(false)
    }
  }

  const handleAddCoolieEntry = () => {
    setCoolieEntries(prev => [...prev, { count: '', amount: '' }])
    setShowCoolieForm(true)
  }

  const handleRemoveCoolieEntry = (index) => {
    setCoolieEntries(prev => prev.filter((_, i) => i !== index))
    if (coolieEntries.length === 1) {
      setShowCoolieForm(false)
    }
  }

  const handleUndo = () => navigate(-1)

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = {
      ...form,
      pesticideEntries,
      coolieEntries
    }
    alert(`✅ Crop Updated Successfully!\n\nFarmer Aadhar: ${aadhar}\n${JSON.stringify(formData, null, 2)}`)
    navigate('/') // Navigate back to home or crops list
  }

  const handleSelect = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (field === 'seedType') setIsSeedDropdownOpen(false)
    if (field === 'region') setIsRegionDropdownOpen(false)
  }

  const handlePesticideSelect = (index, value) => {
    handlePesticideChange(index, 'pesticide', value)
    setIsPesticideDropdownOpen(false)
  }

  const handleDateContainerClick = (dateRef) => dateRef.current?.showPicker()

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (seedDropdownRef.current && !seedDropdownRef.current.contains(e.target)) setIsSeedDropdownOpen(false)
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(e.target)) setIsRegionDropdownOpen(false)
      if (pesticideDropdownRef.current && !pesticideDropdownRef.current.contains(e.target)) setIsPesticideDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="updateCropContainer">
      <div className="formCard">
        <div className="formHeader">
          <button className="undoBtn" onClick={handleUndo}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h2>Update Crop</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Seed & Region */}
          <div className="inputRow">
            {/* Seed */}
            <div className="inputGroup">
              <label>Seed Type</label>
              {!isCustomSeed ? (
                <div className="dropdownContainer" ref={seedDropdownRef}>
                  <div className="customSelect" onClick={() => setIsSeedDropdownOpen(!isSeedDropdownOpen)}>
                    <span className={`selectedValue ${!form.seedType ? 'placeholder' : ''}`}>
                      {form.seedType || 'Select seed type'}
                    </span>
                    <FontAwesomeIcon icon={faChevronDown} className={`dropdownIcon ${isSeedDropdownOpen ? 'open' : ''}`} />
                  </div>
                  {isSeedDropdownOpen && (
                    <div className="dropdownMenu">
                      {seedTypes.map((seed, i) => (
                        <div key={i} className={`dropdownItem ${form.seedType === seed ? 'selected' : ''}`} onClick={() => handleSelect('seedType', seed)}>
                          {seed}
                        </div>
                      ))}
                      <div className="dropdownItem customOption" onClick={() => setIsCustomSeed(true)}>
                        <FontAwesomeIcon icon={faPlus} /> Add Custom Seed
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="customInputRow">
                  <input type="text" placeholder="Enter new seed type" value={customSeed} onChange={(e) => setCustomSeed(e.target.value)} />
                  <div className="customButtons">
                    <button type="button" className="addBtn" onClick={handleAddSeed}>
                      <FontAwesomeIcon icon={faPlus} /> Add
                    </button>
                    <button type="button" className="cancelBtn" onClick={() => { setIsCustomSeed(false); setCustomSeed('') }}>
                      <FontAwesomeIcon icon={faXmark} /> Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Region */}
            <div className="inputGroup">
              <label>Region</label>
              {!isCustomRegion ? (
                <div className="dropdownContainer" ref={regionDropdownRef}>
                  <div className="customSelect" onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}>
                    <span className={`selectedValue ${!form.region ? 'placeholder' : ''}`}>
                      {form.region || 'Select region'}
                    </span>
                    <FontAwesomeIcon icon={faChevronDown} className={`dropdownIcon ${isRegionDropdownOpen ? 'open' : ''}`} />
                  </div>
                  {isRegionDropdownOpen && (
                    <div className="dropdownMenu">
                      {regions.map((region, i) => (
                        <div key={i} className={`dropdownItem ${form.region === region ? 'selected' : ''}`} onClick={() => handleSelect('region', region)}>
                          {region}
                        </div>
                      ))}
                      <div className="dropdownItem customOption" onClick={() => setIsCustomRegion(true)}>
                        <FontAwesomeIcon icon={faPlus} /> Add Custom Region
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="customInputRow">
                  <input type="text" placeholder="Enter new region" value={customRegion} onChange={(e) => setCustomRegion(e.target.value)} />
                  <div className="customButtons">
                    <button type="button" className="addBtn" onClick={handleAddRegion}>
                      <FontAwesomeIcon icon={faPlus} /> Add
                    </button>
                    <button type="button" className="cancelBtn" onClick={() => { setIsCustomRegion(false); setCustomRegion('') }}>
                      <FontAwesomeIcon icon={faXmark} /> Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Male/Female Packets */}
          <div className="inputRow">
            <div className="inputGroup">
              <label>Male Packets Count</label>
              <input type="number" name="malePackets" value={form.malePackets} onChange={handleChange} placeholder="Enter count" min="0" required />
            </div>
            <div className="inputGroup">
              <label>Female Packets Count</label>
              <input type="number" name="femalePackets" value={form.femalePackets} onChange={handleChange} placeholder="Enter count" min="0" required />
            </div>
          </div>

          {/* Sowing Dates */}
          <div className="inputRow">
            <div className="inputGroup">
              <label>Date of Sowing (Male)</label>
              <div className="dateInputContainer" onClick={() => handleDateContainerClick(sowingDateMaleRef)}>
                <input ref={sowingDateMaleRef} type="date" name="sowingDateMale" value={form.sowingDateMale} onChange={handleChange} required />
                <FontAwesomeIcon icon={faCalendar} className="calendarIcon" />
              </div>
            </div>
            <div className="inputGroup">
              <label>Date of Sowing (Female)</label>
              <div className="dateInputContainer" onClick={() => handleDateContainerClick(sowingDateFemaleRef)}>
                <input ref={sowingDateFemaleRef} type="date" name="sowingDateFemale" value={form.sowingDateFemale} onChange={handleChange} required />
                <FontAwesomeIcon icon={faCalendar} className="calendarIcon" />
              </div>
            </div>
          </div>

          {/* Detaching Dates */}
          <div className="inputRow">
            <div className="inputGroup">
              <label>First Detaching Date</label>
              <div className="dateInputContainer" onClick={() => handleDateContainerClick(firstDetachingDateRef)}>
                <input ref={firstDetachingDateRef} type="date" name="firstDetachingDate" value={form.firstDetachingDate} onChange={handleChange} required />
                <FontAwesomeIcon icon={faCalendar} className="calendarIcon" />
              </div>
            </div>
            <div className="inputGroup">
              <label>Second Detaching Date</label>
              <div className="dateInputContainer" onClick={() => handleDateContainerClick(secondDetachingDateRef)}>
                <input ref={secondDetachingDateRef} type="date" name="secondDetachingDate" value={form.secondDetachingDate} onChange={handleChange} required />
                <FontAwesomeIcon icon={faCalendar} className="calendarIcon" />
              </div>
            </div>
          </div>

          {/* Acres + Harvesting */}
          <div className="inputRow">
            <div className="inputGroup">
              <label>Acres</label>
              <input type="number" name="acres" value={form.acres} onChange={handleChange} placeholder="Enter acres" min="0" step="0.01" required />
            </div>
            <div className="inputGroup">
              <label>Date of Harvesting</label>
              <div className="dateInputContainer" onClick={() => handleDateContainerClick(harvestingDateRef)}>
                <input ref={harvestingDateRef} type="date" name="harvestingDate" value={form.harvestingDate} onChange={handleChange} required />
                <FontAwesomeIcon icon={faCalendar} className="calendarIcon" />
              </div>
            </div>
          </div>

          {/* Payment & Yield */}
          <div className="inputRow">
            <div className="inputGroup">
              <label>Payment (₹)</label>
              <input type="number" name="payment" value={form.payment} onChange={handleChange} placeholder="Enter amount" min="0" required />
            </div>
            <div className="inputGroup">
              <label>Yield (kg)</label>
              <input type="number" name="yield" value={form.yield} onChange={handleChange} placeholder="Enter yield" min="0" required />
            </div>
          </div>

          {/* Pesticide Section */}
          <div className="section">
            {!showPesticideForm ? (
              <button type="button" className="addSectionBtn" onClick={handleAddPesticideEntry}>
                <FontAwesomeIcon icon={faPlus} /> Add Pesticides/Fertilizers
              </button>
            ) : (
              <div className="dynamicSection">
                <div className="sectionHeader">
                  <h3>Pesticides/Fertilizers</h3>
                  <button type="button" className="addEntryBtn" onClick={handleAddPesticideEntry}>
                    <FontAwesomeIcon icon={faPlus} /> Add Another
                  </button>
                </div>
                
                {pesticideEntries.map((entry, index) => (
                  <div key={index} className="pesticideEntry inputRow">
                    {/* Pesticide Dropdown - flex 1.5 */}
                    <div className="inputGroup pesticideDropdown">
                      <label>Pesticide/Fertilizer</label>
                      {!isCustomPesticide ? (
                        <div className="dropdownContainer" ref={pesticideDropdownRef}>
                          <div className="customSelect" onClick={() => setIsPesticideDropdownOpen(!isPesticideDropdownOpen)}>
                            <span className={`selectedValue ${!entry.pesticide ? 'placeholder' : ''}`}>
                              {entry.pesticide || 'Select pesticide'}
                            </span>
                            <FontAwesomeIcon icon={faChevronDown} className={`dropdownIcon ${isPesticideDropdownOpen ? 'open' : ''}`} />
                          </div>
                          {isPesticideDropdownOpen && (
                            <div className="dropdownMenu">
                              {pesticides.map((p, i) => (
                                <div key={i} className={`dropdownItem ${entry.pesticide === p ? 'selected' : ''}`} onClick={() => handlePesticideSelect(index, p)}>
                                  {p}
                                </div>
                              ))}
                              <div className="dropdownItem customOption" onClick={() => setIsCustomPesticide(true)}>
                                <FontAwesomeIcon icon={faPlus} /> Add Custom Pesticide
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="customInputRow">
                          <input type="text" placeholder="Enter new pesticide" value={customPesticide} onChange={(e) => setCustomPesticide(e.target.value)} />
                          <div className="customButtons">
                            <button type="button" className="addBtn" onClick={handleAddPesticide}>
                              <FontAwesomeIcon icon={faPlus} /> Add
                            </button>
                            <button type="button" className="cancelBtn" onClick={() => { setIsCustomPesticide(false); setCustomPesticide('') }}>
                              <FontAwesomeIcon icon={faXmark} /> Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="inputGroup">
                      <label>Quantity (kg/liters)</label>
                      <input 
                        type="number" 
                        value={entry.quantity} 
                        onChange={(e) => handlePesticideChange(index, 'quantity', e.target.value)} 
                        placeholder="Enter quantity" 
                        min="0" 
                        step="0.01" 
                      />
                    </div>

                    {/* Amount */}
                    <div className="inputGroup">
                      <label>Amount (₹)</label>
                      <input 
                        type="number" 
                        value={entry.amount} 
                        onChange={(e) => handlePesticideChange(index, 'amount', e.target.value)} 
                        placeholder="Enter amount" 
                        min="0" 
                      />
                    </div>

                    {/* Delete Button */}
                    <div className="inputGroup deleteGroup">
                      <label>&nbsp;</label>
                      <button 
                        type="button" 
                        className="removeBtn" 
                        onClick={() => handleRemovePesticideEntry(index)}
                        title="Remove this entry"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Coolies Section */}
          <div className="section">
            {!showCoolieForm ? (
              <button type="button" className="addSectionBtn" onClick={handleAddCoolieEntry}>
                <FontAwesomeIcon icon={faPlus} /> Add Coolies
              </button>
            ) : (
              <div className="dynamicSection">
                <div className="sectionHeader">
                  <h3>Coolies</h3>
                  <button type="button" className="addEntryBtn" onClick={handleAddCoolieEntry}>
                    <FontAwesomeIcon icon={faPlus} /> Add Another
                  </button>
                </div>
                
                {coolieEntries.map((entry, index) => (
                  <div key={index} className="coolieEntry inputRow">
                    {/* Coolie Count */}
                    <div className="inputGroup">
                      <label>No. of Coolies</label>
                      <input 
                        type="number" 
                        value={entry.count} 
                        onChange={(e) => handleCoolieChange(index, 'count', e.target.value)} 
                        placeholder="Enter count" 
                        min="0" 
                      />
                    </div>

                    {/* Coolie Amount */}
                    <div className="inputGroup">
                      <label>Coolie Amount (₹)</label>
                      <input 
                        type="number" 
                        value={entry.amount} 
                        onChange={(e) => handleCoolieChange(index, 'amount', e.target.value)} 
                        placeholder="Enter amount" 
                        min="0" 
                      />
                    </div>

                    {/* Delete Button */}
                    <div className="inputGroup deleteGroup">
                      <label>&nbsp;</label>
                      <button 
                        type="button" 
                        className="removeBtn" 
                        onClick={() => handleRemoveCoolieEntry(index)}
                        title="Remove this entry"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="updateBtn">Update Crop</button>
        </form>
      </div>
    </div>
  )
}
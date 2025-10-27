import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './createCrop.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faPlus, faXmark, faChevronDown, faCalendar, faTrash } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

export const CreateCrop = () => {
  const { aadhar } = useParams()
  const navigate = useNavigate()

  const [seedTypes, setSeedTypes] = useState(['Babycorn Seed', 'Popcorn', 'Maize 161', 'Sweet Corn', 'Field Corn'])
  const [regions, setRegions] = useState(['Jangareddygudem', 'Vijayanagaram'])
  const [pesticides, setPesticides] = useState(['Urea', 'DAP', 'NPK', 'Organic Manure', 'Potassium Nitrate'])
  const [paymentMethods, setPaymentMethods] = useState(['Cash', 'PhonePe', 'Bank Transfer', 'UPI', 'Cheque'])
  const [workTypes, setWorkTypes] = useState(['Sowing', 'Harvesting', 'Weeding', 'Irrigation', 'Fertilizing', 'Spraying'])
  
  const [farmerDetails, setFarmerDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
    harvestingDate: '',
    totalIncome: '',
    yield: ''
  })

  const [pesticideEntries, setPesticideEntries] = useState([])
  const [coolieEntries, setCoolieEntries] = useState([])
  const [paymentEntries, setPaymentEntries] = useState([])
  
  const [isCustomSeed, setIsCustomSeed] = useState(false)
  const [isCustomRegion, setIsCustomRegion] = useState(false)
  const [isCustomPesticide, setIsCustomPesticide] = useState(false)
  const [isCustomWorkType, setIsCustomWorkType] = useState(false)
  const [customSeed, setCustomSeed] = useState('')
  const [customRegion, setCustomRegion] = useState('')
  const [customPesticide, setCustomPesticide] = useState('')
  const [customWorkType, setCustomWorkType] = useState('')
  
  const [isSeedDropdownOpen, setIsSeedDropdownOpen] = useState(false)
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false)
  const [isPesticideDropdownOpen, setIsPesticideDropdownOpen] = useState(false)
  const [isPaymentMethodDropdownOpen, setIsPaymentMethodDropdownOpen] = useState(false)
  const [isWorkTypeDropdownOpen, setIsWorkTypeDropdownOpen] = useState(false)

  const [showPesticideForm, setShowPesticideForm] = useState(false)
  const [showCoolieForm, setShowCoolieForm] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  const seedDropdownRef = useRef(null)
  const regionDropdownRef = useRef(null)
  const pesticideDropdownRef = useRef(null)
  const paymentMethodDropdownRef = useRef(null)
  const workTypeDropdownRef = useRef(null)
  
  const sowingDateMaleRef = useRef(null)
  const sowingDateFemaleRef = useRef(null)
  const firstDetachingDateRef = useRef(null)
  const secondDetachingDateRef = useRef(null)
  const harvestingDateRef = useRef(null)

  // Fetch farmer details
  useEffect(() => {
    const fetchFarmerDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await axios.get(`/farmers/${aadhar}`)
        setFarmerDetails(res.data)
      } catch (error) {
        console.error('Error fetching farmer details:', error)
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

  const handlePaymentChange = (index, field, value) => {
    const updatedEntries = [...paymentEntries]
    updatedEntries[index] = { ...updatedEntries[index], [field]: value }
    setPaymentEntries(updatedEntries)
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

  const handleAddWorkType = () => {
    const trimmed = customWorkType.trim()
    if (trimmed && !workTypes.includes(trimmed)) {
      setWorkTypes((prev) => [...prev, trimmed])
    }
    setCustomWorkType('')
    setIsCustomWorkType(false)
  }

  const handleAddPesticideEntry = () => {
    setPesticideEntries(prev => [...prev, { pesticide: '', quantity: '', amount: '', date: '' }])
    setShowPesticideForm(true)
  }

  const handleRemovePesticideEntry = (index) => {
    setPesticideEntries(prev => prev.filter((_, i) => i !== index))
    if (pesticideEntries.length === 1) {
      setShowPesticideForm(false)
    }
  }

  const handleAddCoolieEntry = () => {
    setCoolieEntries(prev => [...prev, { work: '', count: '', amount: '', date: '', days: 1 }])
    setShowCoolieForm(true)
  }

  const handleRemoveCoolieEntry = (index) => {
    setCoolieEntries(prev => prev.filter((_, i) => i !== index))
    if (coolieEntries.length === 1) {
      setShowCoolieForm(false)
    }
  }

  const handleAddPaymentEntry = () => {
    setPaymentEntries(prev => [...prev, { amount: '', date: '', purpose: '', method: 'Cash' }])
    setShowPaymentForm(true)
  }

  const handleRemovePaymentEntry = (index) => {
    setPaymentEntries(prev => prev.filter((_, i) => i !== index))
    if (paymentEntries.length === 1) {
      setShowPaymentForm(false)
    }
  }

  const handleUndo = () => navigate(-1)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!farmerDetails) {
      alert('Farmer details not found')
      return
    }

    try {
      const cropData = {
        farmerDetails,
        ...form,
        pesticideEntries,
        coolieEntries,
        paymentEntries,
        acres: parseFloat(form.acres),
        malePackets: parseInt(form.malePackets),
        femalePackets: parseInt(form.femalePackets),
        totalIncome: parseFloat(form.totalIncome),
        yield: parseFloat(form.yield)
      }

      // Calculate totals
      const totalPesticideCost = pesticideEntries.reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0)
      const totalCoolieCost = coolieEntries.reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0)
      const totalPaymentAmount = paymentEntries.reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0)
      const netProfit = (parseFloat(form.totalIncome) || 0) - (totalPesticideCost + totalCoolieCost + totalPaymentAmount)

      const finalData = {
        ...cropData,
        totalPesticideCost,
        totalCoolieCost,
        totalPaymentAmount,
        netProfit,
        status: 'active'
      }

      
      const res = await axios.post('/crops', finalData)
      // console.log('Crop created:', res.data)
      
      // Navigate back or to crops list
      navigate(`/farmers/${aadhar}`)
      
    } catch (error) {
      console.error('Error creating crop:', error)
      alert('Error creating crop. Please try again.')
    }
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

  const handlePaymentMethodSelect = (index, value) => {
    handlePaymentChange(index, 'method', value)
    setIsPaymentMethodDropdownOpen(false)
  }

  const handleWorkTypeSelect = (index, value) => {
    handleCoolieChange(index, 'work', value)
    setIsWorkTypeDropdownOpen(false)
  }

  const handleDateContainerClick = (dateRef) => dateRef.current?.showPicker()

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (seedDropdownRef.current && !seedDropdownRef.current.contains(e.target)) setIsSeedDropdownOpen(false)
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(e.target)) setIsRegionDropdownOpen(false)
      if (pesticideDropdownRef.current && !pesticideDropdownRef.current.contains(e.target)) setIsPesticideDropdownOpen(false)
      if (paymentMethodDropdownRef.current && !paymentMethodDropdownRef.current.contains(e.target)) setIsPaymentMethodDropdownOpen(false)
      if (workTypeDropdownRef.current && !workTypeDropdownRef.current.contains(e.target)) setIsWorkTypeDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Show loading state
  if (loading) {
    return (
      <div className="createCropContainer">
        <div className="loadingState">
          <div className="spinner"></div>
          <p>Loading farmer details...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="createCropContainer">
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
    <div className="createCropContainer">
      <div className="formCard">
        <div className="formHeader">
          <button className="undoBtn" onClick={handleUndo}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h2>Create Crop</h2>
          {farmerDetails && (
            <div className="farmerInfo">
              <span>{farmerDetails.firstName} {farmerDetails.lastName}</span>
              <span>Aadhar: {farmerDetails.aadhar}</span>
            </div>
          )}
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
              <input type="number" name="malePackets" value={form.malePackets} onChange={handleChange} placeholder="Enter count" min="0"  />
            </div>
            <div className="inputGroup">
              <label>Female Packets Count</label>
              <input type="number" name="femalePackets" value={form.femalePackets} onChange={handleChange} placeholder="Enter count" min="0"  />
            </div>
          </div>

          {/* Sowing Dates */}
          <div className="inputRow">
            <div className="inputGroup">
              <label>Date of Sowing (Male)</label>
              <div className="dateInputContainer" onClick={() => handleDateContainerClick(sowingDateMaleRef)}>
                <input ref={sowingDateMaleRef} type="date" name="sowingDateMale" value={form.sowingDateMale} onChange={handleChange}  />
                <FontAwesomeIcon icon={faCalendar} className="calendarIcon" />
              </div>
            </div>
            <div className="inputGroup">
              <label>Date of Sowing (Female)</label>
              <div className="dateInputContainer" onClick={() => handleDateContainerClick(sowingDateFemaleRef)}>
                <input ref={sowingDateFemaleRef} type="date" name="sowingDateFemale" value={form.sowingDateFemale} onChange={handleChange}  />
                <FontAwesomeIcon icon={faCalendar} className="calendarIcon" />
              </div>
            </div>
          </div>

          {/* Detaching Dates */}
          <div className="inputRow">
            <div className="inputGroup">
              <label>First Detaching Date</label>
              <div className="dateInputContainer" onClick={() => handleDateContainerClick(firstDetachingDateRef)}>
                <input ref={firstDetachingDateRef} type="date" name="firstDetachingDate" value={form.firstDetachingDate} onChange={handleChange}  />
                <FontAwesomeIcon icon={faCalendar} className="calendarIcon" />
              </div>
            </div>
            <div className="inputGroup">
              <label>Second Detaching Date</label>
              <div className="dateInputContainer" onClick={() => handleDateContainerClick(secondDetachingDateRef)}>
                <input ref={secondDetachingDateRef} type="date" name="secondDetachingDate" value={form.secondDetachingDate} onChange={handleChange}  />
                <FontAwesomeIcon icon={faCalendar} className="calendarIcon" />
              </div>
            </div>
          </div>

          {/* Acres + Harvesting */}
          <div className="inputRow">
            <div className="inputGroup">
              <label>Acres</label>
              <input type="number" name="acres" value={form.acres} onChange={handleChange} placeholder="Enter acres" min="0" step="0.01"  />
            </div>
            <div className="inputGroup">
              <label>Date of Harvesting</label>
              <div className="dateInputContainer" onClick={() => handleDateContainerClick(harvestingDateRef)}>
                <input ref={harvestingDateRef} type="date" name="harvestingDate" value={form.harvestingDate} onChange={handleChange}  />
                <FontAwesomeIcon icon={faCalendar} className="calendarIcon" />
              </div>
            </div>
          </div>

          {/* Total Income & Yield */}
          <div className="inputRow">
            <div className="inputGroup">
              <label>Total Income (₹)</label>
              <input type="number" name="totalIncome" value={form.totalIncome} onChange={handleChange} placeholder="Enter total income" min="0"  />
            </div>
            <div className="inputGroup">
              <label>Yield (kg)</label>
              <input type="number" name="yield" value={form.yield} onChange={handleChange} placeholder="Enter yield" min="0"  />
            </div>
          </div>

          {/* Pesticide Section */}
          <div className="section">
            {!showPesticideForm ? (
              <button type="button" className="addSectionBtn" onClick={handleAddPesticideEntry}>
                <FontAwesomeIcon icon={faPlus} className="fa-icon" />
                Add Pesticides/Fertilizers
              </button>
            ) : (
              <div className="dynamicSection">
                <div className="sectionHeader">
                  <h3>Pesticides/Fertilizers</h3>
                  <button type="button" className="addEntryBtn" onClick={handleAddPesticideEntry}>
                    <FontAwesomeIcon icon={faPlus} /> Add Entry
                  </button>
                </div>
                
                {pesticideEntries.map((entry, index) => (
                  <div key={index} className="entryContainer">
                    <div className="entryRow">
                      {/* Pesticide Dropdown - Now takes 2/3 width */}
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

                      {/* Quantity - Takes 1/3 width */}
                      <div className="inputGroup quantityGroup">
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
                    </div>

                    <div className="entryRow">
                      {/* Amount - Takes 1/3 width */}
                      <div className="inputGroup amountGroup">
                        <label>Amount (₹)</label>
                        <input 
                          type="number" 
                          value={entry.amount} 
                          onChange={(e) => handlePesticideChange(index, 'amount', e.target.value)} 
                          placeholder="Enter amount" 
                          min="0" 
                        />
                      </div>

                      {/* Date - Takes 1/3 width */}
                      <div className="inputGroup">
                        <label>Date</label>
                        <input 
                          type="date" 
                          value={entry.date} 
                          onChange={(e) => handlePesticideChange(index, 'date', e.target.value)} 
                        />
                      </div>
                    </div>

                    {/* Delete Button - Full Width */}
                    <div className="entryRow">
                      <div className="inputGroup fullWidth">
                        <button 
                          type="button" 
                          className="removeBtn fullWidth" 
                          onClick={() => handleRemovePesticideEntry(index)}
                        >
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                      </div>
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
                    <FontAwesomeIcon icon={faPlus} /> Add Entry
                  </button>
                </div>
                
                {coolieEntries.map((entry, index) => (
                  <div key={index} className="entryContainer">
                    <div className="entryRow">
                      {/* Work Type Dropdown - Full Width */}
                      <div className="inputGroup fullWidth">
                        <label>Work Type</label>
                        {!isCustomWorkType ? (
                          <div className="dropdownContainer" ref={workTypeDropdownRef}>
                            <div className="customSelect" onClick={() => setIsWorkTypeDropdownOpen(!isWorkTypeDropdownOpen)}>
                              <span className={`selectedValue ${!entry.work ? 'placeholder' : ''}`}>
                                {entry.work || 'Select work type'}
                              </span>
                              <FontAwesomeIcon icon={faChevronDown} className={`dropdownIcon ${isWorkTypeDropdownOpen ? 'open' : ''}`} />
                            </div>
                            {isWorkTypeDropdownOpen && (
                              <div className="dropdownMenu">
                                {workTypes.map((work, i) => (
                                  <div key={i} className={`dropdownItem ${entry.work === work ? 'selected' : ''}`} onClick={() => handleWorkTypeSelect(index, work)}>
                                    {work}
                                  </div>
                                ))}
                                <div className="dropdownItem customOption" onClick={() => setIsCustomWorkType(true)}>
                                  <FontAwesomeIcon icon={faPlus} /> Add Custom Work Type
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="customInputRow">
                            <input type="text" placeholder="Enter new work type" value={customWorkType} onChange={(e) => setCustomWorkType(e.target.value)} />
                            <div className="customButtons">
                              <button type="button" className="addBtn" onClick={handleAddWorkType}>
                                <FontAwesomeIcon icon={faPlus} /> Add
                              </button>
                              <button type="button" className="cancelBtn" onClick={() => { setIsCustomWorkType(false); setCustomWorkType('') }}>
                                <FontAwesomeIcon icon={faXmark} /> Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="entryRow">
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

                      {/* Days */}
                      <div className="inputGroup">
                        <label>Days</label>
                        <input 
                          type="number" 
                          value={entry.days} 
                          onChange={(e) => handleCoolieChange(index, 'days', e.target.value)} 
                          placeholder="Days" 
                          min="1" 
                        />
                      </div>
                    </div>

                    <div className="entryRow">
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

                      {/* Date */}
                      <div className="inputGroup">
                        <label>Date</label>
                        <input 
                          type="date" 
                          value={entry.date} 
                          onChange={(e) => handleCoolieChange(index, 'date', e.target.value)} 
                        />
                      </div>
                    </div>

                    {/* Delete Button - Full Width */}
                    <div className="entryRow">
                      <div className="inputGroup fullWidth">
                        <button 
                          type="button" 
                          className="removeBtn fullWidth" 
                          onClick={() => handleRemoveCoolieEntry(index)}
                        >
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payments Section */}
          <div className="section">
            {!showPaymentForm ? (
              <button type="button" className="addSectionBtn" onClick={handleAddPaymentEntry}>
                <FontAwesomeIcon icon={faPlus} /> Add Payments
              </button>
            ) : (
              <div className="dynamicSection">
                <div className="sectionHeader">
                  <h3>Payments</h3>
                  <button type="button" className="addEntryBtn" onClick={handleAddPaymentEntry}>
                    <FontAwesomeIcon icon={faPlus} /> Add Entry
                  </button>
                </div>
                
                {paymentEntries.map((entry, index) => (
                  <div key={index} className="entryContainer">
                    <div className="entryRow">
                      {/* Amount */}
                      <div className="inputGroup">
                        <label>Amount (₹)</label>
                        <input 
                          type="number" 
                          value={entry.amount} 
                          onChange={(e) => handlePaymentChange(index, 'amount', e.target.value)} 
                          placeholder="Enter amount" 
                          min="0" 
                           
                        />
                      </div>

                      {/* Date */}
                      <div className="inputGroup">
                        <label>Date</label>
                        <input 
                          type="date" 
                          value={entry.date} 
                          onChange={(e) => handlePaymentChange(index, 'date', e.target.value)} 
                           
                        />
                      </div>
                    </div>

                    <div className="entryRow">
                      {/* Purpose */}
                      <div className="inputGroup">
                        <label>Purpose</label>
                        <input 
                          type="text" 
                          value={entry.purpose} 
                          onChange={(e) => handlePaymentChange(index, 'purpose', e.target.value)} 
                          placeholder="Payment purpose" 
                           
                        />
                      </div>

                      {/* Payment Method */}
                      <div className="inputGroup">
                        <label>Payment Method</label>
                        <div className="dropdownContainer" ref={paymentMethodDropdownRef}>
                          <div className="customSelect" onClick={() => setIsPaymentMethodDropdownOpen(!isPaymentMethodDropdownOpen)}>
                            <span className={`selectedValue ${!entry.method ? 'placeholder' : ''}`}>
                              {entry.method || 'Select method'}
                            </span>
                            <FontAwesomeIcon icon={faChevronDown} className={`dropdownIcon ${isPaymentMethodDropdownOpen ? 'open' : ''}`} />
                          </div>
                          {isPaymentMethodDropdownOpen && (
                            <div className="dropdownMenu">
                              {paymentMethods.map((method, i) => (
                                <div key={i} className={`dropdownItem ${entry.method === method ? 'selected' : ''}`} onClick={() => handlePaymentMethodSelect(index, method)}>
                                  {method}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Delete Button - Full Width */}
                    <div className="entryRow">
                      <div className="inputGroup fullWidth">
                        <button 
                          type="button" 
                          className="removeBtn fullWidth" 
                          onClick={() => handleRemovePaymentEntry(index)}
                        >
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="createBtn">Create Crop</button>
        </form>
      </div>
    </div>
  )
}
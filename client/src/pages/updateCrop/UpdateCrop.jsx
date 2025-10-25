import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './updateCrop.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faPlus, faXmark, faChevronDown, faCalendar, faTrash, faChevronUp } from '@fortawesome/free-solid-svg-icons'

export const UpdateCrop = () => {
  const { aadhar } = useParams()
  const navigate = useNavigate()

  const [seedTypes, setSeedTypes] = useState(['Babycorn Seed', 'Popcorn', 'Maize 161', 'Sweet Corn', 'Field Corn'])
  const [regions, setRegions] = useState(['Jangareddygudem', 'Vijayanagaram'])
  const [pesticides, setPesticides] = useState(['Urea', 'DAP', 'NPK', 'Organic Manure', 'Potassium Nitrate'])
  const [paymentMethods, setPaymentMethods] = useState(['Cash', 'PhonePe', 'Bank Transfer', 'UPI', 'Cheque'])
  const [workTypes, setWorkTypes] = useState(['Field Preparation', 'Sowing Work', 'Weeding & Maintenance', 'Harvesting Labor'])

  // Static crop data
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
    totalIncome: '25000',
    yield: '1200'
  }

  const staticPesticideEntries = [
    { pesticide: 'Urea', quantity: '50', amount: '1500', date: '2024-03-25' },
    { pesticide: 'DAP', quantity: '25', amount: '2000', date: '2024-04-05' }
  ]

  const staticCoolieEntries = [
    { count: '5', amount: '2500', date: '2024-03-15', days: '2', work: 'Field Preparation' },
    { count: '3', amount: '1500', date: '2024-06-15', days: '1', work: 'Harvesting Labor' }
  ]

  const staticPaymentEntries = [
    { amount: '10000', date: '2024-03-15', purpose: 'Advance Payment', method: 'Cash' },
    { amount: '8000', date: '2024-05-20', purpose: 'Progress Payment', method: 'PhonePe' }
  ]

  const [form, setForm] = useState(staticCropData)
  const [pesticideEntries, setPesticideEntries] = useState(staticPesticideEntries)
  const [coolieEntries, setCoolieEntries] = useState(staticCoolieEntries)
  const [paymentEntries, setPaymentEntries] = useState(staticPaymentEntries)
  
  // State for custom inputs
  const [isCustomSeed, setIsCustomSeed] = useState(false)
  const [isCustomRegion, setIsCustomRegion] = useState(false)
  const [isCustomPesticide, setIsCustomPesticide] = useState(null)
  const [isCustomWork, setIsCustomWork] = useState(null)
  const [customSeed, setCustomSeed] = useState('')
  const [customRegion, setCustomRegion] = useState('')
  const [customPesticide, setCustomPesticide] = useState('')
  const [customWork, setCustomWork] = useState('')

  // State for dropdowns with individual control
  const [openDropdowns, setOpenDropdowns] = useState({
    seed: false,
    region: false,
    pesticide: null,
    coolieWork: null,
    paymentMethod: null
  })

  // State for section visibility
  const [sectionVisibility, setSectionVisibility] = useState({
    pesticides: true,
    coolies: true,
    payments: true
  })

  // State for individual entry visibility
  const [entryVisibility, setEntryVisibility] = useState({
    pesticides: pesticideEntries.map(() => true),
    coolies: coolieEntries.map(() => true),
    payments: paymentEntries.map(() => true)
  })

  const seedDropdownRef = useRef(null)
  const regionDropdownRef = useRef(null)
  const pesticideDropdownRefs = useRef([])
  const coolieWorkDropdownRefs = useRef([])
  const paymentMethodDropdownRefs = useRef([])

  // Date refs
  const sowingDateMaleRef = useRef(null)
  const sowingDateFemaleRef = useRef(null)
  const firstDetachingDateRef = useRef(null)
  const secondDetachingDateRef = useRef(null)
  const harvestingDateRef = useRef(null)

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Handle array entry changes
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

  // Custom item handlers
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
    if (trimmed && !pesticides.includes(trimmed) && isCustomPesticide !== null) {
      setPesticides((prev) => [...prev, trimmed])
      handlePesticideChange(isCustomPesticide, 'pesticide', trimmed)
    }
    setCustomPesticide('')
    setIsCustomPesticide(null)
  }

  const handleAddWork = () => {
    const trimmed = customWork.trim()
    if (trimmed && !workTypes.includes(trimmed) && isCustomWork !== null) {
      setWorkTypes((prev) => [...prev, trimmed])
      handleCoolieChange(isCustomWork, 'work', trimmed)
    }
    setCustomWork('')
    setIsCustomWork(null)
  }

  // Entry management
  const handleAddPesticideEntry = () => {
    setPesticideEntries(prev => [...prev, { pesticide: '', quantity: '', amount: '', date: '' }])
    setEntryVisibility(prev => ({
      ...prev,
      pesticides: [...prev.pesticides, true]
    }))
  }

  const handleRemovePesticideEntry = (index) => {
    setPesticideEntries(prev => prev.filter((_, i) => i !== index))
    setEntryVisibility(prev => ({
      ...prev,
      pesticides: prev.pesticides.filter((_, i) => i !== index)
    }))
  }

  const handleAddCoolieEntry = () => {
    setCoolieEntries(prev => [...prev, { count: '', amount: '', date: '', days: '1', work: '' }])
    setEntryVisibility(prev => ({
      ...prev,
      coolies: [...prev.coolies, true]
    }))
  }

  const handleRemoveCoolieEntry = (index) => {
    setCoolieEntries(prev => prev.filter((_, i) => i !== index))
    setEntryVisibility(prev => ({
      ...prev,
      coolies: prev.coolies.filter((_, i) => i !== index)
    }))
  }

  const handleAddPaymentEntry = () => {
    setPaymentEntries(prev => [...prev, { amount: '', date: '', purpose: '', method: 'Cash' }])
    setEntryVisibility(prev => ({
      ...prev,
      payments: [...prev.payments, true]
    }))
  }

  const handleRemovePaymentEntry = (index) => {
    setPaymentEntries(prev => prev.filter((_, i) => i !== index))
    setEntryVisibility(prev => ({
      ...prev,
      payments: prev.payments.filter((_, i) => i !== index)
    }))
  }

  // Dropdown handlers
  const toggleDropdown = (type, index = null) => {
    setOpenDropdowns(prev => {
      if (index !== null) {
        if (prev[type] === index) {
          return { ...prev, [type]: null }
        } else {
          return { ...prev, [type]: index }
        }
      } else {
        return { ...prev, [type]: !prev[type] }
      }
    })
  }

  const handleSelect = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setOpenDropdowns(prev => ({ ...prev, [field === 'seedType' ? 'seed' : 'region']: false }))
  }

  const handlePesticideSelect = (index, value) => {
    handlePesticideChange(index, 'pesticide', value)
    setOpenDropdowns(prev => ({ ...prev, pesticide: null }))
  }

  const handleWorkSelect = (index, value) => {
    handleCoolieChange(index, 'work', value)
    setOpenDropdowns(prev => ({ ...prev, coolieWork: null }))
  }

  const handlePaymentMethodSelect = (index, value) => {
    handlePaymentChange(index, 'method', value)
    setOpenDropdowns(prev => ({ ...prev, paymentMethod: null }))
  }

  // Section visibility handlers
  const toggleSection = (section) => {
    setSectionVisibility(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const toggleEntryVisibility = (section, index) => {
    setEntryVisibility(prev => ({
      ...prev,
      [section]: prev[section].map((visible, i) => i === index ? !visible : visible)
    }))
  }

  const handleDateContainerClick = (dateRef) => dateRef.current?.showPicker()

  const handleUndo = () => navigate(-1)

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = {
      ...form,
      pesticideEntries,
      coolieEntries,
      paymentEntries
    }
    alert(`✅ Crop Updated Successfully!\n\nFarmer Aadhar: ${aadhar}\n${JSON.stringify(formData, null, 2)}`)
    navigate('/')
  }

  // Fixed: Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      const refs = [
        seedDropdownRef.current, 
        regionDropdownRef.current, 
        ...(pesticideDropdownRefs.current || []), 
        ...(coolieWorkDropdownRefs.current || []),
        ...(paymentMethodDropdownRefs.current || [])
      ].filter(ref => ref)

      const isOutside = refs.every(ref => ref && !ref.contains(e.target))
      
      if (isOutside) {
        setOpenDropdowns({
          seed: false,
          region: false,
          pesticide: null,
          coolieWork: null,
          paymentMethod: null
        })
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Initialize ref arrays
  useEffect(() => {
    pesticideDropdownRefs.current = pesticideDropdownRefs.current.slice(0, pesticideEntries.length)
    coolieWorkDropdownRefs.current = coolieWorkDropdownRefs.current.slice(0, coolieEntries.length)
    paymentMethodDropdownRefs.current = paymentMethodDropdownRefs.current.slice(0, paymentEntries.length)
  }, [pesticideEntries.length, coolieEntries.length, paymentEntries.length])

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
                  <div className="customSelect" onClick={() => toggleDropdown('seed')}>
                    <span className={`selectedValue ${!form.seedType ? 'placeholder' : ''}`}>
                      {form.seedType || 'Select seed type'}
                    </span>
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className={`dropdownIcon ${openDropdowns.seed ? 'open' : ''}`} 
                    />
                  </div>
                  {openDropdowns.seed && (
                    <div className="dropdownMenu">
                      {seedTypes.map((seed, i) => (
                        <div 
                          key={i} 
                          className={`dropdownItem ${form.seedType === seed ? 'selected' : ''}`} 
                          onClick={() => handleSelect('seedType', seed)}
                        >
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
                  <input 
                    type="text" 
                    placeholder="Enter new seed type" 
                    value={customSeed} 
                    onChange={(e) => setCustomSeed(e.target.value)} 
                  />
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
                  <div className="customSelect" onClick={() => toggleDropdown('region')}>
                    <span className={`selectedValue ${!form.region ? 'placeholder' : ''}`}>
                      {form.region || 'Select region'}
                    </span>
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className={`dropdownIcon ${openDropdowns.region ? 'open' : ''}`} 
                    />
                  </div>
                  {openDropdowns.region && (
                    <div className="dropdownMenu">
                      {regions.map((region, i) => (
                        <div 
                          key={i} 
                          className={`dropdownItem ${form.region === region ? 'selected' : ''}`} 
                          onClick={() => handleSelect('region', region)}
                        >
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
                  <input 
                    type="text" 
                    placeholder="Enter new region" 
                    value={customRegion} 
                    onChange={(e) => setCustomRegion(e.target.value)} 
                  />
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
              <input 
                type="number" 
                name="malePackets" 
                value={form.malePackets} 
                onChange={handleChange} 
                placeholder="Enter count" 
                min="0" 
                required 
                className="number-input"
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
                className="number-input"
              />
            </div>
          </div>

          {/* Sowing Dates */}
          <div className="inputRow">
            <div className="inputGroup">
              <label>Date of Sowing (Male)</label>
              <div className="dateInputContainer" onClick={() => handleDateContainerClick(sowingDateMaleRef)}>
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
              <div className="dateInputContainer" onClick={() => handleDateContainerClick(sowingDateFemaleRef)}>
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
              <div className="dateInputContainer" onClick={() => handleDateContainerClick(firstDetachingDateRef)}>
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
              <div className="dateInputContainer" onClick={() => handleDateContainerClick(secondDetachingDateRef)}>
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

          {/* Acres + Harvesting */}
          <div className="inputRow">
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
                className="number-input"
              />
            </div>
            <div className="inputGroup">
              <label>Date of Harvesting</label>
              <div className="dateInputContainer" onClick={() => handleDateContainerClick(harvestingDateRef)}>
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

          {/* Total Income & Yield */}
          <div className="inputRow">
            <div className="inputGroup">
              <label>Total Income (₹)</label>
              <input 
                type="number" 
                name="totalIncome" 
                value={form.totalIncome} 
                onChange={handleChange} 
                placeholder="Enter total income" 
                min="0" 
                required 
                className="number-input"
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
                className="number-input"
              />
            </div>
          </div>

          {/* Pesticide Section */}
          <div className={`section pesticides-section ${sectionVisibility.pesticides ? 'open' : 'closed'}`}>
            <div className="sectionHeader" onClick={() => toggleSection('pesticides')}>
              <h3>Pesticides & Fertilizers</h3>
              <FontAwesomeIcon 
                icon={sectionVisibility.pesticides ? faChevronUp : faChevronDown} 
                className="sectionToggleIcon"
              />
            </div>
            
            {sectionVisibility.pesticides && (
              <div className="dynamicSection">
                {pesticideEntries.map((entry, index) => (
                  <div key={index} className={`entryCard ${!entryVisibility.pesticides[index] ? 'closed' : ''}`}>
                    <div className="entryHeader" onClick={() => toggleEntryVisibility('pesticides', index)}>
                      <span className="entryTitle">
                        {entry.pesticide || `Pesticide Entry ${index + 1}`}
                      </span>
                      <FontAwesomeIcon 
                        icon={entryVisibility.pesticides[index] ? faChevronUp : faChevronDown} 
                        className="entryToggleIcon"
                      />
                    </div>

                    {entryVisibility.pesticides[index] && (
                      <div className="entryContent">
                        <div className="inputRow">
                          {/* Pesticide Dropdown */}
                          <div className="inputGroup">
                            <label>Pesticide/Fertilizer</label>
                            {isCustomPesticide !== index ? (
                              <div 
                                className="dropdownContainer" 
                                ref={el => pesticideDropdownRefs.current[index] = el}
                              >
                                <div 
                                  className="customSelect" 
                                  onClick={() => toggleDropdown('pesticide', index)}
                                >
                                  <span className={`selectedValue ${!entry.pesticide ? 'placeholder' : ''}`}>
                                    {entry.pesticide || 'Select pesticide'}
                                  </span>
                                  <FontAwesomeIcon 
                                    icon={faChevronDown} 
                                    className={`dropdownIcon ${openDropdowns.pesticide === index ? 'open' : ''}`} 
                                  />
                                </div>
                                {openDropdowns.pesticide === index && (
                                  <div className="dropdownMenu">
                                    {pesticides.map((p, i) => (
                                      <div 
                                        key={i} 
                                        className={`dropdownItem ${entry.pesticide === p ? 'selected' : ''}`} 
                                        onClick={() => handlePesticideSelect(index, p)}
                                      >
                                        {p}
                                      </div>
                                    ))}
                                    <div className="dropdownItem customOption" onClick={() => setIsCustomPesticide(index)}>
                                      <FontAwesomeIcon icon={faPlus} /> Add Custom Pesticide
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
                                  <button type="button" className="addBtn" onClick={handleAddPesticide}>
                                    <FontAwesomeIcon icon={faPlus} /> Add
                                  </button>
                                  <button type="button" className="cancelBtn" onClick={() => { setIsCustomPesticide(null); setCustomPesticide('') }}>
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
                              className="number-input"
                            />
                          </div>
                        </div>

                        <div className="inputRow">
                          {/* Amount */}
                          <div className="inputGroup">
                            <label>Amount (₹)</label>
                            <input 
                              type="number" 
                              value={entry.amount} 
                              onChange={(e) => handlePesticideChange(index, 'amount', e.target.value)} 
                              placeholder="Enter amount" 
                              min="0" 
                              className="number-input"
                            />
                          </div>

                          {/* Date */}
                          <div className="inputGroup">
                            <label>Date</label>
                            <div className="dateInputContainer">
                              <input 
                                type="date" 
                                value={entry.date} 
                                onChange={(e) => handlePesticideChange(index, 'date', e.target.value)} 
                                required 
                              />
                              <FontAwesomeIcon icon={faCalendar} className="calendarIcon" />
                            </div>
                          </div>
                        </div>

                        {/* Delete Button Row */}
                        <div className="inputRow">
                          <div className="inputGroup deleteGroup">
                            <button 
                              type="button" 
                              className="removeBtn" 
                              onClick={() => handleRemovePesticideEntry(index)}
                              title="Remove this entry"
                            >
                              <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div className="sectionActions">
                  <button type="button" className="addEntryBtn" onClick={handleAddPesticideEntry}>
                    <FontAwesomeIcon icon={faPlus} /> Add Pesticide Entry
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Coolies Section */}
          <div className={`section coolies-section ${sectionVisibility.coolies ? 'open' : 'closed'}`}>
            <div className="sectionHeader" onClick={() => toggleSection('coolies')}>
              <h3>Labor & Workforce</h3>
              <FontAwesomeIcon 
                icon={sectionVisibility.coolies ? faChevronUp : faChevronDown} 
                className="sectionToggleIcon"
              />
            </div>
            
            {sectionVisibility.coolies && (
              <div className="dynamicSection">
                {coolieEntries.map((entry, index) => (
                  <div key={index} className={`entryCard ${!entryVisibility.coolies[index] ? 'closed' : ''}`}>
                    <div className="entryHeader" onClick={() => toggleEntryVisibility('coolies', index)}>
                      <span className="entryTitle">
                        {entry.work ? `${entry.work} - ${entry.count || 0} coolies` : `Coolie Entry ${index + 1}`}
                      </span>
                      <FontAwesomeIcon 
                        icon={entryVisibility.coolies[index] ? faChevronUp : faChevronDown} 
                        className="entryToggleIcon"
                      />
                    </div>

                    {entryVisibility.coolies[index] && (
                      <div className="entryContent">
                        <div className="inputRow">
                          {/* Work Dropdown */}
                          <div className="inputGroup">
                            <label>Work/Purpose</label>
                            {isCustomWork !== index ? (
                              <div 
                                className="dropdownContainer" 
                                ref={el => coolieWorkDropdownRefs.current[index] = el}
                              >
                                <div 
                                  className="customSelect" 
                                  onClick={() => toggleDropdown('coolieWork', index)}
                                >
                                  <span className={`selectedValue ${!entry.work ? 'placeholder' : ''}`}>
                                    {entry.work || 'Select work type'}
                                  </span>
                                  <FontAwesomeIcon 
                                    icon={faChevronDown} 
                                    className={`dropdownIcon ${openDropdowns.coolieWork === index ? 'open' : ''}`} 
                                  />
                                </div>
                                {openDropdowns.coolieWork === index && (
                                  <div className="dropdownMenu">
                                    {workTypes.map((w, i) => (
                                      <div 
                                        key={i} 
                                        className={`dropdownItem ${entry.work === w ? 'selected' : ''}`} 
                                        onClick={() => handleWorkSelect(index, w)}
                                      >
                                        {w}
                                      </div>
                                    ))}
                                    <div className="dropdownItem customOption" onClick={() => setIsCustomWork(index)}>
                                      <FontAwesomeIcon icon={faPlus} /> Add Custom Work
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="customInputRow">
                                <input 
                                  type="text" 
                                  placeholder="Enter new work type" 
                                  value={customWork} 
                                  onChange={(e) => setCustomWork(e.target.value)} 
                                />
                                <div className="customButtons">
                                  <button type="button" className="addBtn" onClick={handleAddWork}>
                                    <FontAwesomeIcon icon={faPlus} /> Add
                                  </button>
                                  <button type="button" className="cancelBtn" onClick={() => { setIsCustomWork(null); setCustomWork('') }}>
                                    <FontAwesomeIcon icon={faXmark} /> Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="inputRow">
                          {/* Coolie Count */}
                          <div className="inputGroup">
                            <label>No. of Coolies</label>
                            <input 
                              type="number" 
                              value={entry.count} 
                              onChange={(e) => handleCoolieChange(index, 'count', e.target.value)} 
                              placeholder="Enter count" 
                              min="0" 
                              className="number-input"
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
                              className="number-input"
                            />
                          </div>
                        </div>

                        <div className="inputRow">
                          {/* Date */}
                          <div className="inputGroup">
                            <label>Date</label>
                            <div className="dateInputContainer">
                              <input 
                                type="date" 
                                value={entry.date} 
                                onChange={(e) => handleCoolieChange(index, 'date', e.target.value)} 
                                required 
                              />
                              <FontAwesomeIcon icon={faCalendar} className="calendarIcon" />
                            </div>
                          </div>

                          {/* No. of Days Input */}
                          <div className="inputGroup">
                            <label>No. of Days</label>
                            <input 
                              type="number" 
                              value={entry.days} 
                              onChange={(e) => handleCoolieChange(index, 'days', e.target.value)} 
                              placeholder="Enter days" 
                              min="1" 
                              className="number-input"
                            />
                          </div>
                        </div>

                        {/* Delete Button Row */}
                        <div className="inputRow">
                          <div className="inputGroup deleteGroup">
                            <button 
                              type="button" 
                              className="removeBtn" 
                              onClick={() => handleRemoveCoolieEntry(index)}
                              title="Remove this entry"
                            >
                              <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div className="sectionActions">
                  <button type="button" className="addEntryBtn" onClick={handleAddCoolieEntry}>
                    <FontAwesomeIcon icon={faPlus} /> Add Coolie Entry
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Payments Section */}
          <div className={`section payments-section ${sectionVisibility.payments ? 'open' : 'closed'}`}>
            <div className="sectionHeader" onClick={() => toggleSection('payments')}>
              <h3>Farmer Payments</h3>
              <FontAwesomeIcon 
                icon={sectionVisibility.payments ? faChevronUp : faChevronDown} 
                className="sectionToggleIcon"
              />
            </div>
            
            {sectionVisibility.payments && (
              <div className="dynamicSection">
                {paymentEntries.map((entry, index) => (
                  <div key={index} className={`entryCard ${!entryVisibility.payments[index] ? 'closed' : ''}`}>
                    <div className="entryHeader" onClick={() => toggleEntryVisibility('payments', index)}>
                      <span className="entryTitle">
                        {`${entry.purpose || 'Payment'} - ₹${entry.amount || 0}`}
                      </span>
                      <FontAwesomeIcon 
                        icon={entryVisibility.payments[index] ? faChevronUp : faChevronDown} 
                        className="entryToggleIcon"
                      />
                    </div>

                    {entryVisibility.payments[index] && (
                      <div className="entryContent">
                        <div className="inputRow">
                          {/* Amount */}
                          <div className="inputGroup">
                            <label>Amount (₹)</label>
                            <input 
                              type="number" 
                              value={entry.amount} 
                              onChange={(e) => handlePaymentChange(index, 'amount', e.target.value)} 
                              placeholder="Enter amount" 
                              min="0" 
                              required 
                              className="number-input"
                            />
                          </div>

                          {/* Date */}
                          <div className="inputGroup">
                            <label>Date</label>
                            <div className="dateInputContainer">
                              <input 
                                type="date" 
                                value={entry.date} 
                                onChange={(e) => handlePaymentChange(index, 'date', e.target.value)} 
                                required 
                              />
                              <FontAwesomeIcon icon={faCalendar} className="calendarIcon" />
                            </div>
                          </div>
                        </div>

                        <div className="inputRow">
                          {/* Purpose */}
                          <div className="inputGroup">
                            <label>Purpose</label>
                            <input 
                              type="text" 
                              value={entry.purpose} 
                              onChange={(e) => handlePaymentChange(index, 'purpose', e.target.value)} 
                              placeholder="e.g., Advance, Progress, Final" 
                              required 
                            />
                          </div>

                          {/* Payment Method */}
                          <div className="inputGroup">
                            <label>Payment Method</label>
                            <div 
                              className="dropdownContainer" 
                              ref={el => paymentMethodDropdownRefs.current[index] = el}
                            >
                              <div 
                                className="customSelect" 
                                onClick={() => toggleDropdown('paymentMethod', index)}
                              >
                                <span className={`selectedValue ${!entry.method ? 'placeholder' : ''}`}>
                                  {entry.method || 'Select payment method'}
                                </span>
                                <FontAwesomeIcon 
                                  icon={faChevronDown} 
                                  className={`dropdownIcon ${openDropdowns.paymentMethod === index ? 'open' : ''}`} 
                                />
                              </div>
                              {openDropdowns.paymentMethod === index && (
                                <div className="dropdownMenu">
                                  {paymentMethods.map((method, i) => (
                                    <div 
                                      key={i} 
                                      className={`dropdownItem ${entry.method === method ? 'selected' : ''}`} 
                                      onClick={() => handlePaymentMethodSelect(index, method)}
                                    >
                                      {method}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Delete Button Row */}
                        <div className="inputRow">
                          <div className="inputGroup deleteGroup">
                            <button 
                              type="button" 
                              className="removeBtn" 
                              onClick={() => handleRemovePaymentEntry(index)}
                              title="Remove this entry"
                            >
                              <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div className="sectionActions">
                  <button type="button" className="addEntryBtn" onClick={handleAddPaymentEntry}>
                    <FontAwesomeIcon icon={faPlus} /> Add Payment Entry
                  </button>
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="updateBtn">Update Crop</button>
        </form>
      </div>
    </div>
  )
}
import './dailyUpdates.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faLocationDot, 
  faSeedling, 
  faBug, 
  faTractor, 
  faFilter,
  faCalendarAlt,
  faChevronDown,
  faMale,
  faFemale,
  faClipboardCheck,
  faWater,
  faSprayCan
} from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const DailyUpdates = () => {
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState('ALL')
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [availableRegions, setAvailableRegions] = useState([])
  const navigate = useNavigate()

  // Fetch crops data from API
  useEffect(() => {
    const fetchCropsData = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/crops')
        const cropsData = response.data
        
        // Transform API data to match our component structure
        const transformedData = cropsData.map(crop => ({
          id: crop._id,
          farmerName: `${crop.farmerDetails?.firstName || ''} ${crop.farmerDetails?.lastName || ''}`.trim(),
          acres: crop.acres || 0,
          seedType: crop.seedType || 'Unknown Seed',
          region: crop.region || 'Unknown Region',
          shortCode: crop.region?.substring(0, 3).toUpperCase() || 'N/A',
          latestUpdate: getLatestUpdate(crop),
          lastUpdated: crop.updatedAt || crop.createdAt,
          status: getCropStatus(crop),
          farmerId: crop.farmerId
        }))

        setUpdates(transformedData)
        
        // Extract unique regions for filter
        const regions = [...new Set(transformedData.map(item => item.shortCode))].filter(Boolean)
        setAvailableRegions(['ALL', ...regions])
        
      } catch (error) {
        console.error('Error fetching crops data:', error)
        setUpdates([])
      } finally {
        setLoading(false)
      }
    }

    fetchCropsData()
  }, [])

  // Function to determine the latest update from crop data
  const getLatestUpdate = (crop) => {
    const updates = []
    
    if (crop.sowingDateMale) updates.push({ type: 'maleSowing', date: crop.sowingDateMale, label: 'Male Seeds Sowed' })
    if (crop.sowingDateFemale) updates.push({ type: 'femaleSowing', date: crop.sowingDateFemale, label: 'Female Seeds Sowed' })
    if (crop.firstDetachingDate) updates.push({ type: 'firstDetach', date: crop.firstDetachingDate, label: 'First Detaching Done' })
    if (crop.secondDetachingDate) updates.push({ type: 'secondDetach', date: crop.secondDetachingDate, label: 'Second Detaching Done' })
    if (crop.harvestingDate) updates.push({ type: 'harvesting', date: crop.harvestingDate, label: 'Harvesting Completed' })
    
    // Add pesticide entries
    if (crop.pesticideEntries && crop.pesticideEntries.length > 0) {
      crop.pesticideEntries.forEach(entry => {
        updates.push({ type: 'pesticide', date: entry.date, label: `${entry.pesticide} Applied` })
      })
    }
    
    // Sort by date and get the latest
    const sortedUpdates = updates.sort((a, b) => new Date(b.date) - new Date(a.date))
    return sortedUpdates[0] || { type: 'created', label: 'Field Created', date: crop.createdAt }
  }

  // Function to determine crop status
  const getCropStatus = (crop) => {
    const today = new Date()
    const harvestingDate = crop.harvestingDate ? new Date(crop.harvestingDate) : null
    
    if (harvestingDate && harvestingDate <= today) return 'Harvested'
    if (crop.secondDetachingDate) return 'Second Detaching'
    if (crop.firstDetachingDate) return 'First Detaching'
    if (crop.sowingDateFemale) return 'Female Sowing'
    if (crop.sowingDateMale) return 'Male Sowing'
    return 'Field Created'
  }

  // Get icon based on update type
  const getUpdateIcon = (updateType) => {
    switch (updateType) {
      case 'maleSowing': return faMale
      case 'femaleSowing': return faFemale
      case 'firstDetach':
      case 'secondDetach': return faClipboardCheck
      case 'harvesting': return faTractor
      case 'pesticide': return faSprayCan
      case 'irrigation': return faWater
      default: return faSeedling
    }
  }

  // Get color based on update type
  const getUpdateColor = (updateType) => {
    switch (updateType) {
      case 'maleSowing': return '#3b82f6' // Blue
      case 'femaleSowing': return '#ec4899' // Pink
      case 'firstDetach':
      case 'secondDetach': return '#f59e0b' // Amber
      case 'harvesting': return '#10b981' // Green
      case 'pesticide': return '#ef4444' // Red
      case 'irrigation': return '#06b6d4' // Cyan
      default: return '#6b7280' // Gray
    }
  }

  // Filter updates based on selected region
  const filteredUpdates = selectedFilter === 'ALL' 
    ? updates 
    : updates.filter(update => update.shortCode === selectedFilter)

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'NA'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  // Format date - CORRECTED VERSION
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently'
    
    const date = new Date(dateString)
    const now = new Date()
    
    // Reset time components to compare only dates
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    // Calculate difference in days
    const diffTime = today.getTime() - inputDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays} days ago`
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`
    
    return inputDate.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short',
      year: inputDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    })
  }
  
  if (loading) {
    return (
      <div className="dailyUpdates">
        <div className="loadingState">
          <div className="spinner"></div>
          <p>Loading daily updates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dailyUpdates">
      {/* Header with Filter */}
      <div className="updatesHeader">
        <div className="headerLeft">
          <h2>Daily Updates</h2>
          <span className="updatesCount">{filteredUpdates.length} updates</span>
        </div>
        
        <div className="headerRight">
          <div className="filterContainer">
            <button 
              className="filterBtn"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <FontAwesomeIcon icon={faFilter} />
              <span>{selectedFilter}</span>
              <FontAwesomeIcon icon={faChevronDown} className="chevron" />
            </button>
            
            {showFilterDropdown && (
              <div className="filterDropdown">
                {availableRegions.map(region => (
                  <button
                    key={region}
                    className={`filterOption ${selectedFilter === region ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedFilter(region)
                      setShowFilterDropdown(false)
                    }}
                  >
                    {region}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Updates List */}
      <div className="updatesList">
        {filteredUpdates.length === 0 ? (
          <div className="emptyState">
            <FontAwesomeIcon icon={faCalendarAlt} className="emptyIcon" />
            <h3>No Updates Found</h3>
            <p>No crop updates available for the selected filter.</p>
          </div>
        ) : (
          filteredUpdates.map((update) => (
            <div key={update.id} className="updateCard" onClick={() => navigate(`/crops/${update.id}`)}>
              <div className="cardLeft">
                <div className="farmerAvatar">
                  <div className="avatar">{getInitials(update.farmerName)}</div>
                  <div 
                    className="statusIndicator"
                    style={{ backgroundColor: getUpdateColor(update.latestUpdate.type) }}
                  ></div>
                </div>
                
                <div className="farmerInfo">
                  <h3 className="farmerName">{update.farmerName}</h3>
                  <p className="cropVariety">{update.seedType}</p>
                  <div className="fieldDetails">
                    <span className="acres">{update.acres} acres</span>
                    <span className="region">
                      <FontAwesomeIcon icon={faLocationDot} />
                      {update.region}
                    </span>
                  </div>
                </div>
              </div>

              <div className="cardRight">
                <div 
                  className="updateBadge"
                  style={{ 
                    backgroundColor: `${getUpdateColor(update.latestUpdate.type)}15`,
                    color: getUpdateColor(update.latestUpdate.type),
                    borderColor: getUpdateColor(update.latestUpdate.type)
                  }}
                >
                  <FontAwesomeIcon 
                    icon={getUpdateIcon(update.latestUpdate.type)} 
                    className="updateIcon" 
                  />
                  <span className="updateText">{update.latestUpdate.label}</span>
                </div>
                <span className="updateTime">
                  {formatDate(update.latestUpdate.date)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
import React, { useState, useEffect } from 'react'
import './farmers.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserGroup,
  faSeedling,
  faMapMarkerAlt,
  faFilter,
  faCalendarDays,
  faSpinner,
  faCheckCircle,
  faSearch,
  faPlus,
  faRupeeSign,
  faIdCard,
  faMobileAlt,
  faBank,
  faChevronRight,
  faXmark,
  faSlidersH,
  faRefresh,
  faExclamationTriangle,
  faEdit,
  faChevronLeft
} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const Farmers = () => {
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('ALL')
  const [showFilters, setShowFilters] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [availableLocations, setAvailableLocations] = useState([])
  const navigate = useNavigate()

  // Fetch farmers data from API
  const fetchFarmersData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get('/farmers')
      const farmersData = response.data
      console.log(farmersData)
      
      setFarmers(farmersData)
      
      // Extract unique locations for filter
      const locations = [...new Set(farmersData.map(farmer => farmer.village).filter(Boolean))]
      setAvailableLocations(['ALL', ...locations])
      
    } catch (error) {
      console.error('Error fetching farmers data:', error)
      setError('Failed to load farmers data. Please try again.')
      setFarmers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFarmersData()
  }, [])

  // Get initials
  const getInitials = (farmer) => {
    if (!farmer) return 'NA'
    const name = `${farmer.firstName || ''} ${farmer.lastName || ''}`.trim()
    if (!name) return 'NA'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  // Format Aadhar number (show only last 4 digits)
  const formatAadhar = (aadhar) => {
    if (!aadhar) return 'N/A'
    return `XXXX XXXX ${aadhar.slice(-4)}`
  }

  // Format bank account number (show only last 4 digits)
  const formatBankAccount = (account) => {
    if (!account) return 'N/A'
    return `XXXX${account.slice(-4)}`
  }

  // Filter farmers
  const filteredFarmers = farmers.filter(farmer => {
    // Search filter
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = 
      farmer.firstName?.toLowerCase().includes(searchLower) ||
      farmer.lastName?.toLowerCase().includes(searchLower) ||
      farmer.village?.toLowerCase().includes(searchLower) ||
      farmer.mobile?.includes(searchTerm)

    // Location filter
    const matchesLocation = selectedLocation === 'ALL' || farmer.village === selectedLocation

    return matchesSearch && matchesLocation
  })

  // Handle edit farmer
  const handleEditFarmer = (farmer, e) => {
    e.stopPropagation() // Prevent navigation to farmer details
    navigate(`/update-farmer/${farmer.aadhar}`)
  }

  // Handle back navigation
  const handleBack = () => {
    navigate('/') 
  }

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedLocation('ALL')
    setShowFilters(false)
  }

  // Check if any filter is active
  const hasActiveFilters = searchTerm || selectedLocation !== 'ALL'

  if (loading) {
    return (
      <div className="farmersPage">
        <div className="loadingState">
          <div className="spinner"></div>
          <p>Loading farmers data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="farmersPage">
        <div className="errorState">
          <div className="errorIcon">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <h3>Unable to Load Farmers</h3>
          <p>{error}</p>
          <div className="errorActions">
            <button className="retryBtn" onClick={fetchFarmersData}>
              <FontAwesomeIcon icon={faRefresh} />
              Try Again
            </button>
            <button className="backBtn" onClick={handleBack}>
              <FontAwesomeIcon icon={faChevronLeft} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="farmersPage">
      {/* Advanced Header */}
      <div className="advancedHeader">
        <div className="headerContent">
          <div className="headerMain">
            <div className="titleSection">
              <button className="backButton" onClick={handleBack}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <div className="titleIcon">
                <FontAwesomeIcon icon={faUserGroup} />
              </div>
              <div className="titleText">
                <h1>Farmers Management</h1>
                <p>Manage and monitor all your farmers in one place</p>
              </div>
            </div>
            <div className="headerActions">
              <div className="totalFarmers">
                Total Farmers: <strong>{farmers.length}</strong>
              </div>
              <button 
                className="addFarmerBtn"
                onClick={() => navigate('/create-farmer')}
              >
                <FontAwesomeIcon icon={faPlus} />
                Add Farmer
              </button>
            </div>
          </div>

          {/* Advanced Search and Controls */}
          <div className="advancedControls">
            <div className={`searchContainer ${isSearchFocused ? 'focused' : ''}`}>
              <FontAwesomeIcon icon={faSearch} className="searchIcon" />
              <input
                type="text"
                placeholder="Search farmers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              {searchTerm && (
                <button 
                  className="clearSearch"
                  onClick={() => setSearchTerm('')}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              )}
            </div>

            <div className="controlActions">
              <div className="filterSection">
                <button 
                  className={`filterBtn ${showFilters ? 'active' : ''} ${hasActiveFilters ? 'hasFilters' : ''}`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FontAwesomeIcon icon={faSlidersH} />
                  Filters
                  {hasActiveFilters && <span className="filterIndicator"></span>}
                </button>

                {showFilters && (
                  <div className="filtersPanel">
                    <div className="filtersHeader">
                      <h4>Filter Options</h4>
                      <button className="closeFilters" onClick={() => setShowFilters(false)}>
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                    
                    <div className="filterGroup">
                      <label>Location</label>
                      <select 
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="filterSelect"
                      >
                        <option value="ALL">All Locations</option>
                        {availableLocations.filter(location => location !== 'ALL').map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>

                    <div className="filterActions">
                      <button className="clearAllBtn" onClick={clearAllFilters}>
                        Clear All
                      </button>
                      <button className="applyBtn" onClick={() => setShowFilters(false)}>
                        Apply Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Filters Bar */}
          {hasActiveFilters && (
            <div className="activeFilters">
              <span className="filtersLabel">Active Filters:</span>
              {searchTerm && (
                <span className="filterTag">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')}>×</button>
                </span>
              )}
              {selectedLocation !== 'ALL' && (
                <span className="filterTag">
                  Location: {selectedLocation}
                  <button onClick={() => setSelectedLocation('ALL')}>×</button>
                </span>
              )}
              <button className="clearAllFilters" onClick={clearAllFilters}>
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Farmers Table */}
      <div className="farmersTableContainer">
        <div className="tableHeader">
          <h3>All Farmers ({filteredFarmers.length})</h3>
        </div>

        {filteredFarmers.length === 0 ? (
          <div className="emptyState">
            <FontAwesomeIcon icon={faUserGroup} className="emptyIcon" />
            <h3>No Farmers Found</h3>
            <p>No farmers match your search criteria. Try adjusting your filters.</p>
            {hasActiveFilters && (
              <button className="clearFiltersBtn" onClick={clearAllFilters}>
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="farmersGrid">
            {filteredFarmers.map((farmer) => (
              <div 
                key={farmer._id} 
                className="farmerCard"
                onClick={() => navigate(`/farmers/${farmer.aadhar}`)}
              >
                <div className="cardHeader">
                  <div className="farmerBasicInfo">
                    <div className="farmerAvatar">
                      {getInitials(farmer)}
                    </div>
                    <div className="farmerInfo">
                      <h3>{farmer.firstName} {farmer.lastName}</h3>
                      <div className="farmerMeta">
                        <span className="location">
                          <FontAwesomeIcon icon={faMapMarkerAlt} />
                          {farmer.village || 'Unknown Village'}
                        </span>
                        <span className="mobile">
                          <FontAwesomeIcon icon={faMobileAlt} />
                          {farmer.mobile || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="headerActions">
                    <button 
                      className="editBtn"
                      onClick={(e) => handleEditFarmer(farmer, e)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <FontAwesomeIcon icon={faChevronRight} className="arrowIcon" />
                  </div>
                </div>

                <div className="identitySection">
                  <div className="identityItem">
                    <FontAwesomeIcon icon={faIdCard} className="identityIcon" />
                    <div className="identityInfo">
                      <span className="label">Aadhar</span>
                      <span className="value">{formatAadhar(farmer.aadhar)}</span>
                    </div>
                  </div>
                  <div className="identityItem">
                    <FontAwesomeIcon icon={faBank} className="identityIcon" />
                    <div className="identityInfo">
                      <span className="label">Bank Account</span>
                      <span className="value">{formatBankAccount(farmer.bankAccountNumber)}</span>
                    </div>
                  </div>
                </div>

                <div className="cardFooter">
                  <div className="lastUpdated">
                    <FontAwesomeIcon icon={faCalendarDays} />
                    Registered: {new Date(farmer.createdAt).toLocaleDateString('en-IN')}
                  </div>
                  <div className="viewDetails">
                    View Details
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
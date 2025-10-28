import React, { useState, useEffect } from 'react'
import './SelectFarmer.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserGroup,
  faSearch,
  faMapMarkerAlt,
  faMobileAlt,
  faChevronLeft,
  faSeedling,
  faUsers,
  faIdCard,
  faXmark,
  faSlidersH,
  faRefresh,
  faExclamationTriangle,
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const SelectFarmer = () => {
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

  // Handle farmer selection
  const handleSelectFarmer = (farmer) => {
    navigate(`/create-crop/${farmer.aadhar}`)
  }

  // Handle create farmer
  const handleCreateFarmer = () => {
    navigate('/create-farmer')
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
      <div className="selectFarmerPage">
        <div className="loadingState">
          <div className="spinner"></div>
          <p>Loading farmers data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="selectFarmerPage">
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
            <button className="backBtn" onClick={() => navigate('/crops')}>
              <FontAwesomeIcon icon={faChevronLeft} />
              Back to Crops
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="selectFarmerPage">
      {/* Advanced Header */}
      <div className="advancedHeader">
        <div className="headerContent">
          <div className="headerMain">
            <div className="titleSection">
              <button className="backBtn" onClick={() => navigate('/crops')}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <div className="titleIcon">
                <FontAwesomeIcon icon={faUserGroup} />
              </div>
              <div className="titleText">
                <h1>Select Farmer</h1>
                <p>Choose a farmer to create a new crop</p>
              </div>
            </div>
            <div className="headerActions">
              <div className="statItem">
                <FontAwesomeIcon icon={faUsers} className="statIcon" />
                <div className="statContent">
                  <span className="statNumber">{farmers.length}</span>
                  <span className="statLabel">Total Farmers</span>
                </div>
              </div>
              <button 
                className="createFarmerBtn"
                onClick={handleCreateFarmer}
              >
                <FontAwesomeIcon icon={faPlus} />
                Create Farmer
              </button>
            </div>
          </div>

          {/* Advanced Search and Controls */}
          <div className="advancedControls">
            <div className={`searchContainer ${isSearchFocused ? 'focused' : ''}`}>
              <FontAwesomeIcon icon={faSearch} className="searchIcon" />
              <input
                type="text"
                placeholder="Search farmers by name, village, or mobile..."
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
                      <label>Village</label>
                      <select 
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="filterSelect"
                      >
                        <option value="ALL">All Villages</option>
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
                  Village: {selectedLocation}
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

      {/* Farmers Grid */}
      <div className="farmersGridContainer">
        <div className="gridHeader">
          <h3>Select a Farmer ({filteredFarmers.length})</h3>
          <p>Click on a farmer to create a new crop for them</p>
        </div>

        {filteredFarmers.length === 0 ? (
          <div className="emptyState">
            <FontAwesomeIcon icon={faUserGroup} className="emptyIcon" />
            <h3>No Farmers Found</h3>
            <p>No farmers match your search criteria. Try adjusting your filters or create a new farmer.</p>
            <div className="emptyStateActions">
              {hasActiveFilters && (
                <button className="clearFiltersBtn" onClick={clearAllFilters}>
                  Clear All Filters
                </button>
              )}
              <button className="createFarmerBtn" onClick={handleCreateFarmer}>
                <FontAwesomeIcon icon={faPlus} />
                Create New Farmer
              </button>
            </div>
          </div>
        ) : (
          <div className="farmersSelectionGrid">
            {filteredFarmers.map((farmer) => (
              <div 
                key={farmer._id} 
                className="farmerSelectionCard"
                onClick={() => handleSelectFarmer(farmer)}
              >
                <div className="cardMain">
                  <div className="farmerAvatar">
                    {getInitials(farmer)}
                  </div>
                  <div className="farmerDetails">
                    <h3>{farmer.firstName} {farmer.lastName}</h3>
                    <div className="farmerInfo">
                      <div className="infoItem">
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                        <span>{farmer.village || 'Unknown Village'}</span>
                      </div>
                      <div className="infoItem">
                        <FontAwesomeIcon icon={faMobileAlt} />
                        <span>{farmer.mobile || 'N/A'}</span>
                      </div>
                      <div className="infoItem">
                        <FontAwesomeIcon icon={faIdCard} />
                        <span>{formatAadhar(farmer.aadhar)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="cardFooter">
                  <div className="selectAction">
                    Select Farmer
                    <FontAwesomeIcon icon={faChevronLeft} className="arrowIcon" />
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
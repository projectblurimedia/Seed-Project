import React, { useState, useEffect } from 'react'
import './farmers.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserGroup,
  faMapMarkerAlt,
  faFilter,
  faCalendarDays,
  faSearch,
  faPlus,
  faIdCard,
  faMobileAlt,
  faBank,
  faChevronRight,
  faXmark,
  faRefresh,
  faExclamationTriangle,
  faChevronLeft,
  faUsers,
  faLocationDot,
  faFileExport,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Toast } from '../../components/toast/Toast'
import * as XLSX from 'xlsx'

export const Farmers = () => {
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('ALL')
  const [showFilters, setShowFilters] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [availableLocations, setAvailableLocations] = useState([])
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  // Show toast message
  const showToast = (message, type = 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }

  // Fetch farmers data from API with enhanced error handling
  const fetchFarmersData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get('/farmers', {
        timeout: 100000,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.data) {
        throw new Error('No data received from server')
      }
      
      const farmersData = response.data
      
      setFarmers(farmersData)
      
      // Extract unique locations for filter
      const locations = [...new Set(farmersData
        .map(farmer => farmer.village)
        .filter(Boolean)
        .sort()
      )]
      setAvailableLocations(['ALL', ...locations])      
    } catch (error) {
      console.error('Error fetching farmers data:', error)
      
      let errorMessage = 'Failed to load farmers data. '
      
      if (error.code === 'ECONNABORTED') {
        errorMessage += 'Request timed out. Please check your internet connection.'
      } else if (error.response) {
        errorMessage += `Server error: ${error.response.status}`
      } else if (error.request) {
        errorMessage += 'No response from server. Please try again.'
      } else {
        errorMessage += 'Please try again.'
      }
      
      setError(errorMessage)
      setFarmers([])
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFarmersData()
  }, [])

  // Get initials with fallback
  const getInitials = (farmer) => {
    if (!farmer) return 'NA'
    const name = `${farmer.firstName || ''} ${farmer.lastName || ''}`.trim()
    if (!name || name === ' ') return 'NA'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatAadhar = (aadhar) => {
    if (!aadhar) return 'N/A'
    const cleaned = aadhar.toString().replace(/\s/g, '')
    if (cleaned.length !== 12) return 'N/A'
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8, 12)}`
  }

  const formatBankAccount = (account) => {
    if (!account) return 'N/A'
    return account.toString()
  }

  // Filter farmers with enhanced search
  const filteredFarmers = farmers.filter(farmer => {
    const searchLower = searchTerm.toLowerCase().trim()
    
    if (!searchLower && selectedLocation === 'ALL') return true

    // Search filter
    const matchesSearch = searchLower ? (
      farmer.firstName?.toLowerCase().includes(searchLower) ||
      farmer.lastName?.toLowerCase().includes(searchLower) ||
      farmer.village?.toLowerCase().includes(searchLower) ||
      farmer.mobile?.includes(searchTerm) ||
      farmer.aadhar?.includes(searchTerm)
    ) : true

    // Location filter
    const matchesLocation = selectedLocation === 'ALL' || farmer.village === selectedLocation

    return matchesSearch && matchesLocation
  })

  // Handle view farmer details
  const handleViewFarmer = (farmer) => {
    if (farmer.aadhar) {
      navigate(`/farmers/${farmer.aadhar}`)
    } else {
      showToast('Cannot view farmer details: Missing Aadhar information', 'error')
    }
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
    showToast('All filters cleared', 'info')
  }

  // Check if any filter is active
  const hasActiveFilters = searchTerm || selectedLocation !== 'ALL'

  // Export farmers to Excel
  const exportToExcel = () => {
    try {
      const farmersToExport = filteredFarmers.length > 0 ? filteredFarmers : farmers
      
      if (farmersToExport.length === 0) {
        showToast('No farmers data to export', 'warning')
        return
      }

      // Prepare data for export
      const exportData = farmersToExport.map(farmer => ({
        'First Name': farmer.firstName || 'N/A',
        'Last Name': farmer.lastName || 'N/A',
        'Village': farmer.village || 'N/A',
        'Mobile': farmer.mobile || 'N/A',
        'Aadhar Number': farmer.aadhar || 'N/A',
        'Bank Account': farmer.bankAccountNumber || 'N/A',
        'Registration Date': farmer.createdAt ? new Date(farmer.createdAt).toLocaleDateString('en-IN') : 'N/A'
      }))

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(exportData)

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Farmers Data')

      // Generate Excel file and download
      const fileName = `farmers_data_${new Date().toISOString()}.xlsx`
      XLSX.writeFile(wb, fileName)
      
      showToast(`Exported ${farmersToExport.length} farmers to Excel`, 'success')
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      showToast('Failed to export data. Please try again.', 'error')
    }
  }

  // Enhanced loading state
  if (loading) {
    return (
      <div className="farmersPage">
        <div className="loadingState">
          <div className="loadingContent">
            <div className="loadingSpinner">
              <FontAwesomeIcon icon={faUsers} className="spinnerIcon" />
              <div className="spinnerRing"></div>
            </div>
            <h3>Loading Farmers Data</h3>
            <p>Please wait while we fetch the latest information...</p>
            <div className="loadingProgress">
              <div className="progressBar"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Enhanced error state
  if (error) {
    return (
      <div className="farmersPage">
        <div className="errorState">
          <div className="errorContent">
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
      </div>
    )
  }

  return (
    <div className="farmersPage">
      {/* Toast Component */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          position="top-right"
        />
      )}

      {/* Header similar to HomeHeader */}
      <div className="farmersHeader">
        <div className="left">
          <button className="backButton" onClick={handleBack}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <FontAwesomeIcon icon={faUserGroup} className="icon" />
          <div className="title">Farmers</div>
        </div>
        
        <div className="right">
          <div className="navIcons">  
            <button 
              className={`iconBtn searchBtn ${showSearch ? 'active' : ''}`}
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Search"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
            
            <button 
              className={`iconBtn filterBtn ${hasActiveFilters ? 'hasFilters' : ''} ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Filters"
            >
              <FontAwesomeIcon icon={faFilter} />
              {hasActiveFilters && <span className="filterIndicator"></span>}
            </button>

            <button 
              className="iconBtn addFarmerBtn"
              onClick={() => navigate('/create-farmer')}
              aria-label="Add Farmer"
            >
              <FontAwesomeIcon icon={faUserPlus} />
            </button>

            <button 
              className="iconBtn exportBtn"
              onClick={exportToExcel}
              aria-label="Export to Excel"
              title="Export to Excel"
            >
              <FontAwesomeIcon icon={faFileExport} />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar - Animated */}
      {showSearch && (
        <div className="searchSection">
          <div className={`searchContainer ${isSearchFocused ? 'focused' : ''}`}>
            <FontAwesomeIcon icon={faSearch} className="searchIcon" />
            <input
              type="text"
              placeholder="Search by name, village, mobile, or Aadhar..."
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
        </div>
      )}

      {/* Filters Panel - Absolute Positioned */}
      {showFilters && (
        <div className="filtersSection">
          <div className="filtersPanel">
            <div className="filtersHeader">
              <h4>Filter Farmers</h4>
              <button className="closeFilters" onClick={() => setShowFilters(false)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            
            <div className="filterGroup">
              <select 
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="filterSelect"
              >
                <option value="ALL">All Locations</option>
                {availableLocations
                  .filter(location => location !== 'ALL')
                  .map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))
                }
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
        </div>
      )}

      {/* Active Filters Display */}
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
              <FontAwesomeIcon icon={faLocationDot} />
              Location: {selectedLocation}
              <button onClick={() => setSelectedLocation('ALL')}>×</button>
            </span>
          )}
          <button className="clearAllFilters" onClick={clearAllFilters}>
            Clear All
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="pageContent">
        <div className="farmersContainer">
          <div className="containerHeader">
            <h2>All Farmers ({filteredFarmers.length})</h2>
            {hasActiveFilters && (
              <span className="filteredCount">
                Showing {filteredFarmers.length} of {farmers.length} farmers
              </span>
            )}
          </div>

          {filteredFarmers.length === 0 ? (
            <div className="emptyState">
              <div className="emptyIllustration">
                <FontAwesomeIcon icon={faUserGroup} className="emptyIcon" />
              </div>
              <h3>No Farmers Found</h3>
              <p>
                {hasActiveFilters 
                  ? "No farmers match your current search criteria. Try adjusting your filters."
                  : "No farmers are currently registered in the system."
                }
              </p>
              {hasActiveFilters ? (
                <button className="clearFiltersBtn" onClick={clearAllFilters}>
                  Clear All Filters
                </button>
              ) : (
                <button 
                  className="addFirstFarmerBtn"
                  onClick={() => navigate('/create-farmer')}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Add First Farmer
                </button>
              )}
            </div>
          ) : (
            <div className="farmersGrid">
              {filteredFarmers.map((farmer) => (
                <div 
                  key={farmer._id} 
                  className="farmerCard"
                  onClick={() => handleViewFarmer(farmer)}
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
                  </div>

                  <div className="identitySection">
                    <div className="identityItem">
                      <FontAwesomeIcon icon={faIdCard} className="identityIcon" />
                      <div className="identityInfo">
                        <span className="label">Aadhar Number</span>
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
                      <FontAwesomeIcon icon={faChevronRight} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
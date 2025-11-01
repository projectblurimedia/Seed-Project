import './crops.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSearch,
  faPlus,
  faSeedling,
  faMapMarkerAlt,
  faCalendarAlt,
  faChevronRight,
  faUsers,
  faTractor,
  faXmark,
  faFilter,
  faRefresh,
  faExclamationTriangle,
  faChevronLeft,
  faFileExport,
  faMobile
} from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Toast } from '../../components/toast/Toast'
import * as XLSX from 'xlsx'

export const Crops = () => {
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('ALL')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [availableRegions, setAvailableRegions] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  // Show toast message
  const showToast = (message, type = 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }

  // Fetch crops data from API with enhanced error handling
  const fetchCropsData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get('/crops', {
        timeout: 100000,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.data) {
        throw new Error('No data received from server')
      }
      
      const cropsData = response.data
      setCrops(cropsData)
      
      // Extract unique regions for filter
      const regions = [...new Set(cropsData
        .map(crop => crop.region)
        .filter(Boolean)
        .sort()
      )]
      setAvailableRegions(['ALL', ...regions])
      
    } catch (error) {
      console.error('Error fetching crops data:', error)
      
      let errorMessage = 'Failed to load crops data. '
      
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
      setCrops([])
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCropsData()
  }, [])

  // Get crop status with progress
  const getCropStatus = (crop) => {
    const today = new Date()
    const harvestingDate = crop.harvestingDate ? new Date(crop.harvestingDate) : null
    if (harvestingDate && harvestingDate <= today) return { status: 'Harvested', progress: 100 }
    if (crop.secondDetachingDate) return { status: 'Second Detaching', progress: 80 }
    if (crop.firstDetachingDate) return { status: 'First Detaching', progress: 60 }
    if (crop.sowingDateFemale) return { status: 'Female Sowing', progress: 40 }
    if (crop.sowingDateMale) return { status: 'Male Sowing', progress: 20 }
    return { status: 'Field Created', progress: 10 }
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Harvested': return '#10b981'
      case 'Second Detaching': return '#f59e0b'
      case 'First Detaching': return '#f59e0b'
      case 'Female Sowing': return '#ec4899'
      case 'Male Sowing': return '#3b82f6'
      case 'Field Created': return '#6b7280'
      default: return '#6b7280'
    }
  }

  // Get status background
  const getStatusBackground = (status) => {
    switch (status) {
      case 'Harvested': return 'linear-gradient(135deg, #10b98115, #10b98108)'
      case 'Second Detaching': return 'linear-gradient(135deg, #f59e0b15, #f59e0b08)'
      case 'First Detaching': return 'linear-gradient(135deg, #f59e0b15, #f59e0b08)'
      case 'Female Sowing': return 'linear-gradient(135deg, #ec489915, #ec489908)'
      case 'Male Sowing': return 'linear-gradient(135deg, #3b82f615, #3b82f608)'
      case 'Field Created': return 'linear-gradient(135deg, #6b728015, #6b728008)'
      default: return 'linear-gradient(135deg, #6b728015, #6b728008)'
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Get initials
  const getInitials = (farmer) => {
    if (!farmer) return 'NA'
    const name = `${farmer.firstName || ''} ${farmer.lastName || ''}`.trim()
    if (!name) return 'NA'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  // Filter crops
  const filteredCrops = crops.filter(crop => {
    const searchLower = searchTerm.toLowerCase().trim()
    
    if (!searchLower && selectedRegion === 'ALL' && selectedStatus === 'ALL') return true

    // Search filter
    const matchesSearch = searchLower ? (
      crop.seedType?.toLowerCase().includes(searchLower) ||
      crop.region?.toLowerCase().includes(searchLower) ||
      `${crop.farmerDetails?.firstName} ${crop.farmerDetails?.lastName}`.toLowerCase().includes(searchLower) ||
      crop.farmerDetails?.mobile?.includes(searchTerm)
    ) : true

    // Region filter
    const matchesRegion = selectedRegion === 'ALL' || crop.region === selectedRegion

    // Status filter
    const cropStatus = getCropStatus(crop).status
    const matchesStatus = selectedStatus === 'ALL' || cropStatus === selectedStatus

    return matchesSearch && matchesRegion && matchesStatus
  })

  // Handle create crop
  const handleCreateCrop = () => {
    navigate('/select-farmer')
  }

  const handleBack = () => {
    navigate('/') 
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedRegion('ALL')
    setSelectedStatus('ALL')
    setShowFilters(false)
    showToast('All filters cleared', 'info')
  }

  // Check if any filter is active
  const hasActiveFilters = searchTerm || selectedRegion !== 'ALL' || selectedStatus !== 'ALL'

  // Export crops to Excel
  const exportToExcel = () => {
    try {
      const cropsToExport = filteredCrops.length > 0 ? filteredCrops : crops
      
      if (cropsToExport.length === 0) {
        showToast('No crops data to export', 'warning')
        return
      }

      // Prepare data for export
      const exportData = cropsToExport.map(crop => {
        const status = getCropStatus(crop)
        return {
          'Seed Type': crop.seedType || 'N/A',
          'Farmer Name': `${crop.farmerDetails?.firstName || ''} ${crop.farmerDetails?.lastName || ''}`.trim() || 'N/A',
          'Region': crop.region || 'N/A',
          'Land Area (acres)': crop.acres || 0,
          'Male Packets': crop.malePackets || 0,
          'Female Packets': crop.femalePackets || 0,
          'Total Yield (kg)': crop.yield || 0,
          'Status': status.status,
          'Progress': `${status.progress}%`,
          'Sowing Date Male': formatDate(crop.sowingDateMale),
          'Sowing Date Female': formatDate(crop.sowingDateFemale),
          'First Detaching': formatDate(crop.firstDetachingDate),
          'Second Detaching': formatDate(crop.secondDetachingDate),
          'Harvesting Date': formatDate(crop.harvestingDate),
          'Last Updated': formatDate(crop.updatedAt || crop.createdAt)
        }
      })

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(exportData)

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Crops Data')

      // Generate Excel file and download
      const fileName = `crops_data_${new Date().toISOString().split('T')[0]}.xlsx`
      XLSX.writeFile(wb, fileName)
      
      showToast(`Exported ${cropsToExport.length} crops to Excel`, 'success')
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      showToast('Failed to export data. Please try again.', 'error')
    }
  }

  // Enhanced loading state
  if (loading) {
    return (
      <div className="cropsPage">
        <div className="loadingState">
          <div className="loadingContent">
            <div className="loadingSpinner">
              <FontAwesomeIcon icon={faSeedling} className="spinnerIcon" />
              <div className="spinnerRing"></div>
            </div>
            <h3>Loading Crops Data</h3>
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
      <div className="cropsPage">
        <div className="errorState">
          <div className="errorContent">
            <div className="errorIcon">
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </div>
            <h3>Unable to Load Crops</h3>
            <p>{error}</p>
            <div className="errorActions">
              <button className="retryBtn" onClick={fetchCropsData}>
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
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
            position="top-right"
          />
        )}
      </div>
    )
  }

  return (
    <div className="cropsPage">
      {/* Toast Component */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          position="top-right"
        />
      )}

      {/* Header similar to Farmers */}
      <div className="cropsHeader">
        <div className="left">
          <button className="backButton" onClick={handleBack}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <FontAwesomeIcon icon={faSeedling} className="icon" />
          <div className="title">Crops</div>
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
              className="iconBtn addCropBtn"
              onClick={handleCreateCrop}
              aria-label="Add Crop"
            >
              <FontAwesomeIcon icon={faPlus} />
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

      {/* Search Bar */}
      {showSearch && (
        <div className="searchSection">
          <div className={`searchContainer ${isSearchFocused ? 'focused' : ''}`}>
            <FontAwesomeIcon icon={faSearch} className="searchIcon" />
            <input
              type="text"
              placeholder="Search by seed type, region, or farmer name..."
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

      {/* Filters Panel */}
      {showFilters && (
        <div className="filtersSection">
          <div className="filtersPanel">
            <div className="filtersHeader">
              <h4>Filter Crops</h4>
              <button className="closeFilters" onClick={() => setShowFilters(false)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            
            <div className="filterGroup">
              <label>Region</label>
              <select 
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="filterSelect"
              >
                <option value="ALL">All Regions</option>
                {availableRegions
                  .filter(region => region !== 'ALL')
                  .map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))
                }
              </select>
            </div>

            <div className="filterGroup">
              <label>Status</label>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="filterSelect"
              >
                <option value="ALL">All Status</option>
                <option value="Field Created">Field Created</option>
                <option value="Male Sowing">Male Sowing</option>
                <option value="Female Sowing">Female Sowing</option>
                <option value="First Detaching">First Detaching</option>
                <option value="Second Detaching">Second Detaching</option>
                <option value="Harvested">Harvested</option>
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
          {selectedRegion !== 'ALL' && (
            <span className="filterTag">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              Region: {selectedRegion}
              <button onClick={() => setSelectedRegion('ALL')}>×</button>
            </span>
          )}
          {selectedStatus !== 'ALL' && (
            <span className="filterTag">
              Status: {selectedStatus}
              <button onClick={() => setSelectedStatus('ALL')}>×</button>
            </span>
          )}
          <button className="clearAllFilters" onClick={clearAllFilters}>
            Clear All
          </button>
        </div>
      )}

      {/* Stats Overview */}
      <div className="statsOverview">
        <div className="statCard">
          <div className="statIcon total">
            <FontAwesomeIcon icon={faSeedling} />
          </div>
          <div className="statContent">
            <h3>{crops.length}</h3>
            <p>Total Crops</p>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon active">
            <FontAwesomeIcon icon={faTractor} />
          </div>
          <div className="statContent">
            <h3>{crops.filter(crop => getCropStatus(crop).status !== 'Harvested').length}</h3>
            <p>Active Crops</p>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon farmers">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="statContent">
            <h3>{new Set(crops.map(crop => crop.farmerDetails?._id)).size}</h3>
            <p>Active Farmers</p>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon regions">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
          </div>
          <div className="statContent">
            <h3>{new Set(crops.map(crop => crop.region).filter(Boolean)).size}</h3>
            <p>Active Regions</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pageContent">
        <div className="cropsContainer">
          <div className="containerHeader">
            <h2>All Crops ({filteredCrops.length})</h2>
            {hasActiveFilters && (
              <span className="filteredCount">
                Showing {filteredCrops.length} of {crops.length} crops
              </span>
            )}
          </div>

          {filteredCrops.length === 0 ? (
            <div className="emptyState">
              <div className="emptyIllustration">
                <FontAwesomeIcon icon={faSeedling} className="emptyIcon" />
              </div>
              <h3>No Crops Found</h3>
              <p>
                {hasActiveFilters 
                  ? "No crops match your current search criteria. Try adjusting your filters."
                  : "No crops are currently registered in the system."
                }
              </p>
              {hasActiveFilters ? (
                <button className="clearFiltersBtn" onClick={clearAllFilters}>
                  Clear All Filters
                </button>
              ) : (
                <button 
                  className="addFirstCropBtn"
                  onClick={handleCreateCrop}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Add First Crop
                </button>
              )}
            </div>
          ) : (
            <div className="cropsGrid">
              {filteredCrops.map((crop) => {
                const status = getCropStatus(crop)
                
                return (
                  <div 
                    key={crop._id} 
                    className="cropCard"
                    onClick={() => navigate(`/crops/${crop._id}`)}
                  >
                    {/* Status Highlight Banner */}
                    <div 
                      className="statusBanner"
                      style={{ 
                        background: getStatusBackground(status.status),
                        borderLeft: `4px solid ${getStatusColor(status.status)}`
                      }}
                    >
                      <div className="statusContent">
                        <div className="statusInfo">
                          <FontAwesomeIcon 
                            icon={faSeedling} 
                            className="statusIcon"
                            style={{ color: getStatusColor(status.status) }}
                          />
                          <div className="statusText">
                            <span className="statusLabel">Crop Status</span>
                            <span 
                              className="statusValue"
                              style={{ color: getStatusColor(status.status) }}
                            >
                              {status.status}
                            </span>
                          </div>
                        </div>
                        <div className="progressCircle">
                          <div 
                            className="circleBackground"
                            style={{ 
                              background: `conic-gradient(${getStatusColor(status.status)} ${status.progress}%, #e2e8f0 ${status.progress}%)`
                            }}
                          >
                            <div className="circleInner">
                              <span>{status.progress}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Crop Basic Info */}
                    <div className="cropBasicInfo">
                      <div className="seedInfo">
                        <h3>{crop.seedType || 'Unknown Seed'}</h3>
                        <div className="cropMeta">
                          <span className="region">
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                            {crop.region || 'Unknown Region'}
                          </span>
                          <span className="acres">
                            <FontAwesomeIcon icon={faSeedling} />
                            {crop.acres || 0} acres
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Farmer Details Section */}
                    <div className="farmerSection">
                      <div className="sectionHeader">
                        <FontAwesomeIcon icon={faUsers} />
                        <span>Farmer Details</span>
                      </div>
                      <div className="farmerContent">
                        <div className="farmerAvatar">
                          {getInitials(crop.farmerDetails)}
                        </div>
                        <div className="farmerInfo">
                          <h4>{crop.farmerDetails?.firstName} {crop.farmerDetails?.lastName}</h4>
                          <div className="farmerDetails">
                            <div className="detailItem">
                              <FontAwesomeIcon icon={faMapMarkerAlt} />
                              <span>{crop.farmerDetails?.village || 'Unknown Village'}</span>
                            </div>
                            <div className="detailItem">
                              <FontAwesomeIcon icon={faMobile} />
                              <span>{crop.farmerDetails?.mobile || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="cardFooter">
                      <div className="lastUpdated">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        Updated: {formatDate(crop.updatedAt || crop.createdAt)}
                      </div>
                      <div className="viewDetails">
                        View Details
                        <FontAwesomeIcon icon={faChevronRight} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
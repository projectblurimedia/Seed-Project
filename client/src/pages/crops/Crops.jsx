import './crops.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSearch,
  faFilter,
  faPlus,
  faSeedling,
  faMapMarkerAlt,
  faRupeeSign,
  faCalendarAlt,
  faChevronRight,
  faUsers,
  faTractor,
  faClipboardCheck,
  faMale,
  faFemale,
  faXmark,
  faSlidersH,
  faRefresh,
  faExclamationTriangle,
  faSortUp,
  faSortDown,
  faEdit
} from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const Crops = () => {
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('ALL')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [availableRegions, setAvailableRegions] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const navigate = useNavigate()

  // Fetch crops data from API
  const fetchCropsData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get('/crops')
      const cropsData = response.data
      
      setCrops(cropsData)
      
      // Extract unique regions for filter
      const regions = [...new Set(cropsData.map(crop => crop.region).filter(Boolean))]
      setAvailableRegions(['ALL', ...regions])
      
    } catch (error) {
      console.error('Error fetching crops data:', error)
      setError('Failed to load crops data. Please try again.')
      setCrops([])
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

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Harvested': return faTractor
      case 'Second Detaching':
      case 'First Detaching': return faClipboardCheck
      case 'Female Sowing': return faFemale
      case 'Male Sowing': return faMale
      case 'Field Created': return faSeedling
      default: return faSeedling
    }
  }

  // Calculate total expenses
  const calculateTotalExpenses = (crop) => {
    const pesticides = crop.pesticideEntries?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0
    const coolies = crop.coolieEntries?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0
    const payments = crop.paymentEntries?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0
    return pesticides + coolies + payments
  }

  // Calculate profit/loss
  const calculateProfitLoss = (crop) => {
    const income = crop.totalIncome || 0
    const expenses = calculateTotalExpenses(crop)
    return income - expenses
  }

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '₹0'
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
    return `₹${amount}`
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
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  // Filter and sort crops
  const filteredAndSortedCrops = crops
    .filter(crop => {
      // Search filter
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = 
        crop.seedType?.toLowerCase().includes(searchLower) ||
        crop.region?.toLowerCase().includes(searchLower) ||
        `${crop.farmerDetails?.firstName} ${crop.farmerDetails?.lastName}`.toLowerCase().includes(searchLower)

      // Region filter
      const matchesRegion = selectedRegion === 'ALL' || crop.region === selectedRegion

      // Status filter
      const cropStatus = getCropStatus(crop).status
      const matchesStatus = selectedStatus === 'ALL' || cropStatus === selectedStatus

      return matchesSearch && matchesRegion && matchesStatus
    })
    .sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'farmerName':
          aValue = `${a.farmerDetails?.firstName} ${a.farmerDetails?.lastName}`.toLowerCase()
          bValue = `${b.farmerDetails?.firstName} ${b.farmerDetails?.lastName}`.toLowerCase()
          break
        case 'acres':
          aValue = a.acres || 0
          bValue = b.acres || 0
          break
        case 'income':
          aValue = a.totalIncome || 0
          bValue = b.totalIncome || 0
          break
        case 'expenses':
          aValue = calculateTotalExpenses(a)
          bValue = calculateTotalExpenses(b)
          break
        case 'updatedAt':
          aValue = new Date(a.updatedAt || a.createdAt).getTime()
          bValue = new Date(b.updatedAt || b.createdAt).getTime()
          break
        default:
          aValue = a[sortBy] || 0
          bValue = b[sortBy] || 0
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

  // Handle sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortBy !== field) return null
    return sortOrder === 'asc' ? faSortUp : faSortDown
  }

  const handleEditCrop = (crop, e) => {
    e.stopPropagation() 
    navigate(`/update-crop/${crop._id}`)
  }

  const handleCreateCrop = () => {
    navigate('/select-farmer')
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedRegion('ALL')
    setSelectedStatus('ALL')
    setShowFilters(false)
  }

  // Check if any filter is active
  const hasActiveFilters = searchTerm || selectedRegion !== 'ALL' || selectedStatus !== 'ALL'

  if (loading) {
    return (
      <div className="cropsPage">
        <div className="loadingState">
          <div className="spinner"></div>
          <p>Loading crops data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="cropsPage">
        <div className="errorState">
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
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cropsPage">
      {/* Advanced Header */}
      <div className="advancedHeader">
        <div className="headerContent">
          <div className="headerMain">
            <div className="titleSection">
              <div className="titleIcon">
                <FontAwesomeIcon icon={faSeedling} />
              </div>
              <div className="titleText">
                <h1>Crop Management</h1>
                <p>Monitor and manage your agricultural operations</p>
              </div>
            </div>
            <div className="headerActions">
              <button 
                className="addCropBtn"
                onClick={handleCreateCrop}
              >
                <FontAwesomeIcon icon={faPlus} />
                Add Crop
              </button>
            </div>
          </div>

          {/* Advanced Search and Controls */}
          <div className="advancedControls">
            <div className={`searchContainer ${isSearchFocused ? 'focused' : ''}`}>
              <FontAwesomeIcon icon={faSearch} className="searchIcon" />
              <input
                type="text"
                placeholder="Search crops..."
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
                      <label>Region</label>
                      <select 
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="filterSelect"
                      >
                        <option value="ALL">All Regions</option>
                        {availableRegions.filter(region => region !== 'ALL').map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
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
              {selectedRegion !== 'ALL' && (
                <span className="filterTag">
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
        </div>
      </div>

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
          <div className="statIcon income">
            <FontAwesomeIcon icon={faRupeeSign} />
          </div>
          <div className="statContent">
            <h3>{formatCurrency(crops.reduce((sum, crop) => sum + (crop.totalIncome || 0), 0))}</h3>
            <p>Total Income</p>
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
      </div>

      {/* Crops Table */}
      <div className="cropsTableContainer">
        <div className="tableHeader">
          <h3>All Crops ({filteredAndSortedCrops.length})</h3>
          <div className="sortOptions">
            <span>Sort by:</span>
            <button 
              className={`sortBtn ${sortBy === 'updatedAt' ? 'active' : ''}`}
              onClick={() => handleSort('updatedAt')}
            >
              Last Updated 
              {getSortIcon('updatedAt') && <FontAwesomeIcon icon={getSortIcon('updatedAt')} />}
            </button>
            <button 
              className={`sortBtn ${sortBy === 'acres' ? 'active' : ''}`}
              onClick={() => handleSort('acres')}
            >
              Land Area
              {getSortIcon('acres') && <FontAwesomeIcon icon={getSortIcon('acres')} />}
            </button>
            <button 
              className={`sortBtn ${sortBy === 'income' ? 'active' : ''}`}
              onClick={() => handleSort('income')}
            >
              Income
              {getSortIcon('income') && <FontAwesomeIcon icon={getSortIcon('income')} />}
            </button>
          </div>
        </div>

        {filteredAndSortedCrops.length === 0 ? (
          <div className="emptyState">
            <FontAwesomeIcon icon={faSeedling} className="emptyIcon" />
            <h3>No Crops Found</h3>
            <p>No crops match your search criteria. Try adjusting your filters.</p>
            {hasActiveFilters && (
              <button className="clearFiltersBtn" onClick={clearAllFilters}>
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="cropsGrid">
            {filteredAndSortedCrops.map((crop) => {
              const status = getCropStatus(crop)
              const expenses = calculateTotalExpenses(crop)
              const profitLoss = calculateProfitLoss(crop)
              
              return (
                <div 
                  key={crop._id} 
                  className="cropCard"
                  onClick={() => navigate(`/crops/${crop._id}`)}
                >
                  <div className="cardHeader">
                    <div className="cropBasicInfo">
                      <div className="seedType">
                        <FontAwesomeIcon icon={faSeedling} />
                        <h3>{crop.seedType || 'Unknown Seed'}</h3>
                      </div>
                      <div 
                        className="statusBadge"
                        style={{ 
                          backgroundColor: `${getStatusColor(status.status)}15`,
                          color: getStatusColor(status.status),
                          borderColor: getStatusColor(status.status)
                        }}
                      >
                        <FontAwesomeIcon icon={getStatusIcon(status.status)} />
                        {status.status}
                      </div>
                    </div>
                    <div className="headerActions">
                      <button 
                        className="editBtn"
                        onClick={(e) => handleEditCrop(crop, e)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <FontAwesomeIcon icon={faChevronRight} className="arrowIcon" />
                    </div>
                  </div>

                  <div className="farmerSection">
                    <div className="farmerAvatar">
                      {getInitials(crop.farmerDetails)}
                    </div>
                    <div className="farmerInfo">
                      <h4>{crop.farmerDetails?.firstName} {crop.farmerDetails?.lastName}</h4>
                      <div className="farmerMeta">
                        <span className="region">
                          <FontAwesomeIcon icon={faMapMarkerAlt} />
                          {crop.region || 'Unknown Region'}
                        </span>
                        <span className="mobile">{crop.farmerDetails?.mobile || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="progressSection">
                    <div className="progressHeader">
                      <span>Crop Progress</span>
                      <span>{status.progress}%</span>
                    </div>
                    <div className="progressBar">
                      <div 
                        className="progressFill"
                        style={{ 
                          width: `${status.progress}%`,
                          backgroundColor: getStatusColor(status.status)
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="metricsGrid">
                    <div className="metric">
                      <label>Land Area</label>
                      <span className="value">{crop.acres || 0} acres</span>
                    </div>
                    <div className="metric">
                      <label>Total Yield</label>
                      <span className="value">{crop.yield || 0} kg</span>
                    </div>
                    <div className="metric">
                      <label>Packets</label>
                      <span className="value">
                        M: {crop.malePackets || 0} | F: {crop.femalePackets || 0}
                      </span>
                    </div>
                  </div>

                  <div className="financialSection">
                    <div className="financialMetric">
                      <span className="label">Income</span>
                      <span className="amount income">{formatCurrency(crop.totalIncome || 0)}</span>
                    </div>
                    <div className="financialMetric">
                      <span className="label">Expenses</span>
                      <span className="amount expense">{formatCurrency(expenses)}</span>
                    </div>
                    <div className="financialMetric">
                      <span className="label">Profit/Loss</span>
                      <span className={`amount ${profitLoss >= 0 ? 'profit' : 'loss'}`}>
                        {formatCurrency(Math.abs(profitLoss))} {profitLoss >= 0 ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>

                  <div className="cardFooter">
                    <div className="lastUpdated">
                      <FontAwesomeIcon icon={faCalendarAlt} />
                      Updated: {formatDate(crop.updatedAt || crop.createdAt)}
                    </div>
                    <div className="viewDetails">
                      View Details
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
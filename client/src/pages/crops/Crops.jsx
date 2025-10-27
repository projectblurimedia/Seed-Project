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
  faWater,
  faSprayCan,
  faMale,
  faFemale,
  faSort,
  faSortUp,
  faSortDown
} from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const Crops = () => {
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('ALL')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [availableRegions, setAvailableRegions] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const navigate = useNavigate()

  // Fetch crops data from API
  useEffect(() => {
    const fetchCropsData = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/crops')
        const cropsData = response.data
        
        setCrops(cropsData)
        
        // Extract unique regions for filter
        const regions = [...new Set(cropsData.map(crop => crop.region).filter(Boolean))]
        setAvailableRegions(['ALL', ...regions])
        
      } catch (error) {
        console.error('Error fetching crops data:', error)
        setCrops([])
      } finally {
        setLoading(false)
      }
    }

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
    if (sortBy !== field) return faSort
    return sortOrder === 'asc' ? faSortUp : faSortDown
  }

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

  return (
    <div className="cropsPage">
      {/* Header */}
      <div className="pageHeader">
        <div className="headerLeft">
          <h1>Crop Management</h1>
          <p>Manage and monitor all your crops in one place</p>
        </div>
        <button 
          className="addCropBtn"
          onClick={() => navigate('/create-crop')}
        >
          <FontAwesomeIcon icon={faPlus} />
          Add New Crop
        </button>
      </div>

      {/* Search and Filters */}
      <div className="controlsSection">
        <div className="searchBox">
          <FontAwesomeIcon icon={faSearch} className="searchIcon" />
          <input
            type="text"
            placeholder="Search crops by seed type, region, or farmer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filterControls">
          <button 
            className="filterToggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FontAwesomeIcon icon={faFilter} />
            Filters
          </button>

          {showFilters && (
            <div className="filterDropdowns">
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
            <h3>{new Set(crops.map(crop => crop.farmerId)).size}</h3>
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
              Last Updated <FontAwesomeIcon icon={getSortIcon('updatedAt')} />
            </button>
            <button 
              className={`sortBtn ${sortBy === 'acres' ? 'active' : ''}`}
              onClick={() => handleSort('acres')}
            >
              Land Area <FontAwesomeIcon icon={getSortIcon('acres')} />
            </button>
            <button 
              className={`sortBtn ${sortBy === 'income' ? 'active' : ''}`}
              onClick={() => handleSort('income')}
            >
              Income <FontAwesomeIcon icon={getSortIcon('income')} />
            </button>
          </div>
        </div>

        {filteredAndSortedCrops.length === 0 ? (
          <div className="emptyState">
            <FontAwesomeIcon icon={faSeedling} className="emptyIcon" />
            <h3>No Crops Found</h3>
            <p>No crops match your search criteria. Try adjusting your filters.</p>
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
                    <FontAwesomeIcon icon={faChevronRight} className="arrowIcon" />
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
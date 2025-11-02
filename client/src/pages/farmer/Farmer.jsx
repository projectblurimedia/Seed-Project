import './farmer.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faChevronLeft, 
  faUser, 
  faIdCard, 
  faPhone, 
  faMapMarkerAlt, 
  faRupeeSign, 
  faEdit, 
  faCalendar, 
  faSeedling, 
  faTractor,
  faPlus,
  faExclamationTriangle,
  faRefresh,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Toast } from '../../components/toast/Toast'

export const Farmer = () => {
  const navigate = useNavigate()
  const { aadhar } = useParams()
  const [farmerData, setFarmerData] = useState(null)
  const [cropsData, setCropsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)

  // Show toast message
  const showToast = (message, type = 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }

  useEffect(() => {
    const fetchFarmerDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch farmer details
        const farmerResponse = await axios.get(`/farmers/${aadhar}`)
        setFarmerData(farmerResponse.data)
        
        // Fetch farmer's crops
        const cropsResponse = await axios.get(`/crops/farmer/${aadhar}`)
        setCropsData(cropsResponse.data)
        
      } catch (err) {
        console.error('Error fetching data:', err)
        const errorMessage = err.response?.data?.message || 'Failed to load farmer details. Please try again.'
        setError(errorMessage)
        showToast(errorMessage, 'error')
      } finally {
        setLoading(false)
      }
    }

    if (aadhar) {
      fetchFarmerDetails()
    }
  }, [aadhar])

  const handleBack = () => navigate(-1)
  const handleEdit = () => navigate(`/update-farmer/${aadhar}`)
  const handleCreateCrop = () => navigate(`/create-crop/${aadhar}`)

  const handleNavigateToCrop = (id) => {
    navigate(`/crops/${id}`)
  }

  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return 'NA'
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Get crop status and corresponding date
  const getCropStatusInfo = (crop) => {
    const today = new Date()
    const harvestingDate = crop.harvestingDate ? new Date(crop.harvestingDate) : null
    
    if (harvestingDate && harvestingDate <= today) {
      return { 
        status: 'Harvested', 
        progress: 100,
        date: crop.harvestingDate,
        dateLabel: 'Harvested On'
      }
    }
    if (crop.secondDetachingDate) {
      return { 
        status: 'Second Detaching', 
        progress: 80,
        date: crop.secondDetachingDate,
        dateLabel: 'Second Detaching On'
      }
    }
    if (crop.firstDetachingDate) {
      return { 
        status: 'First Detaching', 
        progress: 60,
        date: crop.firstDetachingDate,
        dateLabel: 'First Detaching On'
      }
    }
    if (crop.sowingDateFemale) {
      return { 
        status: 'Female Sowing', 
        progress: 40,
        date: crop.sowingDateFemale,
        dateLabel: 'Female Sowing On'
      }
    }
    if (crop.sowingDateMale) {
      return { 
        status: 'Male Sowing', 
        progress: 20,
        date: crop.sowingDateMale,
        dateLabel: 'Male Sowing On'
      }
    }
    return { 
      status: 'Field Created', 
      progress: 10,
      date: crop.createdAt,
      dateLabel: 'Created On'
    }
  }

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

  // Enhanced loading state
  if (loading) {
    return (
      <div className="farmerDetailContainer">
        <div className="loadingState">
          <div className="loadingContent">
            <div className="loadingSpinner">
              <FontAwesomeIcon icon={faUser} className="spinnerIcon" />
              <div className="spinnerRing"></div>
            </div>
            <h3>Loading Farmer Details</h3>
            <p>Please wait while we fetch the information...</p>
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
      <div className="farmerDetailContainer">
        <div className="errorState">
          <div className="errorContent">
            <div className="errorIcon">
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </div>
            <h3>Unable to Load Farmer Details</h3>
            <p>{error}</p>
            <div className="errorActions">
              <button className="retryBtn" onClick={() => window.location.reload()}>
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

  // Calculate totals from crops data
  const totalCrops = cropsData?.length || 0
  const totalLand = cropsData?.reduce((sum, crop) => sum + (crop.acres || 0), 0) || 0

  return (
    <div className="farmerDetailContainer">
      {/* Toast Component */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          position="top-right"
        />
      )}

      {/* Header with Farmer Avatar and Info */}
      <div className="farmerHeader">
        <div className="left">
          <button className="backButton" onClick={handleBack}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <div className="farmerHeaderInfo">
            <div className="avatarWithStatus">
              <div className="farmerAvatar">
                {getInitials(farmerData.firstName, farmerData.lastName)}
              </div>
              {farmerData.status?.toLowerCase() === 'active' && (
                <div className="statusDot active"></div>
              )}
            </div>
            <div className="farmerTextInfo">
              <h2>{farmerData.firstName} {farmerData.lastName}</h2>
              <p className="joinDate">
                <FontAwesomeIcon icon={faCalendar} />
                Joined {formatDate(farmerData.createdAt)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="right">
          <div className="navIcons">  
            <button 
              className="iconBtn addCropBtn"
              onClick={handleCreateCrop}
              aria-label="Add Crop"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>

            <button 
              className="iconBtn editBtn"
              onClick={handleEdit}
              aria-label="Edit Farmer"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pageContent">
        <div className="farmerContainer">
          {/* Stats Cards (Previous Design) */}
          <div className="statsOverview">
            <div className="statCard">
              <div className="statIcon crops">
                <FontAwesomeIcon icon={faSeedling} />
              </div>
              <div className="statContent">
                <h3>{totalCrops}</h3>
                <p>Total Crops</p>
              </div>
            </div>
            <div className="statCard">
              <div className="statIcon land">
                <FontAwesomeIcon icon={faTractor} />
              </div>
              <div className="statContent">
                <h3>{totalLand.toFixed(1)}</h3>
                <p>Land Area (acres)</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="infoSection">
            <div className="sectionHeader">
              <h3>Personal Information</h3>
            </div>
            <div className="infoCardsGrid">
              <div className="infoCard">
                <div className="cardHeader identity">
                  <div className="cardIcon">
                    <FontAwesomeIcon icon={faIdCard} />
                  </div>
                  <h4>Identity</h4>
                </div>
                <div className="cardContent">
                  <div className="infoField">
                    <label>Aadhar Number</label>
                    <p>{farmerData.aadhar || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="infoCard">
                <div className="cardHeader contact">
                  <div className="cardIcon">
                    <FontAwesomeIcon icon={faPhone} />
                  </div>
                  <h4>Contact</h4>
                </div>
                <div className="cardContent">
                  <div className="infoField">
                    <label>Mobile Number</label>
                    <p>{farmerData.mobile || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="infoCard">
                <div className="cardHeader financial">
                  <div className="cardIcon">
                    <FontAwesomeIcon icon={faRupeeSign} />
                  </div>
                  <h4>Financial</h4>
                </div>
                <div className="cardContent">
                  <div className="infoField">
                    <label>Account Number</label>
                    <p>{farmerData.bankAccountNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="infoCard">
                <div className="cardHeader village">
                  <div className="cardIcon">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </div>
                  <h4>Location</h4>
                </div>
                <div className="cardContent">
                  <div className="infoField">
                    <label>Village</label>
                    <p>{farmerData.village || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Crops Section */}
          <div className="cropsSection">
            <div className="sectionHeader">
              <h3>Recent Crops ({totalCrops})</h3>
            </div>
            
            {totalCrops === 0 ? (
              <div className="emptyState">
                <div className="emptyIllustration">
                  <FontAwesomeIcon icon={faSeedling} className="emptyIcon" />
                </div>
                <h3>No Crops Found</h3>
                <p>This farmer doesn't have any crops registered yet.</p>
                <button 
                  className="addFirstCropBtn"
                  onClick={handleCreateCrop}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Add First Crop
                </button>
              </div>
            ) : (
              <div className="cropsGrid">
                {cropsData?.map((crop) => {
                  const statusInfo = getCropStatusInfo(crop)
                  
                  return (
                    <div 
                      key={crop._id} 
                      className="cropCard"
                      onClick={() => handleNavigateToCrop(crop._id)}
                    >
                      {/* Status Banner */}
                      <div 
                        className="statusBanner"
                        style={{ 
                          background: getStatusBackground(statusInfo.status),
                          borderLeft: `4px solid ${getStatusColor(statusInfo.status)}`
                        }}
                      >
                        <div className="statusContent">
                          <div className="statusInfo">
                            <FontAwesomeIcon 
                              icon={faSeedling} 
                              className="statusIcon"
                              style={{ color: getStatusColor(statusInfo.status) }}
                            />
                            <div className="statusText">
                              <span className="statusLabel">Crop Status</span>
                              <span 
                                className="statusValue"
                                style={{ color: getStatusColor(statusInfo.status) }}
                              >
                                {statusInfo.status}
                              </span>
                            </div>
                          </div>
                          <div className="progressCircle">
                            <div 
                              className="circleBackground"
                              style={{ 
                                background: `conic-gradient(${getStatusColor(statusInfo.status)} ${statusInfo.progress}%, #e2e8f0 ${statusInfo.progress}%)`
                              }}
                            >
                              <div className="circleInner">
                                <span>{statusInfo.progress}%</span>
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

                      {/* Crop Date Info */}
                      <div className="cropDateInfo">
                        <div className="dateCard highlighted">
                          <div className="dateLabel">{statusInfo.dateLabel}</div>
                          <div className="dateValue">{formatDate(statusInfo.date)}</div>
                        </div>
                      </div>

                      <div className="cardFooter">
                        <div className="lastUpdated">
                          <FontAwesomeIcon icon={faCalendar} />
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
    </div>
  )
}
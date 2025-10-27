import './farmer.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faUser, faIdCard, faPhone, faMapMarkerAlt, faRupeeSign, faEdit, faCalendar, faSeedling, faTractor } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

export const Farmer = () => {
  const navigate = useNavigate()
  const { aadhar } = useParams()
  const [farmerData, setFarmerData] = useState(null)
  const [cropsData, setCropsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFarmerDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch farmer details
        const farmerResponse = await axios.get(`/farmers/${aadhar}`)
        setFarmerData(farmerResponse.data)
        
        const cropsResponse = await axios.get(`/crops/farmer/${aadhar}`)
        setCropsData(cropsResponse.data)
        
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load farmer details. Please try again.')
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

  const handleNavigateToCrop = (id) => {
    navigate(`/crops/${id}`)
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Loading State
  if (loading) {
    return (
      <div className="farmerDetailContainer">
        <div className="loadingState">
          <div className="spinner"></div>
          <p>Loading farmer details...</p>
        </div>
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="farmerDetailContainer">
        <div className="errorState">
          <div className="errorIcon">⚠️</div>
          <h3>Unable to Load Farmer Details</h3>
          <p>{error}</p>
          <button className="retryBtn" onClick={() => window.location.reload()}>
            Try Again
          </button>
          <button className="backBtn" onClick={handleBack}>
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Calculate totals from crops data
  const totalCrops = cropsData?.length
  const totalLand = cropsData?.reduce((sum, crop) => sum + (crop.acres || 0), 0)

  return (
    <div className="farmerDetailContainer">
      <div className="detailCard">
        {/* Header */}
        <div className="detailHeader">
          <button className="backBtn" onClick={handleBack}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h1>Farmer Details</h1>
          <button className="editBtn" onClick={handleEdit}>
            <FontAwesomeIcon icon={faEdit} />
            Edit
          </button>
        </div>

        {/* Profile Section with Stats */}
        <div className="profileSection">
          <div className="profileMain">
            <div className="avatar">
              {getInitials(farmerData.firstName, farmerData.lastName)}
            </div>
            <div className="profileInfo">
              <h2>{farmerData.firstName} {farmerData.lastName}</h2>
              <div className="profileMeta">
                <span className={`statusBadge ${farmerData.status?.toLowerCase() || 'active'}`}>
                  {farmerData.status || 'Active'}
                </span>
                <span className="joinDate">
                  <FontAwesomeIcon icon={faCalendar} />
                  Joined {farmerData.createdAt ? formatDate(farmerData.createdAt) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Stats Circles */}
          <div className="profileStats">
            <div className="statCircle">
              <div className="circleIcon crops">
                <FontAwesomeIcon icon={faSeedling} />
              </div>
              <div className="circleInfo">
                <h3>{totalCrops}</h3>
                <p>Total Crops</p>
              </div>
            </div>
            <div className="statCircle">
              <div className="circleIcon land">
                <FontAwesomeIcon icon={faTractor} />
              </div>
              <div className="circleInfo">
                <h3>{totalLand?.toFixed(1)}</h3>
                <p>Land Area</p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Cards */}
        <div className="infoSection">
          <h3>Personal Information</h3>
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
                  <p>{farmerData.aadhar}</p>
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
                <h4>Village</h4>
              </div>
              <div className="cardContent">
                <div className="infoField">
                  <label>Location</label>
                  <p>{farmerData.village || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Crops */}
        <div className="cropsSection">
          <div className="sectionHeader">
            <h3>Recent Crops</h3>
          </div>
          {cropsData?.length === 0 ? (
            <div className="noCropsMessage">
              <p>No crops found for this farmer.</p>
            </div>
          ) : (
            <div className="cropsGrid">
              {cropsData?.map((crop, index) => (
                <div key={crop._id || index} className="cropCard" onClick={() => handleNavigateToCrop(crop._id)}>
                  <div className="cropHeader">
                    <div className="cropIcon">🌽</div>
                    <div className={`cropStatus ${crop.status?.toLowerCase() || 'active'}`}>
                      {crop.status || 'Active'}
                    </div>
                  </div>
                  <div className="cropInfo">
                    <h4>{crop.seedType} - Season {index + 1}</h4>
                    <p>
                      {crop.sowingDateMale 
                        ? `Planted on ${formatDate(crop.sowingDateMale)}`
                        : 'Planting date not available'
                      }
                    </p>
                  </div>
                  <div className="cropStats">
                    <div className="cropStat">
                      <span className="statLabel">Area</span>
                      <span className="statValue">{crop.acres || 0} acres</span>
                    </div>
                    <div className="cropStat">
                      <span className="statLabel">Yield</span>
                      <span className="statValue">{crop.yield || 0} kg</span>
                    </div>
                  </div>
                  <div className="cropEarnings">
                    {formatCurrency(crop.totalIncome || 0)}
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
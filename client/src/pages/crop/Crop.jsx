import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faSeedling, faMapMarkerAlt, faRupeeSign, faWeight, faEdit, faUsers, faSprayCanSparkles, faCalendar, faUser, faMobileAlt, faCreditCard, faHandHoldingUsd, faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons'
import './crop.scss'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

export const Crop = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cropData, setCropData] = useState(null)

  // Fetch crop details by ID
  useEffect(() => {
    const fetchCropDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch crop details by ID
        const response = await axios.get(`/crops/${id}`)
        setCropData(response.data)
        
      } catch (err) {
        console.error('Error fetching crop details:', err)
        setError('Failed to load crop details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCropDetails()
    }
  }, [id])

  const handleBack = () => navigate('/')
  const handleEdit = () => navigate(`/update-crop/${id}`)

  const getInitials = (fullName) => {
    if (!fullName) return 'NA'
    return fullName.split(' ').map(name => name.charAt(0)).join('').toUpperCase()
  }

  // Calculate totals from crop data
  const calculateTotalPesticides = () => {
    if (!cropData?.pesticideEntries) return 0
    return cropData.pesticideEntries.reduce((total, item) => total + (item.amount || 0), 0)
  }

  const calculateTotalCoolies = () => {
    if (!cropData?.coolieEntries) return 0
    return cropData.coolieEntries.reduce((total, item) => total + (item.amount || 0), 0)
  }

  const calculateTotalPayments = () => {
    if (!cropData?.paymentEntries) return 0
    return cropData.paymentEntries.reduce((total, item) => total + (item.amount || 0), 0)
  }

  const calculateTotalExpenses = () => {
    return calculateTotalPesticides() + calculateTotalCoolies() + calculateTotalPayments()
  }

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'Cash': return faIndianRupeeSign
      case 'PhonePe': return faMobileAlt
      case 'Bank Transfer': return faCreditCard
      default: return faHandHoldingUsd
    }
  }

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'Cash': return '#10b981'
      case 'PhonePe': return '#3b82f6'
      case 'Bank Transfer': return '#8b5cf6'
      default: return '#64748b'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN')
  }

  // Loading State
  if (loading) {
    return (
      <div className="cropDetailContainer">
        <div className="loadingState">
          <div className="spinner"></div>
          <p>Loading crop details...</p>
        </div>
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="cropDetailContainer">
        <div className="errorState">
          <div className="errorIcon">⚠️</div>
          <h3>Unable to Load Crop Details</h3>
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

  // If no crop data found
  if (!cropData) {
    return (
      <div className="cropDetailContainer">
        <div className="errorState">
          <div className="errorIcon">❌</div>
          <h3>Crop Not Found</h3>
          <p>The requested crop details could not be found.</p>
          <button className="backBtn" onClick={handleBack}>
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cropDetailContainer">
      <div className="detailCard">
        {/* Header */}
        <div className="detailHeader">
          <button className="backBtn" onClick={handleBack}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h1>Crop Details</h1>
          <button className="editBtn" onClick={handleEdit}>
            <FontAwesomeIcon icon={faEdit} />
            Edit
          </button>
        </div>

        {/* Crop Overview & Farmer Profile */}
        <div className="overviewSection">
          <div className="cropOverview">
            <div className="cropIcon">
              <FontAwesomeIcon icon={faSeedling} />
            </div>
            <div className="cropInfo">
              <h2>{cropData.seedType || 'N/A'}</h2>
              <div className="cropMeta">
                <span className={`statusBadge ${cropData.status?.toLowerCase() || 'active'}`}>
                  {cropData.status || 'Active'}
                </span>
                <span className="region">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  {cropData.region || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="farmerProfile">
            <div className="profileMain">
              <div className="avatar">
                {getInitials(cropData.farmerDetails?.firstName + ' ' + cropData.farmerDetails?.lastName)}
              </div>
              <div className="profileInfo">
                <h3>{cropData.farmerDetails?.firstName} {cropData.farmerDetails?.lastName}</h3>
                <div className="profileMeta">
                  <span className="mobile">
                    <FontAwesomeIcon icon={faUser} />
                    {cropData.farmerDetails?.mobile || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="metricsGrid">
          <div className="metricCard">
            <div className="metricIcon land">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </div>
            <div className="metricContent">
              <h3>{cropData.acres || 0}</h3>
              <p>Land Area</p>
            </div>
          </div>
          <div className="metricCard">
            <div className="metricIcon yield">
              <FontAwesomeIcon icon={faWeight} />
            </div>
            <div className="metricContent">
              <h3>{cropData.yield || 0}</h3>
              <p>Total Yield</p>
            </div>
          </div>
          <div className="metricCard">
            <div className="metricIcon payment">
              <FontAwesomeIcon icon={faRupeeSign} />
            </div>
            <div className="metricContent">
              <h3>₹{((cropData.totalIncome || 0)/1000).toFixed(0)}K</h3>
              <p>Total Income</p>
            </div>
          </div>
          <div className="metricCard">
            <div className="metricIcon expenses">
              <FontAwesomeIcon icon={faRupeeSign} />
            </div>
            <div className="metricContent">
              <h3>₹{(calculateTotalExpenses()/1000).toFixed(0)}K</h3>
              <p>Total Expenses</p>
            </div>
          </div>
        </div>

        {/* Seed Packets */}
        <div className="packetSection">
          <h3>Seed Packets</h3>
          <div className="packetCardsGrid">
            <div className="packetCard">
              <div className="cardHeader male">
                <div className="cardIcon">
                  <FontAwesomeIcon icon={faSeedling} />
                </div>
                <h4>Male Packets</h4>
              </div>
              <div className="cardContent">
                <div className="packetCount">{cropData.malePackets || 0}</div>
                <p>Packets</p>
              </div>
            </div>

            <div className="packetCard">
              <div className="cardHeader female">
                <div className="cardIcon">
                  <FontAwesomeIcon icon={faSeedling} />
                </div>
                <h4>Female Packets</h4>
              </div>
              <div className="cardContent">
                <div className="packetCount">{cropData.femalePackets || 0}</div>
                <p>Packets</p>
              </div>
            </div>

            <div className="packetCard">
              <div className="cardHeader total">
                <div className="cardIcon">
                  <FontAwesomeIcon icon={faSeedling} />
                </div>
                <h4>Total Packets</h4>
              </div>
              <div className="cardContent">
                <div className="packetCount">{(cropData.malePackets || 0) + (cropData.femalePackets || 0)}</div>
                <p>Packets</p>
              </div>
            </div>
          </div>
        </div>

        {/* Crop Timeline */}
        <div className="timelineSection">
          <h3>Crop Timeline</h3>
          <div className="timeline">
            <div className="timelineItem">
              <div className="timelineDot male"></div>
              <div className="timelineContent">
                <h4>Male Sowing</h4>
                <p>{formatDate(cropData.sowingDateMale)}</p>
              </div>
            </div>
            <div className="timelineItem">
              <div className="timelineDot female"></div>
              <div className="timelineContent">
                <h4>Female Sowing</h4>
                <p>{formatDate(cropData.sowingDateFemale)}</p>
              </div>
            </div>
            <div className="timelineItem">
              <div className="timelineDot detach"></div>
              <div className="timelineContent">
                <h4>First Detaching</h4>
                <p>{formatDate(cropData.firstDetachingDate)}</p>
              </div>
            </div>
            <div className="timelineItem">
              <div className="timelineDot detach"></div>
              <div className="timelineContent">
                <h4>Second Detaching</h4>
                <p>{formatDate(cropData.secondDetachingDate)}</p>
              </div>
            </div>
            <div className="timelineItem">
              <div className="timelineDot harvest"></div>
              <div className="timelineContent">
                <h4>Harvesting</h4>
                <p>{formatDate(cropData.harvestingDate)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pesticides & Fertilizers */}
        {cropData.pesticideEntries && cropData.pesticideEntries.length > 0 && (
          <div className="expenseSection pesticides">
            <div className="sectionHeader">
              <h3>Fertilizers & Crop Care</h3>
              <span className="totalAmount">₹{calculateTotalPesticides().toLocaleString()}</span>
            </div>
            <div className="expenseCardsGrid">
              {cropData.pesticideEntries.map((item, index) => (
                <div key={index} className="expenseCard">
                  <div className="expenseHeader">
                    <div className="expenseIcon pesticide">
                      <FontAwesomeIcon icon={faSprayCanSparkles} />
                    </div>
                    <div className="expenseTitle">
                      <h4>{item.pesticide || 'N/A'}</h4>
                      <span className="quantity">{item.quantity || 0} {item.quantity ? 'kg/liters' : ''}</span>
                    </div>
                  </div>
                  <div className="expenseDetails">
                    <div className="expenseDate">
                      <FontAwesomeIcon icon={faCalendar} />
                      {formatDate(item.date)}
                    </div>
                    <div className="expenseAmount">₹{(item.amount || 0).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coolie Information */}
        {cropData.coolieEntries && cropData.coolieEntries.length > 0 && (
          <div className="expenseSection coolies">
            <div className="sectionHeader">
              <h3>Labor & Workforce</h3>
              <span className="totalAmount">₹{calculateTotalCoolies().toLocaleString()}</span>
            </div>
            <div className="expenseCardsGrid">
              {cropData.coolieEntries.map((item, index) => (
                <div key={index} className="expenseCard">
                  <div className="expenseHeader">
                    <div className="expenseIcon coolie">
                      <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <div className="expenseTitle">
                      <h4>{item.work || 'Labor Work'}</h4>
                      <span className="quantity">{item.count || 0} workers • {item.days || 1} days</span>
                    </div>
                  </div>
                  <div className="expenseDetails">
                    <div className="expenseDate">
                      <FontAwesomeIcon icon={faCalendar} />
                      {formatDate(item.date)}
                    </div>
                    <div className="expenseAmount">₹{(item.amount || 0).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payments to Farmer */}
        {cropData.paymentEntries && cropData.paymentEntries.length > 0 && (
          <div className="expenseSection payments">
            <div className="sectionHeader">
              <h3>Farmer Payments</h3>
              <span className="totalAmount">₹{calculateTotalPayments().toLocaleString()}</span>
            </div>
            <div className="expenseCardsGrid">
              {cropData.paymentEntries.map((item, index) => (
                <div key={index} className="expenseCard">
                  <div className="expenseHeader">
                    <div 
                      className="expenseIcon payment"
                      style={{ background: getPaymentMethodColor(item.method) }}
                    >
                      <FontAwesomeIcon icon={getPaymentMethodIcon(item.method)} />
                    </div>
                    <div className="expenseTitle">
                      <h4>{item.purpose || 'Payment'}</h4>
                      <span className="quantity">{item.method || 'Cash'}</span>
                    </div>
                  </div>
                  <div className="expenseDetails">
                    <div className="expenseDate">
                      <FontAwesomeIcon icon={faCalendar} />
                      {formatDate(item.date)}
                    </div>
                    <div className="expenseAmount">₹{(item.amount || 0).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Financial Summary */}
        <div className="financialSection">
          <h3>Financial Summary</h3>
          <div className="financialCards">
            <div className="financialCard">
              <div className="cardHeader expenses">
                <h4>Total Expenses</h4>
              </div>
              <div className="cardContent">
                <div className="amount negative">₹{calculateTotalExpenses().toLocaleString()}</div>
                <div className="breakdown">
                  <span>Fertilizers: ₹{calculateTotalPesticides().toLocaleString()}</span>
                  <span>Labor: ₹{calculateTotalCoolies().toLocaleString()}</span>
                  <span>Farmer Payments: ₹{calculateTotalPayments().toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="financialCard">
              <div className="cardHeader income">
                <h4>Total Income</h4>
              </div>
              <div className="cardContent">
                <div className="amount positive">₹{(cropData.totalIncome || 0).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
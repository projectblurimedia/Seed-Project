import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faSeedling, faMapMarkerAlt, faRupeeSign, faWeight, faEdit, faUsers, faSprayCanSparkles, faCalendar, faUser, faMoneyBillWave, faMobileAlt, faCreditCard, faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons'
import './crop.scss'
import { useNavigate } from 'react-router-dom'

export const Crop = () => {
  const navigate = useNavigate()

  // Static crop data
  const cropData = {
    id: 'CROP001',
    seedType: 'Babycorn Seed',
    region: 'Jangareddygudem',
    acres: 5.5,
    malePackets: 25,
    femalePackets: 30,
    sowingDateMale: '2024-03-15',
    sowingDateFemale: '2024-03-20',
    firstDetachingDate: '2024-04-10',
    secondDetachingDate: '2024-04-25',
    harvestingDate: '2024-06-15',
    totalPayment: 25000,
    yield: 1200,
    status: 'Harvested',
    farmerName: 'Rajesh Kumar',
    farmerMobile: '+91 98765 43210'
  }

  const pesticideData = [
    { name: 'Urea Fertilizer', quantity: '50 kg', amount: 1500, date: '2024-03-25', supplier: 'Agro Mart' },
    { name: 'DAP Fertilizer', quantity: '25 kg', amount: 2000, date: '2024-04-05', supplier: 'Agro Mart' },
    { name: 'Organic Manure', quantity: '100 kg', amount: 3000, date: '2024-03-20', supplier: 'Local Vendor' },
    { name: 'Pesticide Spray', quantity: '5 liters', amount: 1200, date: '2024-04-15', supplier: 'Crop Care' }
  ]

  const coolieData = [
    { count: 5, amount: 2500, work: 'Field Preparation', date: '2024-03-10', duration: '2 days' },
    { count: 3, amount: 1500, work: 'Sowing Work', date: '2024-03-15', duration: '1 day' },
    { count: 4, amount: 2000, work: 'Weeding & Maintenance', date: '2024-04-20', duration: '2 days' },
    { count: 6, amount: 3000, work: 'Harvesting Labor', date: '2024-06-15', duration: '1 day' }
  ]

  const paymentData = [
    { amount: 10000, date: '2024-03-15', purpose: 'Advance Payment', method: 'Cash' },
    { amount: 8000, date: '2024-05-20', purpose: 'Progress Payment', method: 'PhonePe' },
    { amount: 7000, date: '2024-06-20', purpose: 'Final Settlement', method: 'Bank Transfer' }
  ]

  const handleBack = () => navigate(-1)
  const handleEdit = () => navigate(`/update-crop/${cropData.id}`)

  const getInitials = (fullName) => {
    return fullName.split(' ').map(name => name.charAt(0)).join('').toUpperCase()
  }

  const calculateTotalPesticides = () => {
    return pesticideData.reduce((total, item) => total + item.amount, 0)
  }

  const calculateTotalCoolies = () => {
    return coolieData.reduce((total, item) => total + item.amount, 0)
  }

  const calculateTotalPayments = () => {
    return paymentData.reduce((total, item) => total + item.amount, 0)
  }

  const calculateTotalExpenses = () => {
    return calculateTotalPesticides() + calculateTotalCoolies() + calculateTotalPayments()
  }

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'Cash': return faMoneyBillWave
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
              <h2>{cropData.seedType}</h2>
              <div className="cropMeta">
                <span className={`statusBadge ${cropData.status.toLowerCase()}`}>
                  {cropData.status}
                </span>
                <span className="region">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  {cropData.region}
                </span>
              </div>
            </div>
          </div>

          <div className="farmerProfile">
            <div className="profileMain">
              <div className="avatar">
                {getInitials(cropData.farmerName)}
              </div>
              <div className="profileInfo">
                <h3>{cropData.farmerName}</h3>
                <div className="profileMeta">
                  <span className="mobile">
                    <FontAwesomeIcon icon={faUser} />
                    {cropData.farmerMobile}
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
              <h3>{cropData.acres}</h3>
              <p>Land Area</p>
            </div>
          </div>
          <div className="metricCard">
            <div className="metricIcon yield">
              <FontAwesomeIcon icon={faWeight} />
            </div>
            <div className="metricContent">
              <h3>{cropData.yield}</h3>
              <p>Total Yield</p>
            </div>
          </div>
          <div className="metricCard">
            <div className="metricIcon payment">
              <FontAwesomeIcon icon={faRupeeSign} />
            </div>
            <div className="metricContent">
              <h3>₹{(cropData.totalPayment/1000).toFixed(0)}K</h3>
              <p>Total Payment</p>
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
                <div className="packetCount">{cropData.malePackets}</div>
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
                <div className="packetCount">{cropData.femalePackets}</div>
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
                <div className="packetCount">{cropData.malePackets + cropData.femalePackets}</div>
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
                <p>{new Date(cropData.sowingDateMale).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
            <div className="timelineItem">
              <div className="timelineDot female"></div>
              <div className="timelineContent">
                <h4>Female Sowing</h4>
                <p>{new Date(cropData.sowingDateFemale).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
            <div className="timelineItem">
              <div className="timelineDot detach"></div>
              <div className="timelineContent">
                <h4>First Detaching</h4>
                <p>{new Date(cropData.firstDetachingDate).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
            <div className="timelineItem">
              <div className="timelineDot detach"></div>
              <div className="timelineContent">
                <h4>Second Detaching</h4>
                <p>{new Date(cropData.secondDetachingDate).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
            <div className="timelineItem">
              <div className="timelineDot harvest"></div>
              <div className="timelineContent">
                <h4>Harvesting</h4>
                <p>{new Date(cropData.harvestingDate).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pesticides & Fertilizers */}
        <div className="expenseSection pesticides">
          <div className="sectionHeader">
            <h3>Fertilizers & Crop Care</h3>
            <span className="totalAmount">₹{calculateTotalPesticides().toLocaleString()}</span>
          </div>
          <div className="expenseCardsGrid">
            {pesticideData.map((item, index) => (
              <div key={index} className="expenseCard">
                <div className="expenseHeader">
                  <div className="expenseIcon pesticide">
                    <FontAwesomeIcon icon={faSprayCanSparkles} />
                  </div>
                  <div className="expenseTitle">
                    <h4>{item.name}</h4>
                    <span className="quantity">{item.quantity}</span>
                    <span className="supplier">From {item.supplier}</span>
                  </div>
                </div>
                <div className="expenseDetails">
                  <div className="expenseDate">
                    <FontAwesomeIcon icon={faCalendar} />
                    {new Date(item.date).toLocaleDateString('en-IN')}
                  </div>
                  <div className="expenseAmount">₹{item.amount.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coolie Information */}
        <div className="expenseSection coolies">
          <div className="sectionHeader">
            <h3>Labor & Workforce</h3>
            <span className="totalAmount">₹{calculateTotalCoolies().toLocaleString()}</span>
          </div>
          <div className="expenseCardsGrid">
            {coolieData.map((item, index) => (
              <div key={index} className="expenseCard">
                <div className="expenseHeader">
                  <div className="expenseIcon coolie">
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                  <div className="expenseTitle">
                    <h4>{item.work}</h4>
                    <span className="quantity">{item.count} workers • {item.duration}</span>
                  </div>
                </div>
                <div className="expenseDetails">
                  <div className="expenseDate">
                    <FontAwesomeIcon icon={faCalendar} />
                    {new Date(item.date).toLocaleDateString('en-IN')}
                  </div>
                  <div className="expenseAmount">₹{item.amount.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payments to Farmer */}
        <div className="expenseSection payments">
          <div className="sectionHeader">
            <h3>Farmer Payments</h3>
            <span className="totalAmount">₹{calculateTotalPayments().toLocaleString()}</span>
          </div>
          <div className="expenseCardsGrid">
            {paymentData.map((item, index) => (
              <div key={index} className="expenseCard">
                <div className="expenseHeader">
                  <div 
                    className="expenseIcon payment"
                    style={{ background: getPaymentMethodColor(item.method) }}
                  >
                    <FontAwesomeIcon icon={getPaymentMethodIcon(item.method)} />
                  </div>
                  <div className="expenseTitle">
                    <h4>{item.purpose}</h4>
                    <span className="quantity">{item.method}</span>
                  </div>
                </div>
                <div className="expenseDetails">
                  <div className="expenseDate">
                    <FontAwesomeIcon icon={faCalendar} />
                    {new Date(item.date).toLocaleDateString('en-IN')}
                  </div>
                  <div className="expenseAmount">₹{item.amount.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
                <div className="amount positive">₹{cropData.totalPayment.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
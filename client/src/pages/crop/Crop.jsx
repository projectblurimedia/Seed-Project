import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faSeedling, faMapMarkerAlt, faRupeeSign, faWeight, faEdit, faUsers, faSprayCanSparkles } from '@fortawesome/free-solid-svg-icons'
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
    payment: 25000,
    yield: 1200,
    status: 'Harvested',
    farmerName: 'Rajesh Kumar',
    farmerAadhar: '1234 5678 9012'
  }

  const pesticideData = [
    { name: 'Urea', quantity: '50 kg', amount: 1500 },
    { name: 'DAP', quantity: '25 kg', amount: 2000 },
    { name: 'Organic Manure', quantity: '100 kg', amount: 3000 }
  ]

  const coolieData = [
    { count: 5, amount: 2500, work: 'Sowing' },
    { count: 3, amount: 1500, work: 'Harvesting' },
    { count: 2, amount: 1000, work: 'Weeding' }
  ]

  const handleBack = () => navigate(-1)
  const handleEdit = () => navigate(`/update-crop/${cropData.id}`)

  const calculateTotalPesticides = () => {
    return pesticideData.reduce((total, item) => total + item.amount, 0)
  }

  const calculateTotalCoolies = () => {
    return coolieData.reduce((total, item) => total + item.amount, 0)
  }

  const calculateNetEarnings = () => {
    return cropData.payment - calculateTotalPesticides() - calculateTotalCoolies()
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

        {/* Crop Overview */}
        <div className="cropOverview">
          <div className="cropIcon">
            <FontAwesomeIcon icon={faSeedling} />
          </div>
          <div className="cropInfo">
            <h2>{cropData.seedType}</h2>
            <p className="cropId">Crop ID: {cropData.id}</p>
            <span className={`statusBadge ${cropData.status.toLowerCase()}`}>
              {cropData.status}
            </span>
          </div>
          <div className="farmerInfo">
            <p>Farmer: <strong>{cropData.farmerName}</strong></p>
            <p>Aadhar: {cropData.farmerAadhar}</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="metricsGrid">
          <div className="metricCard">
            <div className="metricIcon land">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </div>
            <div className="metricContent">
              <h3>{cropData.acres} acres</h3>
              <p>Land Area</p>
            </div>
          </div>
          <div className="metricCard">
            <div className="metricIcon yield">
              <FontAwesomeIcon icon={faWeight} />
            </div>
            <div className="metricContent">
              <h3>{cropData.yield} kg</h3>
              <p>Total Yield</p>
            </div>
          </div>
          <div className="metricCard">
            <div className="metricIcon payment">
              <FontAwesomeIcon icon={faRupeeSign} />
            </div>
            <div className="metricContent">
              <h3>₹{cropData.payment.toLocaleString()}</h3>
              <p>Total Payment</p>
            </div>
          </div>
          <div className="metricCard">
            <div className="metricIcon earnings">
              <FontAwesomeIcon icon={faRupeeSign} />
            </div>
            <div className="metricContent">
              <h3>₹{calculateNetEarnings().toLocaleString()}</h3>
              <p>Net Earnings</p>
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

        {/* Packet Information */}
        <div className="packetSection">
          <h3>Seed Packet Details</h3>
          <div className="packetGrid">
            <div className="packetCard male">
              <h4>Male Packets</h4>
              <div className="packetCount">{cropData.malePackets}</div>
              <p>Packets</p>
            </div>
            <div className="packetCard female">
              <h4>Female Packets</h4>
              <div className="packetCount">{cropData.femalePackets}</div>
              <p>Packets</p>
            </div>
            <div className="packetCard total">
              <h4>Total Packets</h4>
              <div className="packetCount">{cropData.malePackets + cropData.femalePackets}</div>
              <p>Packets</p>
            </div>
          </div>
        </div>

        {/* Pesticides & Fertilizers */}
        <div className="pesticideSection">
          <div className="sectionHeader">
            <h3>
              <FontAwesomeIcon icon={faSprayCanSparkles} />
              Pesticides & Fertilizers
            </h3>
            <span className="totalAmount">₹{calculateTotalPesticides().toLocaleString()}</span>
          </div>
          <div className="pesticideList">
            {pesticideData.map((item, index) => (
              <div key={index} className="pesticideItem">
                <div className="pesticideInfo">
                  <h4>{item.name}</h4>
                  <p>{item.quantity}</p>
                </div>
                <div className="pesticideAmount">₹{item.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Coolie Information */}
        <div className="coolieSection">
          <div className="sectionHeader">
            <h3>
              <FontAwesomeIcon icon={faUsers} />
              Coolie Expenses
            </h3>
            <span className="totalAmount">₹{calculateTotalCoolies().toLocaleString()}</span>
          </div>
          <div className="coolieList">
            {coolieData.map((item, index) => (
              <div key={index} className="coolieItem">
                <div className="coolieInfo">
                  <h4>{item.work}</h4>
                  <p>{item.count} coolies</p>
                </div>
                <div className="coolieAmount">₹{item.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="financialSection">
          <h3>Financial Summary</h3>
          <div className="financialGrid">
            <div className="financialItem">
              <span className="label">Total Payment:</span>
              <span className="amount positive">₹{cropData.payment.toLocaleString()}</span>
            </div>
            <div className="financialItem">
              <span className="label">Pesticide Cost:</span>
              <span className="amount negative">-₹{calculateTotalPesticides().toLocaleString()}</span>
            </div>
            <div className="financialItem">
              <span className="label">Coolie Cost:</span>
              <span className="amount negative">-₹{calculateTotalCoolies().toLocaleString()}</span>
            </div>
            <div className="financialItem total">
              <span className="label">Net Earnings:</span>
              <span className="amount positive">₹{calculateNetEarnings().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
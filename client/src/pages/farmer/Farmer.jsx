import './farmer.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faUser, faIdCard, faPhone, faMapMarkerAlt, faRupeeSign, faEdit } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

export const Farmer = () => {
  const navigate = useNavigate()

  const farmerData = {
    id: 'FARM001',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    aadhar: '1234 5678 9012',
    mobile: '+91 98765 43210',
    account: '12345678901234',
    village: 'Mohanpur',
    totalCrops: 3,
    totalLand: 12.5,
    totalEarnings: 125000,
    joinDate: '2023-01-15',
    status: 'Active'
  }

  const handleBack = () => navigate(-1)
  const handleEdit = () => navigate(`/update-farmer/${farmerData.aadhar}`)

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

        {/* Profile Section */}
        <div className="profileSection">
          <div className="avatar">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className="profileInfo">
            <h2>{farmerData.firstName} {farmerData.lastName}</h2>
            <p className="farmerId">ID: {farmerData.id}</p>
            <span className={`statusBadge ${farmerData.status.toLowerCase()}`}>
              {farmerData.status}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="statsGrid">
          <div className="statCard">
            <div className="statIcon crops">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </div>
            <div className="statInfo">
              <h3>{farmerData.totalCrops}</h3>
              <p>Total Crops</p>
            </div>
          </div>
          <div className="statCard">
            <div className="statIcon land">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </div>
            <div className="statInfo">
              <h3>{farmerData.totalLand} acres</h3>
              <p>Total Land</p>
            </div>
          </div>
          <div className="statCard">
            <div className="statIcon earnings">
              <FontAwesomeIcon icon={faRupeeSign} />
            </div>
            <div className="statInfo">
              <h3>₹{farmerData.totalEarnings.toLocaleString()}</h3>
              <p>Total Earnings</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="infoSection">
          <h3>Personal Information</h3>
          <div className="infoGrid">
            <div className="infoItem">
              <div className="infoIcon">
                <FontAwesomeIcon icon={faIdCard} />
              </div>
              <div className="infoContent">
                <label>Aadhar Number</label>
                <p>{farmerData.aadhar}</p>
              </div>
            </div>
            <div className="infoItem">
              <div className="infoIcon">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <div className="infoContent">
                <label>Mobile Number</label>
                <p>{farmerData.mobile}</p>
              </div>
            </div>
            <div className="infoItem">
              <div className="infoIcon">
                <FontAwesomeIcon icon={faRupeeSign} />
              </div>
              <div className="infoContent">
                <label>Account Number</label>
                <p>{farmerData.account}</p>
              </div>
            </div>
            <div className="infoItem">
              <div className="infoIcon">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>
              <div className="infoContent">
                <label>Village</label>
                <p>{farmerData.village}</p>
              </div>
            </div>
            <div className="infoItem">
              <div className="infoIcon">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className="infoContent">
                <label>Join Date</label>
                <p>{new Date(farmerData.joinDate).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Crops */}
        <div className="cropsSection">
          <div className="sectionHeader">
            <h3>Recent Crops</h3>
            <button className="viewAllBtn" onClick={() => navigate('/crops')}>
              View All
            </button>
          </div>
          <div className="cropsList">
            <div className="cropItem">
              <div className="cropIcon">🌽</div>
              <div className="cropInfo">
                <h4>Babycorn - Season 1</h4>
                <p>5.5 acres • Harvested on 15 Jun 2024</p>
              </div>
              <div className="cropEarnings">₹25,000</div>
            </div>
            <div className="cropItem">
              <div className="cropIcon">🌽</div>
              <div className="cropInfo">
                <h4>Babycorn - Season 2</h4>
                <p>4.0 acres • Harvested on 20 Sep 2024</p>
              </div>
              <div className="cropEarnings">₹18,000</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
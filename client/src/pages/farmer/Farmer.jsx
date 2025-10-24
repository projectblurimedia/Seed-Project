import './farmer.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faUser, faIdCard, faPhone, faMapMarkerAlt, faRupeeSign, faEdit, faCalendar, faSeedling, faTractor } from '@fortawesome/free-solid-svg-icons'
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

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

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
                <span className={`statusBadge ${farmerData.status.toLowerCase()}`}>
                  {farmerData.status}
                </span>
                <span className="joinDate">
                  <FontAwesomeIcon icon={faCalendar} />
                  Joined {new Date(farmerData.joinDate).toLocaleDateString('en-IN')}
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
                <h3>{farmerData.totalCrops}</h3>
                <p>Total Crops</p>
              </div>
            </div>
            <div className="statCircle">
              <div className="circleIcon land">
                <FontAwesomeIcon icon={faTractor} />
              </div>
              <div className="circleInfo">
                <h3>{farmerData.totalLand}</h3>
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
                  <p>{farmerData.mobile}</p>
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
                  <p>{farmerData.account}</p>
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
                  <p>{farmerData.village}</p>
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
          <div className="cropsGrid">
            <div className="cropCard">
              <div className="cropHeader">
                <div className="cropIcon">🌽</div>
                <div className="cropStatus active">Active</div>
              </div>
              <div className="cropInfo">
                <h4>Babycorn - Season 1</h4>
                <p>Planted on 15 Mar 2024</p>
              </div>
              <div className="cropStats">
                <div className="cropStat">
                  <span className="statLabel">Area</span>
                  <span className="statValue">5.5 acres</span>
                </div>
                <div className="cropStat">
                  <span className="statLabel">Yield</span>
                  <span className="statValue">2.5 ton</span>
                </div>
              </div>
              <div className="cropEarnings">₹25,000</div>
            </div>

            <div className="cropCard">
              <div className="cropHeader">
                <div className="cropIcon">🌽</div>
                <div className="cropStatus completed">Completed</div>
              </div>
              <div className="cropInfo">
                <h4>Babycorn - Season 2</h4>
                <p>Harvested on 20 Sep 2024</p>
              </div>
              <div className="cropStats">
                <div className="cropStat">
                  <span className="statLabel">Area</span>
                  <span className="statValue">4.0 acres</span>
                </div>
                <div className="cropStat">
                  <span className="statLabel">Yield</span>
                  <span className="statValue">1.8 ton</span>
                </div>
              </div>
              <div className="cropEarnings">₹18,000</div>
            </div>

            <div className="cropCard">
              <div className="cropHeader">
                <div className="cropIcon">🌾</div>
                <div className="cropStatus completed">Completed</div>
              </div>
              <div className="cropInfo">
                <h4>Wheat - Winter</h4>
                <p>Harvested on 10 Mar 2024</p>
              </div>
              <div className="cropStats">
                <div className="cropStat">
                  <span className="statLabel">Area</span>
                  <span className="statValue">3.0 acres</span>
                </div>
                <div className="cropStat">
                  <span className="statLabel">Yield</span>
                  <span className="statValue">1.2 ton</span>
                </div>
              </div>
              <div className="cropEarnings">₹32,000</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
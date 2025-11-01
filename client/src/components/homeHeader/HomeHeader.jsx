import './homeHeader.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faLeaf, 
  faReceipt, 
  faUsers, 
  faWheatAlt,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

export const HomeHeader = ({ setIsAuth, isAdmin, setIsAdmin, username, setUsername }) => {
  const navigate = useNavigate()
  const fullName = username
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const handleNavigation = (path) => {
    navigate(path)
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setIsAuth(false) 
      setIsAdmin(false)
      setUsername('')
      navigate("/login", { replace: true })
    } catch (err) {
      console.error("Error during logout:", err)
      setError("Failed to logout. Please try again.")
    }
  }

  return (
    <div className='homeHeader'>
      <div className='left'>
        <FontAwesomeIcon icon={faLeaf} className='icon' />
        <div className='title'>AgroCorp</div>
      </div>
      
      <div className='right'>
        <div className='navIcons'>  
          <button 
            className='navIcon'
            onClick={() => handleNavigation('/farmers')}
            aria-label="Farmers"
          >
            <FontAwesomeIcon icon={faUsers} />
            <span className='tooltip'>Farmers</span>
          </button>
          
          <button 
            className='navIcon'
            onClick={() => handleNavigation('/crops')}
            aria-label="Crops"
          >
            <FontAwesomeIcon icon={faWheatAlt} />
            <span className='tooltip'>Crops</span>
          </button>

          {
            isAdmin && 
            <button 
              className='navIcon'
              onClick={() => handleNavigation('/transactions')}
              aria-label="Transactions"
            >
              <FontAwesomeIcon icon={faReceipt} />
              <span className='tooltip'>Transactions</span>
            </button>
          }
        </div>
        
        <div className='profile'>
          <div className='initials'>
            {initials}
          </div>
          <div className='profileDropdown'>
            <div className='profileInfo'>
              <FontAwesomeIcon icon={faUserCircle} className='profileIcon' />
              <div className='profileDetails'>
                <div className='profileName'>{fullName}</div>
                <div className='profileRole'>{isAdmin ? 'Owner' : 'Worker'}</div>
              </div>
            </div>
            <div className='dropdownMenu'>
              <button className='menuItem logout' onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
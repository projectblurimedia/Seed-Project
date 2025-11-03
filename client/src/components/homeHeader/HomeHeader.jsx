import './homeHeader.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faLeaf, 
  faReceipt, 
  faUsers, 
  faWheatAlt,
  faUserCircle,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

export const HomeHeader = ({ setIsAuth, isAdmin, setIsAdmin, username, setUsername }) => {
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [error, setError] = useState('')
  const dropdownRef = useRef(null)
  const profileRef = useRef(null)

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
      setIsDropdownOpen(false)
      navigate("/login", { replace: true })
    } catch (err) {
      console.error("Error during logout:", err)
      setError("Failed to logout. Please try again.")
    }
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          profileRef.current && !profileRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
        
        <div className='profile' ref={profileRef}>
          <div 
            className={`initials ${isDropdownOpen ? 'active' : ''}`}
            onClick={toggleDropdown}
          >
            {initials}
          </div>
          {isDropdownOpen && (
            <div className='profileDropdown' ref={dropdownRef}>
              <div className='profileInfo'>
                <FontAwesomeIcon icon={faUserCircle} className='profileIcon' />
                <div className='profileDetails'>
                  <div className='profileName'>{fullName}</div>
                  <div className='profileRole'>{isAdmin ? 'Owner' : 'Worker'}</div>
                </div>
              </div>
              <div className='dropdownMenu'>
                <button className='menuItem logout' onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
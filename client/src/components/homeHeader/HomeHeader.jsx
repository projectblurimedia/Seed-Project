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

export const HomeHeader = () => {
  const navigate = useNavigate()
  const fullName = 'Manikanta Yerraguntla'
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <div className='homeHeader'>
      <div className='left'>
        <FontAwesomeIcon icon={faLeaf} className='icon' />
        <div className='title'>Agricultural Corporation</div>
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

          <button 
            className='navIcon'
            onClick={() => handleNavigation('/transactions')}
            aria-label="Transactions"
          >
            <FontAwesomeIcon icon={faReceipt} />
            <span className='tooltip'>Transactions</span>
          </button>
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
                <div className='profileRole'>Administrator</div>
              </div>
            </div>
            <div className='dropdownMenu'>
              <button className='menuItem logout'>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
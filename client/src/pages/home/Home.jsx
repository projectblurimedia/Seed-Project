import './home.scss'
import { HomeHeader } from '../../components/homeHeader/HomeHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { RecentUpdates } from '../../components/recentUpdates/RecentUpdates'

export const Home = ({ setIsAuth, isAdmin, username, setIsAdmin, setUsername }) => {
  const navigate = useNavigate()
  const handleCreate = () => {
    navigate('/select-farmer')
  }

  return (
    <div className='homeContainer'>
      <div className='headerSection'>
        <HomeHeader setIsAuth={setIsAuth} isAdmin={isAdmin} username={username} setIsAdmin={setIsAdmin} setUsername={setUsername} />
      </div>

      <div className='recentUpdatesSection'>
        <RecentUpdates />
      </div>

      <button className='floatingCreateBtn' onClick={handleCreate}>
        <FontAwesomeIcon icon={faPlus} className='icon' />
      </button>
    </div>
  )
}
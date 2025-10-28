import './home.scss'
import { HomeHeader } from '../../components/homeHeader/HomeHeader'
import { DailyUpdates } from '../../components/dailyUpdates/DailyUpdates'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

export const Home = () => {
  const navigate = useNavigate()
  const handleCreate = () => {
    navigate('/select-farmer')
  }

  return (
    <div className='homeContainer'>
      <div className='headerSection'>
        <HomeHeader />
      </div>

      <div className='dailyUpdatesSection'>
        <DailyUpdates />
      </div>

      <button className='floatingCreateBtn' onClick={handleCreate}>
        <FontAwesomeIcon icon={faPlus} className='icon' />
      </button>
    </div>
  )
}
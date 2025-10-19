import React from 'react'
import './home.scss'
import { HomeHeader } from '../../components/homeHeader/HomeHeader'
import { DailyUpdates } from '../../components/dailyUpdates/DailyUpdates'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

export const Home = () => {
  const navigate = useNavigate()
  const handleNavigate = () => {
    navigate('/farmers')
  }

  return (
    <div className='homeContainer'>
      <div className='headerSection'>
        <HomeHeader />
      </div>

      <div className='dailyUpdatesSection'>
        <DailyUpdates />
      </div>

      <div className='stickyButtons'>
        <button className='farmersBtn' onClick={() => handleNavigate('farmers')}>
          <FontAwesomeIcon icon={faUser} className='icon' />
          <span>Farmers</span>
        </button>

        <button className='addBtn'>
          <FontAwesomeIcon icon={faPlus} className='icon' />
          <span>Add</span>
        </button>
      </div>
    </div>
  )
}

import React from 'react'
import './home.scss'
import { HomeHeader } from '../../components/homeHeader/HomeHeader'
import { DailyUpdates } from '../../components/dailyUpdates/DailyUpdates'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

export const Home = () => {
  const handleUpdateClick = () => {
    // Add your update functionality here
    console.log('Update button clicked')
  }

  return (
    <div className='homeContainer'>
      <div className='headerSection'>
        <HomeHeader />
      </div>

      <div className='dailyUpdatesSection'>
        <DailyUpdates />
      </div>

      <button className='floatingUpdateBtn' onClick={handleUpdateClick}>
        <FontAwesomeIcon icon={faPenToSquare} className='icon' />
      </button>
    </div>
  )
}
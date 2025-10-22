import React from 'react'
import './home.scss'
import { HomeHeader } from '../../components/homeHeader/HomeHeader'
import { DailyUpdates } from '../../components/dailyUpdates/DailyUpdates'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {   faUserGroup, faPenToSquare, faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

export const Home = () => {
  const navigate = useNavigate()
  const handleNavigate = (path) => {
    navigate(path)
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
          <span>Farmers</span>
          <FontAwesomeIcon icon={faUserGroup} className='icon' />
        </button>

        <button className='addBtn'>
          <span>Update</span>
          <FontAwesomeIcon icon={faPenToSquare} className='icon' />
        </button>

        <button className='farmersBtn' onClick={() => handleNavigate('create-farmer')}>
          <span>Create</span>
          <FontAwesomeIcon icon={faCirclePlus} className='icon' />
        </button>
      </div>
    </div>
  )
}

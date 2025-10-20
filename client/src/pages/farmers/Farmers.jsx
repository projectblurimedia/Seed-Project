import React from 'react'
import './farmers.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserGroup,
  faSeedling,
  faMapMarkerAlt,
  faFilter,
  faCalendarDays,
  faSpinner,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons'

export const Farmers = () => {
  const farmers = [
    { name: 'Ravi Teja', crop: 'Popcorn Seed 161', acres: '12', location: 'VJW', status: 'In Progress' },
    { name: 'Kiran Kumar', crop: 'Sweet Corn 120', acres: '18', location: 'GTR', status: 'Completed' },
    { name: 'Manikanta Yerraguntla', crop: 'Baby Corn 210', acres: '30', location: 'NLR', status: 'In Progress' },
    { name: 'Suresh Babu', crop: 'Popcorn Seed 150', acres: '25', location: 'ONG', status: 'Completed' },
    { name: 'Manikanta Yerraguntla', crop: 'Baby Corn 210', acres: '30', location: 'NLR', status: 'In Progress' },
    { name: 'Haritha Kotha', crop: 'Hybrid Maize 175', acres: '22', location: 'KNL', status: 'In Progress' },
    { name: 'Manikanta Yerraguntla', crop: 'Baby Corn 210', acres: '30', location: 'NLR', status: 'In Progress' },
  ]

  const getInitials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()

  const getStatusIcon = (status) =>
    status === 'Completed' ? faCheckCircle : faSpinner

  return (
    <div className="farmersContainer">
      {/* Header */}
      <div className="headerSection">
        <FontAwesomeIcon icon={faUserGroup} className="titleIcon" />
        <h2>Farmers</h2>
      </div>

      {/* Search and Filters */}
      <div className="filterSection">
        <div className="searchBox">
          <input type="text" placeholder="Search farmers..." />
        </div>

        <div className="filterIcons">
          <button><FontAwesomeIcon icon={faFilter} /> Crop</button>
          <button><FontAwesomeIcon icon={faMapMarkerAlt} /> Location</button>
          <button><FontAwesomeIcon icon={faCalendarDays} /> Status</button>
          <button className="getBtn">Get</button>
        </div>
      </div>

      {/* Farmers List */}
      <div className="farmersList">
        {farmers.map((farmer, index) => (
          <div key={index} className="farmerCard">
            <div className="profile">
              <div className="avatar">{getInitials(farmer.name)}</div>
              <div className="info">
                <span className="name">{farmer.name}</span>
                <span className="crop"><FontAwesomeIcon icon={faSeedling} /> {farmer.crop}</span>
              </div>
            </div>

            <div className="details">
              <div className="pill acres">{farmer.acres} acres</div>
              <div className="pill location"><FontAwesomeIcon icon={faMapMarkerAlt} /> {farmer.location}</div>
              <div
                className={`pill status ${farmer.status === 'Completed' ? 'completed' : 'inProgress'}`}
              >
                <FontAwesomeIcon icon={getStatusIcon(farmer.status)} />
                {farmer.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

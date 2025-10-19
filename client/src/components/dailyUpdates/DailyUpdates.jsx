import React from 'react'
import './dailyUpdates.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faSeedling, faBug, faTractor } from '@fortawesome/free-solid-svg-icons'

export const DailyUpdates = () => {
  const updates = [
    { name: 'Manikanta Yerraguntla', acres: '30', status: 'Sowing Seeds', shortCode: 'JRG' },
    { name: 'Ravi Teja', acres: '12', status: 'Given Pesticides', shortCode: 'VJR' },
    { name: 'Suresh Babu', acres: '25', status: 'Created Field', shortCode: 'KRM' },
    { name: 'Kiran Kumar', acres: '18', status: 'Sowing Seeds', shortCode: 'TLR' },
    { name: 'Arjun Reddy', acres: '20', status: 'Given Pesticides', shortCode: 'PGR' },
    { name: 'Haritha Kotha', acres: '25', status: 'Created Field', shortCode: 'NLR' },
  ]

  const getInitials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()

  const getStatusIcon = (status) => {
    if (status.includes('Sowing')) return faSeedling
    if (status.includes('Pesticides')) return faBug
    if (status.includes('Field')) return faTractor
    return faSeedling
  }

  return (
    <div className="dailyUpdates">
      <div className="header">Daily Updates</div>
      <div className="updatesList">
        {updates.map((update, index) => (
          <div key={index} className="updateCard">
            <div className="leftSection">
              <div className="avatar">{getInitials(update.name)}</div>
              <div className="info">
                <div className="topRow">
                  <span className="name">{update.name}</span>
                  <div className="shortCode">
                    <FontAwesomeIcon icon={faLocationDot} className="icon" />
                    {update.shortCode}
                  </div>
                </div>
                <div className="bottomRow">
                  <span className="acres">{update.acres} acres</span>
                  <div className="status">
                    <FontAwesomeIcon icon={getStatusIcon(update.status)} className="statusIcon" />
                    {update.status}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

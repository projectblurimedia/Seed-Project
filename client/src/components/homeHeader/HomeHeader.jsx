import React from 'react'
import './homeHeader.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeaf } from '@fortawesome/free-solid-svg-icons'

export const HomeHeader = () => {
  const fullName = 'Manikanta Yerraguntla'
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className='homeHeader'>
      <div className='left'>
        <FontAwesomeIcon icon={faLeaf} className='icon' />
        <div className='title'>Agricultural Corporation</div>
      </div>
      <div className='right'>{initials}</div>
    </div>
  )
}

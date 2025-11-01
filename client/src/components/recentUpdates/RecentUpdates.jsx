import './recentUpdates.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLocationDot,
  faSeedling,
  faFilter,
  faChevronDown,
  faMale,
  faFemale,
  faClipboardCheck,
  faTractor,
  faSprayCan,
  faWater,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Toast } from '../toast/Toast'

export const RecentUpdates = () => {
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState('ALL')
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [availableRegions, setAvailableRegions] = useState([])
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  const showToast = (message, type = 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }

  const getRegionShortCode = (region) => {
    if (!region || region === 'Unknown Region') return 'UNK'
    
    const regionMap = {
      'jangareddygudem': 'JRG',
      'vijayanagaram': 'VZM',
      'visakhapatnam': 'VSK',
      'srikakulam': 'SKL',
      'vizianagaram': 'VZM',
      'eastgodavari': 'EGD',
      'westgodavari': 'WGD',
      'krishna': 'KRI',
      'guntur': 'GNT',
      'prakasam': 'PRK',
      'nellore': 'NLR',
      'chittoor': 'CHT',
      'kadapa': 'KDP',
      'anantapur': 'ATP',
      'kurnool': 'KRL'
    }

    const lowerRegion = region.toLowerCase().replace(/\s+/g, '')
    return regionMap[lowerRegion] || region.substring(0, 3).toUpperCase()
  }

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get('/crops/latest')
        
        if (!data || !Array.isArray(data)) {
          throw new Error('Invalid data format received from server')
        }

        const transformed = data.map(crop => {
          if (!crop || typeof crop !== 'object') {
            console.warn('Invalid crop data:', crop)
            return null
          }

          return {
            id: crop._id || `temp-${Math.random()}`,
            farmerName: `${crop.farmerDetails?.firstName || ''} ${
              crop.farmerDetails?.lastName || ''
            }`.trim() || 'Unknown Farmer',
            acres: crop.acres || 0,
            seedType: crop.seedType || 'Unknown Seed',
            region: crop.region || 'Unknown Region',
            regionShort: getRegionShortCode(crop.region || 'Unknown Region'),
            latestUpdate: {
              type: crop.latestUpdate?.type || 'created',
              label: crop.latestUpdate?.description || 'Field Created',
              date: crop.latestUpdate?.date || crop.createdAt || new Date().toISOString(),
            },
            status: crop.status || 'active',
          }
        }).filter(Boolean)

        setUpdates(transformed)

        const regions = [
          'ALL',
          ...new Set(transformed.map(i => i.region).filter(Boolean)),
        ]
        setAvailableRegions(regions)

      } catch (err) {
        console.error('Error fetching latest crops:', err)
        const errorMessage = err.response?.data?.message || 
                           err.message || 
                           'Failed to load updates. Please try again.'
        showToast(errorMessage, 'error')
        setUpdates([])
      } finally {
        setLoading(false)
      }
    }

    fetchLatest()
  }, [])

  const getUpdateIcon = type => {
    switch (type) {
      case 'maleSown':
        return faMale
      case 'femaleSown':
        return faFemale
      case 'detaching':
        return faClipboardCheck
      case 'harvested':
        return faTractor
      case 'pesticide':
        return faSprayCan
      case 'irrigation':
        return faWater
      default:
        return faSeedling
    }
  }

  const getUpdateColor = type => {
    switch (type) {
      case 'maleSown':
        return '#3b82f6'
      case 'femaleSown':
        return '#ec4899'
      case 'detaching':
        return '#f59e0b'
      case 'harvested':
        return '#10b981'
      case 'pesticide':
        return '#eb3434'
      case 'irrigation':
        return '#06b6d4'
      default:
        return '#6b7280'
    }
  }

  const filteredUpdates =
    selectedFilter === 'ALL'
      ? updates
      : updates.filter(u => u.region === selectedFilter)

  const getInitials = name => {
    if (!name || name === 'Unknown Farmer') return 'NA'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = dateString => {
    if (!dateString) return 'Recently'
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Recently'
      
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const input = new Date(date.getFullYear(), date.getMonth(), date.getDate())

      const diff = Math.floor((today - input) / (1000 * 60 * 60 * 24))

      if (diff === 0) return 'Today'
      if (diff === 1) return 'Yesterday'
      if (diff <= 7) return `${diff} day${diff > 1 ? 's' : ''} ago`
      if (diff <= 30) return `${Math.floor(diff / 7)} week${diff >= 14 ? 's' : ''} ago`

      return input.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: input.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      })
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Recently'
    }
  }

  const handleCardClick = (update) => {
    if (!update?.id) {
      showToast('Unable to navigate: Invalid crop data', 'error')
      return
    }
    navigate(`/crops/${update.id}`)
  }

  if (loading) {
    return (
      <div className="recentUpdates">
        <div className="loadingState">
          <div className="loadingContent">
            <div className="loadingSpinner">
              <FontAwesomeIcon icon={faSeedling} className="spinnerIcon" />
              <div className="spinnerRing"></div>
            </div>
            <h3>Loading Recent Updates</h3>
            <p>Please wait while we fetch the latest information...</p>
            <div className="loadingProgress">
              <div className="progressBar"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="recentUpdates">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          position="top-right"
        />
      )}
      
      <div className="updatesHeader">
        <div className="headerLeft">
          <h2>Recent Updates</h2>
          <span className="updatesCount">{filteredUpdates.length} updates</span>
        </div>

        <div className="headerRight">
          <div className="filterContainer">
            <button
              className="filterBtn"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              aria-expanded={showFilterDropdown}
              aria-haspopup="listbox"
            >
              <FontAwesomeIcon icon={faFilter} className="filterIcon" />
              <span className="filterText">{selectedFilter}</span>
              <FontAwesomeIcon 
                icon={faChevronDown} 
                className={`chevron ${showFilterDropdown ? 'rotated' : ''}`} 
              />
            </button>

            {showFilterDropdown && (
              <div className="filterDropdown">
                <div className="dropdownBackground"></div>
                <div className="dropdownContent">
                  {availableRegions.map(region => (
                    <button
                      key={region}
                      className={`filterOption ${selectedFilter === region ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedFilter(region)
                        setShowFilterDropdown(false)
                      }}
                      role="option"
                      aria-selected={selectedFilter === region}
                    >
                      <span className="optionText">{region}</span>
                      {selectedFilter === region && (
                        <div className="selectedIndicator">
                          <div className="checkmark"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="updatesList">
        {filteredUpdates.length === 0 ? (
          <div className="emptyState">
            <FontAwesomeIcon icon={faCalendarAlt} className="emptyIcon" />
            <h3>No Updates Found</h3>
            <p>
              {selectedFilter === 'ALL' 
                ? 'No crop updates available at the moment.' 
                : `No updates found for ${selectedFilter} region.`}
            </p>
          </div>
        ) : (
          filteredUpdates.map(update => (
            <div
              key={update.id}
              className="updateCard"
              onClick={() => handleCardClick(update)}
            >
              <div className="cardBackground"></div>
              
              {/* First Row: Profile + Details in flex row */}
              <div className="cardRow firstRow">
                <div className="profileDetailsSection">
                  {/* Profile */}
                  <div className="profileSection">
                    <div className="farmerAvatar">
                      <div className="avatar">{getInitials(update.farmerName)}</div>
                      <div
                        className="statusIndicator"
                        style={{ backgroundColor: getUpdateColor(update.latestUpdate.type) }}
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="detailsSection">
                    <div className="detailRow nameRegionRow">
                      <span className="farmerName">{update.farmerName}</span>
                      <div className="regionBadge">
                        <FontAwesomeIcon icon={faLocationDot} className="regionIcon" />
                        <span className="regionText">{update.regionShort}</span>
                      </div>
                    </div>
                    <div className="detailRow seedAcresRow">
                      <span className="seedType">{update.seedType}</span>
                      <div className="acresBadge">
                        <span className="acresNumber">{update.acres}</span>
                        <span className="acresLabel">acres</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Row: Update (takes remaining space) + Time */}
              <div className="cardRow secondRow">
                <div 
                  className="updateSection"
                  style={{
                    backgroundColor: `${getUpdateColor(update.latestUpdate.type)}15`,
                    borderColor: getUpdateColor(update.latestUpdate.type),
                  }}
                >
                  <FontAwesomeIcon
                    icon={getUpdateIcon(update.latestUpdate.type)}
                    className="updateIcon"
                    style={{ color: getUpdateColor(update.latestUpdate.type) }}
                  />
                  <span 
                    className="updateText"
                    style={{ color: getUpdateColor(update.latestUpdate.type) }}
                  >
                    {update.latestUpdate.label}
                  </span>
                </div>
                <div className="timeSection">
                  <span className="updateTime">
                    {formatDate(update.latestUpdate.date)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
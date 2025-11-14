import { Check } from 'lucide-react'
import React from 'react'
import { DealsConstants } from '../utils/constants'

const styles = {
  progressBar: {
    maxWidth: '1200px',
    margin: '0 auto 3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  connectorBase: {
    flex: 1,
    height: '2px',
    backgroundColor: '#e2e8f0',
    marginBottom: '25px',
    transition: 'background-color 0.3s ease',
  },
  progressStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    position: 'relative',
    zIndex: 2,
  },
  progressCircleBase: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    border: '2px solid',
    borderColor: '#e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#94a3b8',
    transition: 'all 0.3s ease',
    zIndex: 2,
  },
  progressCircleActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
    color: '#ffffff',
  },
  progressCircleCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
    color: '#ffffff',
  },
  progressLabel: {
    fontSize: '0.75rem',
    color: '#64748b',
    fontWeight: '500',
  },
}

const RenderStepper = ({ currentSectionKey }) => {
  const { SectionMap, CreateDealSections } = DealsConstants
  const sectionSequence = []
  let key = Object.keys(SectionMap).find((k) => SectionMap[k].prev === null)
  while (key) {
    sectionSequence.push(key)
    key = SectionMap[key].next
  }

  return (
    <div style={styles.progressBar}>
      {sectionSequence.map((key, index) => {
        const activeIndex = sectionSequence.indexOf(currentSectionKey)
        const isCompleted = index < activeIndex
        const isActive = index === activeIndex
        const label = Object.values(CreateDealSections).find((s) => s.key === key).label

        let circleStyle = { ...styles.progressCircleBase }
        if (isCompleted) circleStyle = { ...circleStyle, ...styles.progressCircleCompleted }
        else if (isActive) circleStyle = { ...circleStyle, ...styles.progressCircleActive }

        return (
          <React.Fragment key={key}>
            {/* Step */}
            <div style={styles.progressStep}>
              <div style={circleStyle}>{isCompleted ? <Check size={18} /> : index + 1}</div>
              <span
                style={{
                  ...styles.progressLabel,
                  color: isActive ? '#6366f1' : styles.progressLabel.color,
                }}
              >
                {label}
              </span>
            </div>

            {/* Connector */}
            {index < sectionSequence.length - 1 && (
              <div
                style={{
                  ...styles.connectorBase,
                  backgroundColor: isCompleted ? '#10b981' : isActive ? '#6366f1' : '#e2e8f0',
                }}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default RenderStepper

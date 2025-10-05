import { useEffect, useState } from 'react'
import { useAuthStore } from '../store'
import Loading from './loaders/Loading'
import TextInput from './form/TextInput'

const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    width: '100%', // Full width
    margin: '0', // Remove auto margin
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  cardHeader: {
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    backgroundColor: '#f8fafc',
    justifyContent: 'space-between',
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#64748b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    color: '#ffffff',
    fontSize: '24px',
    flexShrink: 0,
  },
  headerText: {
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    fontSize: '1.125rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  email: {
    fontSize: '0.875rem',
    color: '#64748b',
    margin: 0,
  },
  cardContent: {
    padding: '1rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    fontSize: '0.875rem',
    color: '#334155',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #f1f5f9',
    padding: '0.5rem 0',
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    color: '#475569',
  },
  value: {
    color: '#0f172a',
    fontWeight: '500',
  },
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: '600',
    backgroundColor: '#d1fae5',
    color: '#10b981',
  },
  editButton: {
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    padding: '0.4rem 0.9rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
  },
}

const RenderProfileOverview = () => {
  const { getProfile, profileData: user, isLoading, updateProfile } = useAuthStore()
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState(null)

  useEffect(() => {
    getProfile()
  }, [])

  useEffect(() => {
    if (user) setFormData({ ...user })
  }, [user])

  const handleChange = (path, value) => {
    setFormData((prev) => {
      const updated = { ...prev }
      const keys = path.split('.')
      let ref = updated
      for (let i = 0; i < keys.length - 1; i++) {
        ref = ref[keys[i]]
      }
      ref[keys[keys.length - 1]] = value
      return updated
    })
  }

  const handleEditToggle = () => {
    if (editMode) {
      console.log('Saving data:', formData)
      updateProfile(formData)
    }
    setEditMode(!editMode)
  }

  return (
    <>
      {isLoading || !user ? (
        <Loading page={'Profile'} />
      ) : (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={styles.avatar}>{user.fullName?.charAt(0) || 'U'}</div>
              <div style={styles.headerText}>
                <p style={styles.name}>{user.fullName || 'Default FullName'}</p>
                <p style={styles.email}>{user.email || 'default@gmail.com'}</p>
              </div>
            </div>
            <button style={styles.editButton} onClick={handleEditToggle}>
              {editMode ? 'Save' : 'Edit'}
            </button>
          </div>

          <div style={styles.cardContent}>
            {/* Type */}
            <div style={styles.row}>
              <span style={styles.label}>Type:</span>
              {editMode ? (
                <TextInput
                  label="Type"
                  value={formData.userType || ''}
                  onChange={(e) => handleChange('userType', e.target.value)}
                  key={formData.userType}
                />
              ) : (
                <span style={styles.value}>{user.userType || 'Creator'}</span>
              )}
            </div>

            {/* Experience */}
            <div style={styles.row}>
              <span style={styles.label}>Experience:</span>
              {editMode ? (
                <TextInput
                  label="Experience"
                  value={formData.creatorProfile?.experienceLevel || ''}
                  onChange={(e) => handleChange('creatorProfile.experienceLevel', e.target.value)}
                />
              ) : (
                <span style={styles.value}>
                  {user.creatorProfile.experienceLevel || 'Beginner'}
                </span>
              )}
            </div>

            {/* Location */}
            <div style={styles.row}>
              <span style={styles.label}>Location:</span>
              {editMode ? (
                <TextInput
                  label="Location"
                  value={formData.address?.country || ''}
                  onChange={(e) => handleChange('address.country', e.target.value)}
                />
              ) : (
                <span style={styles.value}>{user.address?.country || 'India'}</span>
              )}
            </div>

            {/* Subscription (static) */}
            <div style={styles.row}>
              <span style={styles.label}>Subscription:</span>
              <span style={styles.badge}>
                {user.subscriptionTier} ({user.subscriptionStatus})
              </span>
            </div>

            {/* Expiry */}
            <div style={styles.row}>
              <span style={styles.label}>Expiry:</span>
              <span style={styles.value}>
                {new Date(user.subscriptionEndDate).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>

            {/* Profile Completion */}
            <div style={styles.row}>
              <span style={styles.label}>Profile Completion:</span>
              {editMode ? (
                <TextInput
                  label="Profile Completion"
                  type="number"
                  value={formData.profileCompletion || 0}
                  onChange={(e) => handleChange('profileCompletion', e.target.value)}
                />
              ) : (
                <span style={styles.value}>{user.profileCompletion}%</span>
              )}
            </div>

            {/* Social Presence */}
            <div style={styles.row}>
              <span style={styles.label}>Social Presence:</span>
              {editMode ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <TextInput
                    label="Instagram Followers"
                    value={formData.creatorProfile?.socialProfiles?.instagram?.followersCount || ''}
                    onChange={(e) =>
                      handleChange(
                        'creatorProfile.socialProfiles.instagram.followersCount',
                        e.target.value
                      )
                    }
                  />
                  <TextInput
                    label="YouTube Subscribers"
                    value={formData.creatorProfile?.socialProfiles?.youtube?.subscribersCount || ''}
                    onChange={(e) =>
                      handleChange(
                        'creatorProfile.socialProfiles.youtube.subscribersCount',
                        e.target.value
                      )
                    }
                  />
                </div>
              ) : (
                <span style={styles.value}>
                  Instagram: {user.creatorProfile.socialProfiles.instagram.followersCount} |
                  YouTube: {user.creatorProfile.socialProfiles.youtube.subscribersCount}
                </span>
              )}
            </div>

            {/* Availability */}
            <div style={styles.row}>
              <span style={styles.label}>Availability:</span>
              {editMode ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <TextInput
                    label="Availability Status"
                    value={
                      formData.creatorProfile?.workPreferences?.availabilityStatus?.replace(
                        /_/g,
                        ' '
                      ) || ''
                    }
                    onChange={(e) =>
                      handleChange(
                        'creatorProfile.workPreferences.availabilityStatus',
                        e.target.value
                      )
                    }
                  />
                  <TextInput
                    label="Turnaround Time (days)"
                    type="number"
                    value={formData.creatorProfile?.workPreferences?.turnaroundTime || ''}
                    onChange={(e) =>
                      handleChange('creatorProfile.workPreferences.turnaroundTime', e.target.value)
                    }
                  />
                </div>
              ) : (
                <span style={styles.value}>
                  {user.creatorProfile.workPreferences.availabilityStatus.replace(/_/g, ' ')} |
                  Turnaround: {user.creatorProfile.workPreferences.turnaroundTime} days
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RenderProfileOverview

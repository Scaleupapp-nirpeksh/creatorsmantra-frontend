import { useEffect } from 'react'
import { useAuthStore } from '../store'
import Loading from './loaders/Loading'

// const user = {
//   id: '68c15a0849358eefd652067c',
//   fullName: 'John Doe',
//   email: 'john.doe@example.com',
//   phone: '9876543210',
//   profilePicture: null,
//   gender: 'male',
//   address: {
//     country: 'USA',
//   },
//   userType: 'creator',
//   role: 'creator',
//   accountStatus: 'active',
//   isEmailVerified: true,
//   isPhoneVerified: true,
//   subscriptionTier: 'pro',
//   subscriptionStatus: 'active',
//   subscriptionStartDate: '2025-09-10T10:59:20.421Z',
//   subscriptionEndDate: '2025-09-24T10:59:20.421Z',
//   profileCompletion: 75,
//   lastLogin: '2025-09-24T10:57:02.699Z',
//   createdAt: '2025-09-10T10:59:32.165Z',
//   preferences: {
//     notifications: {
//       email: true,
//       sms: true,
//       push: true,
//     },
//     language: 'en',
//     timezone: 'Asia/Kolkata',
//   },
//   creatorProfile: {
//     creatorType: 'tech',
//     experienceLevel: 'intermediate',
//     socialProfiles: {
//       instagram: {
//         username: 'john_tech',
//         followersCount: 1200,
//         avgLikes: 150,
//         avgComments: 10,
//         engagementRate: 12.5,
//         lastUpdated: '2025-09-10T10:59:55.282Z',
//       },
//       youtube: {
//         channelName: 'JohnTechYT',
//         subscribersCount: 5000,
//         avgViews: 2000,
//         totalVideos: 50,
//         lastUpdated: '2025-09-10T10:59:55.282Z',
//       },
//     },
//     contentCategories: ['tech', 'programming'],
//     languages: ['English'],
//     targetAudience: {
//       ageGroup: '18-35',
//       gender: 'balanced',
//       geography: 'global',
//     },
//     rateCard: {
//       instagram: {
//         igtv: 50,
//         post: 30,
//         reel: 40,
//         story: 20,
//       },
//       youtube: {
//         shorts: 100,
//         integration: 200,
//         dedicated: 300,
//       },
//       lastUpdated: '2025-09-25T16:01:02.060Z',
//     },
//     bankDetails: {},
//     upiDetails: {},
//     gstDetails: {
//       hasGst: false,
//     },
//     panDetails: {},
//     managers: [],
//     stats: {
//       totalDeals: 5,
//       completedDeals: 3,
//       totalEarnings: 500,
//       avgDealValue: 100,
//       topBrands: ['Brand A', 'Brand B'],
//     },
//     workPreferences: {
//       availabilityStatus: 'open_for_collaborations',
//       preferredBrands: [],
//       excludedBrands: [],
//       minimumBudget: 0,
//       turnaroundTime: 5,
//       workingDays: [],
//     },
//     socialPresenceScore: 80,
//   },
// }

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
}

const RenderProfileOverview = () => {
  const { getProfile, profileData: user, isLoading } = useAuthStore()

  console.log(user)

  useEffect(() => {
    getProfile()
  }, [])

  return (
    <>
      {isLoading || !user ? (
        <Loading page={'Profile'} />
      ) : (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.avatar}>{user.fullName?.charAt(0) || 'U'}</div>
            <div style={styles.headerText}>
              <p style={styles.name}>{user.fullName || 'Default FullName'}</p>
              <p style={styles.email}>{user.email || 'default@gmail.com'}</p>
            </div>
          </div>

          <div style={styles.cardContent}>
            <div style={styles.row}>
              <span style={styles.label}>Type:</span>
              <span style={styles.value}>{user.userType || 'Creator'}</span>
            </div>

            <div style={styles.row}>
              <span style={styles.label}>Experience:</span>
              <span style={styles.value}>{user.creatorProfile.experienceLevel || 'Beginner'}</span>
            </div>

            <div style={styles.row}>
              <span style={styles.label}>Location:</span>
              <span style={styles.value}>{user.address?.country || 'India'}</span>
            </div>

            <div style={styles.row}>
              <span style={styles.label}>Subscription:</span>
              <span style={styles.badge}>
                {user.subscriptionTier} ({user.subscriptionStatus})
              </span>
            </div>

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

            <div style={styles.row}>
              <span style={styles.label}>Profile Completion:</span>
              <span style={styles.value}>{user.profileCompletion}%</span>
            </div>

            <div style={styles.row}>
              <span style={styles.label}>Social Presence:</span>
              <span style={styles.value}>
                Instagram: {user.creatorProfile.socialProfiles.instagram.followersCount} | YouTube:{' '}
                {user.creatorProfile.socialProfiles.youtube.subscribersCount}
              </span>
            </div>

            <div style={styles.row}>
              <span style={styles.label}>Availability:</span>
              <span style={styles.value}>
                {user.creatorProfile.workPreferences.availabilityStatus.replace(/_/g, ' ')} |
                Turnaround: {user.creatorProfile.workPreferences.turnaroundTime} days
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RenderProfileOverview

import { ChevronRight, Zap } from 'lucide-react'
import { useAuthStore, useUIStore } from '../store'
import { Link, useNavigate } from 'react-router-dom'

const getStyles = ({ sidebar }) => ({
  menuItemContainer: {
    marginBottom: '0.25rem',
  },

  menuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: sidebar.isCollapsed ? '0.75rem' : '0.75rem 1rem',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: 'var(--color-neutral-700)',
    textDecoration: 'none',
    justifyContent: sidebar.isCollapsed ? 'center' : 'flex-start',
  },

  menuItemActive: {
    background: 'rgba(102, 126, 234, 0.1)',
    color: 'var(--color-primary-600)',
    fontWeight: '600',
  },

  menuItemLocked: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },

  menuItemContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: '100%',
  },

  menuItemLabel: {
    flex: 1,
    fontSize: '0.875rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  badge: {
    padding: '0.125rem 0.5rem',
    borderRadius: '10px',
    fontSize: '0.75rem',
    fontWeight: '600',
    minWidth: '20px',
    textAlign: 'center',
  },

  badgePrimary: {
    background: 'var(--color-primary-100)',
    color: 'var(--color-primary-700)',
  },

  badgeWarning: {
    background: 'var(--color-warning-100)',
    color: 'var(--color-warning-700)',
  },

  badgeSuccess: {
    background: 'var(--color-success-100)',
    color: 'var(--color-success-700)',
  },

  chevron: {
    transition: 'transform 0.2s ease',
    marginLeft: 'auto',
  },

  subItemsContainer: {
    marginLeft: sidebar.isCollapsed ? '0' : '2.5rem',
    marginTop: '0.25rem',
    paddingLeft: '0.5rem',
    borderLeft: '2px solid var(--color-neutral-100)',
  },

  subItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    fontSize: '0.813rem',
    color: 'var(--color-neutral-600)',
    textDecoration: 'none',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    marginBottom: '0.125rem',
  },

  subItemActive: {
    background: 'rgba(102, 126, 234, 0.05)',
    color: 'var(--color-primary-600)',
    fontWeight: '500',
  },

  subItemLocked: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
})

const RenderMenuItems = ({ item }) => {
  const { sidebar, toggleMenuExpansion, openModal } = useUIStore()
  const { user, subscription } = useAuthStore()
  const styles = getStyles({ sidebar })
  const navigate = useNavigate()

  const isFeatureLocked = (item) => {
    const userSubscription = subscription || {
      tier: user?.subscriptionTier,
      status: user?.subscriptionStatus,
      isActive: user?.subscriptionStatus === 'active',
    }

    return item.premium && (!userSubscription || userSubscription.tier === 'starter')
  }

  const Icon = item.icon
  const isActive = sidebar.activeItem === item.id
  const isExpanded = sidebar.expandedItems?.includes(item.id)
  const isLocked = isFeatureLocked(item)
  const hasSubItems = item.subItems && item.subItems.length > 0

  return (
    <div key={item.id} style={styles.menuItemContainer}>
      <div
        onClick={() => {
          if (isLocked) {
            openModal('upgradePlan')
            return
          }

          if (hasSubItems && !sidebar.isCollapsed) {
            toggleMenuExpansion(item.id)
          } else {
            navigate(item.path)
          }
        }}
        style={{
          ...styles.menuItem,
          ...(isActive ? styles.menuItemActive : {}),
          ...(isLocked ? styles.menuItemLocked : {}),
        }}
      >
        <div style={styles.menuItemContent}>
          <Icon size={20} />
          {!sidebar.isCollapsed && (
            <>
              <span style={styles.menuItemLabel}>{item.label}</span>
              {item.premium && <Zap size={14} color="var(--color-warning)" />}
              {item.badge && !sidebar.isCollapsed && (
                <span
                  style={{
                    ...styles.badge,
                    ...(item.badge.type === 'primary'
                      ? styles.badgePrimary
                      : item.badge.type === 'warning'
                        ? styles.badgeWarning
                        : styles.badgeSuccess),
                  }}
                >
                  {item.badge.count}
                </span>
              )}
              {hasSubItems && (
                <ChevronRight
                  size={16}
                  style={{
                    ...styles.chevron,
                    transform: isExpanded ? 'rotate(90deg)' : 'none',
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>

      {hasSubItems && isExpanded && !sidebar.isCollapsed && (
        <div style={styles.subItemsContainer}>
          {item.subItems.map((subItem) => {
            const SubIcon = subItem.icon
            const isSubItemLocked = isFeatureLocked(subItem)
            const isSubItemActive = location.pathname === subItem.path

            return (
              <Link
                key={subItem.id}
                to={!isSubItemLocked ? subItem.path : '#'}
                onClick={(e) => {
                  if (isSubItemLocked) {
                    e.preventDefault()
                    openModal('upgradePlan')
                  }
                }}
                style={{
                  ...styles.subItem,
                  ...(isSubItemActive ? styles.subItemActive : {}),
                  ...(isSubItemLocked ? styles.subItemLocked : {}),
                }}
              >
                {SubIcon && <SubIcon size={14} style={{ marginRight: '0.5rem' }} />}
                {subItem.label}
                {subItem.premium && (
                  <Zap size={12} color="var(--color-warning)" style={{ marginLeft: 'auto' }} />
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default RenderMenuItems

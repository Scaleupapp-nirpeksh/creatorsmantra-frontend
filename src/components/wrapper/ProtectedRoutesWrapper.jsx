// Dependencies
import { Navigate, Outlet } from 'react-router-dom'

// Store Hooks
import { useAuthStore } from '../../store'

const ProtectedRoutesWrapper = () => {
  // Auth store methods
  const { isAuthenticated } = useAuthStore()

  // Redirect to login page if user not Authenticated
  if (!isAuthenticated) return <Navigate to={'/login'} replace />
  return <Outlet />
}

export default ProtectedRoutesWrapper

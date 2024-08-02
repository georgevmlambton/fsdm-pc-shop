import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AuthContext from '../context/AuthContext.jsx'

const ProtectedRoutes = () => {
  const { user } = useContext(AuthContext)

  return user ? <Outlet /> : <Navigate to="/" replace />
}

export default ProtectedRoutes

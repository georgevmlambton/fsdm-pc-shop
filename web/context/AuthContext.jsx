import { createContext, useEffect, useState } from 'react'
import userService from '../services/user.service.js'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toastState, setToastState] = useState({
    showToast: false,
    toastMessage: '',
    variant: '',
  })

  const showToast = (message, variant) => {
    setToastState({
      showToast: true,
      toastMessage: message,
      variant,
    })
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userService.getUserToken()) {
          const data = await userService.checkToken()
          setUser({
            name: data.user.name,
            email: data.user.email,
          })
          showToast(`Welcome ${data.user.name}`)
        }
        setLoading(false)
      } catch (e) {
        showToast('You have been logged out, please log in again', 'danger')
        userService.logout()
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const login = async (email, password, stayLoggedIn) => {
    try {
      setLoading(true)
      const data = await userService.login(email, password, stayLoggedIn)
      console.log(data)
      setUser({
        name: data.user.name,
        email: data.user.email,
      })
      showToast(`Welcome ${data.user.name}`)
      setLoading(false)
    } catch (e) {
      console.log(e)
      throw new Error(e)
    }
  }

  const logout = () => {
    userService.logout()
    setUser(null)
    showToast(`You have been logged out`, 'danger')
  }

  const register = async (name, email, password) => {
    try {
      await userService.register(name, email, password)
      showToast(`Registration successful, please login`)
    } catch (e) {
      console.log(e)
      showToast(`${e.message}`)
      throw new Error(e)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        setToastState,
        toastState,
        showToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchMe = async () => {
    try {
      const response = await api.get('/api/auth/me')
      setUser(response.data)
    } catch (err) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMe()
  }, [])

  const logout = async () => {
    try {
      await api.post('/api/auth/logout')
    } catch (err) {
      console.error(err)
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, fetchMe, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
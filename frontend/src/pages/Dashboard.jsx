import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import FavoritesList from '../components/FavoritesList'
import RecentSearches from '../components/RecentSearches'


function Dashboard() {
  const { user, logout } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [history, setHistory] = useState([])
  const navigate = useNavigate()

const handleLogout = async () => {
  await logout()
  navigate('/')
}


  const loadData = async () => {
    try {
      const [favRes, historyRes] = await Promise.all([
        api.get('/api/user/favorites'),
        api.get('/api/weather/history'),
      ])
      setFavorites(favRes.data.favorites)
      setHistory(historyRes.data.history)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email}</p>

      <button onClick={handleLogout}>Logout</button>

      <FavoritesList favorites={favorites} onUpdate={loadData} />
      <RecentSearches history={history} />
    </div>
  )
}

export default Dashboard

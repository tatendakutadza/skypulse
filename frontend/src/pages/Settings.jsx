import { useState } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

function Settings() {
  const { user, fetchMe } = useAuth()
  const [units, setUnits] = useState(user?.preferred_units || 'metric')
  const [message, setMessage] = useState(null)

  const handleSave = async () => {
    try {
      await api.patch('/api/user/settings', null, {
        params: { preferred_units: units },
      })
      await fetchMe()
      setMessage('Settings saved')
    } catch (err) {
      setMessage('Failed to save settings')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Settings</h1>
      <label>
        Units:
        <select value={units} onChange={(e) => setUnits(e.target.value)}>
          <option value="metric">Celsius (Metric)</option>
          <option value="imperial">Fahrenheit (Imperial)</option>
        </select>
      </label>
      <button onClick={handleSave}>Save</button>
      {message && <p>{message}</p>}
    </div>
  )
}

export default Settings

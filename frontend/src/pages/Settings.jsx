import { useState } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

function UnitButton({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: 'var(--r-pill)',
        border: selected ? '1px solid rgba(56,189,248,0.4)' : '1px solid var(--sky-border)',
        background: selected ? 'rgba(56,189,248,0.1)' : 'transparent',
        color: selected ? 'var(--sky-pulse)' : 'var(--text-secondary)',
        fontSize: '0.78rem',
        fontFamily: 'var(--font-mono)',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}

function Settings() {
  const { user, fetchMe } = useAuth()
  const [units, setUnits] = useState(user?.preferred_units || 'metric')
  const [message, setMessage] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleSave = async (newUnits) => {
    setUnits(newUnits)
    setSaving(true)
    setMessage(null)
    try {
      await api.patch('/api/user/settings', null, {
        params: { preferred_units: newUnits },
      })
      await fetchMe()
      setMessage('Settings saved')
    } catch (err) {
      setMessage('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      background: 'linear-gradient(180deg, #0d1526 0%, #0a0e1a 100%)',
      padding: '40px 24px',
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '2rem', marginBottom: '6px' }}>
            Settings
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Manage your account and preferences
          </p>
        </div>

        {/* Profile card */}
        <div className="glass" style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          padding: '20px', marginBottom: '20px',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--sky-blue), var(--sky-pulse))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.9rem', fontWeight: 700, flexShrink: 0,
          }}>
            {user?.email?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{user?.email}</h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--sky-pulse)', marginTop: '4px' }}>
              Free Plan
            </p>
          </div>
        </div>

        {/* Units */}
        <div className="glass" style={{ padding: '4px 0', marginBottom: '20px' }}>
          <div style={{ padding: '14px 20px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{
              fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--text-dim)',
            }}>
              Display Units
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px',
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Temperature</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Applies across the app
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <UnitButton label="°C" selected={units === 'metric'} onClick={() => handleSave('metric')} />
              <UnitButton label="°F" selected={units === 'imperial'} onClick={() => handleSave('imperial')} />
            </div>
          </div>
        </div>

        {saving && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Saving…</p>}
        {message && !saving && (
          <p style={{ fontSize: '0.8rem', color: 'var(--sky-safe)' }}>{message}</p>
        )}
      </div>
    </div>
  )
}

export default Settings

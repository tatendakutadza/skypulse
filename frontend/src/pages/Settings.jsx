import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

function SettingsRow({ title, description, children }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{title}</div>
        {description && (
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {description}
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  )
}

function Settings() {
  const { user, fetchMe, logout } = useAuth()
  const navigate = useNavigate()

  const [units, setUnits] = useState(user?.preferred_units || 'metric')
  const [visibilityUnit, setVisibilityUnit] = useState(
    () => localStorage.getItem('skypulse_visibility_unit') || 'km'
  )
  const [windSpeedUnit, setWindSpeedUnit] = useState(
    () => localStorage.getItem('skypulse_wind_unit') || 'kmh'
  )
  const [pressureUnit, setPressureUnit] = useState(
    () => localStorage.getItem('skypulse_pressure_unit') || 'hpa'
  )
  const [message, setMessage] = useState(null)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleUnitsSave = async (newUnits) => {
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

  const handleVisibilityChange = (unit) => {
    setVisibilityUnit(unit)
    // Visibility unit is display-only — OWM always returns meters,
    // so this is a frontend preference, not a backend field.
    localStorage.setItem('skypulse_visibility_unit', unit)
  }

  const handleWindUnitChange = (unit) => {
    setWindSpeedUnit(unit)
    // Display-only — OWM returns m/s or mph depending on preferred_units,
    // we convert client-side for whichever unit is chosen here.
    localStorage.setItem('skypulse_wind_unit', unit)
  }

  const handlePressureUnitChange = (unit) => {
    setPressureUnit(unit)
    // Display-only — OWM always returns hPa, inHg is a client-side conversion.
    localStorage.setItem('skypulse_pressure_unit', unit)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete('/api/auth/me')
      await logout()
      navigate('/')
    } catch (err) {
      setMessage('Could not delete account. Try again.')
      setDeleting(false)
    }
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        background: 'var(--page-gradient)',
        padding: '40px 24px',
      }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '2rem',
              color: 'var(--text-primary)',
              marginBottom: '6px',
            }}
          >
            Settings
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Manage your account and preferences
          </p>
        </div>

        {/* Profile card */}
        <div
          className="glass"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--sky-blue), var(--sky-pulse))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            {user?.email?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              {user?.email}
            </h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--sky-pulse)', marginTop: '4px', margin: 0 }}>
              Free Plan
            </p>
          </div>
        </div>

        {/* Units */}
        <div className="glass" style={{ padding: '4px 0', marginBottom: '20px' }}>
          <div style={{ padding: '14px 20px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div
              style={{
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-dim)',
              }}
            >
              Units
            </div>
          </div>

          <SettingsRow title="Temperature" description="Applies across the app">
            <div style={{ display: 'flex', gap: '6px' }}>
              <UnitButton label="°C" selected={units === 'metric'} onClick={() => handleUnitsSave('metric')} />
              <UnitButton label="°F" selected={units === 'imperial'} onClick={() => handleUnitsSave('imperial')} />
            </div>
          </SettingsRow>

          <SettingsRow title="Visibility" description="Distance shown on weather cards">
            <div style={{ display: 'flex', gap: '6px' }}>
              <UnitButton label="km" selected={visibilityUnit === 'km'} onClick={() => handleVisibilityChange('km')} />
              <UnitButton label="mi" selected={visibilityUnit === 'mi'} onClick={() => handleVisibilityChange('mi')} />
            </div>
          </SettingsRow>

          <SettingsRow title="Wind speed" description="Shown on the current conditions card">
            <div style={{ display: 'flex', gap: '6px' }}>
              <UnitButton label="km/h" selected={windSpeedUnit === 'kmh'} onClick={() => handleWindUnitChange('kmh')} />
              <UnitButton label="mph" selected={windSpeedUnit === 'mph'} onClick={() => handleWindUnitChange('mph')} />
              <UnitButton label="m/s" selected={windSpeedUnit === 'ms'} onClick={() => handleWindUnitChange('ms')} />
            </div>
          </SettingsRow>

          <SettingsRow title="Pressure" description="Atmospheric pressure unit">
            <div style={{ display: 'flex', gap: '6px' }}>
              <UnitButton label="hPa" selected={pressureUnit === 'hpa'} onClick={() => handlePressureUnitChange('hpa')} />
              <UnitButton label="inHg" selected={pressureUnit === 'inhg'} onClick={() => handlePressureUnitChange('inhg')} />
            </div>
          </SettingsRow>
        </div>

        {saving && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Saving…</p>}
        {message && !saving && (
          <p style={{ fontSize: '0.8rem', color: message.includes('Failed') || message.includes('Could not') ? '#FCA5A5' : 'var(--sky-safe)' }}>
            {message}
          </p>
        )}

        {/* Account actions */}
        <div className="glass" style={{ padding: '4px 0', marginTop: '20px', marginBottom: '20px' }}>
          <div style={{ padding: '14px 20px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div
              style={{
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-dim)',
              }}
            >
              Account
            </div>
          </div>

          <SettingsRow title="Sign out" description="End your current session">
            <button
              onClick={handleLogout}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--r-pill)',
                border: '1px solid var(--sky-border)',
                background: 'var(--sky-surface)',
                color: 'var(--text-secondary)',
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              Sign out
            </button>
          </SettingsRow>
        </div>

        {/* Danger zone — visually separated, red border, distinct from neutral account actions */}
        <div
          className="glass"
          style={{
            padding: '4px 0',
            border: '1px solid rgba(239,68,68,0.25)',
          }}
        >
          <div style={{ padding: '14px 20px 10px', borderBottom: '1px solid rgba(239,68,68,0.12)' }}>
            <div
              style={{
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--sky-danger)',
              }}
            >
              Danger Zone
            </div>
          </div>

          <SettingsRow title="Delete account" description="Permanently remove your data — cannot be undone">
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--r-pill)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  background: 'rgba(239,68,68,0.08)',
                  color: 'var(--sky-danger)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
              >
                Delete permanently
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 'var(--r-pill)',
                    border: '1px solid var(--sky-border)',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 'var(--r-pill)',
                    border: 'none',
                    background: 'var(--sky-danger)',
                    color: '#fff',
                    fontSize: '0.76rem',
                    cursor: deleting ? 'default' : 'pointer',
                    opacity: deleting ? 0.6 : 1,
                  }}
                >
                  {deleting ? 'Deleting…' : 'Confirm delete'}
                </button>
              </div>
            )}
          </SettingsRow>
        </div>
      </div>
    </div>
  )
}

export default Settings

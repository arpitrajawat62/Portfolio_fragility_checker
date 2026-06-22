import { useState } from 'react'
import axios from 'axios'
import angelOneLogo from '../assets/icon.webp'


export default function LoginPage({ onLogin, onBack }) {
  const [form, setForm] = useState({ client_code: '', password: '', totp: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleLogin() {
    if (!form.client_code || !form.password || !form.totp) {
      setError('Please fill in all fields.')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      console.log('Attempting login...')
      
      const res = await axios.post('/auth/login', {
        client_code: form.client_code,
        password: form.password,
        totp: form.totp
      })
      
      console.log('Login response:', res.data)
      
      if (res.data.success) {
        localStorage.setItem('client_code', res.data.client_code)
        onLogin(res.data.client_code)
      } else {
        setError(res.data.detail || 'Login failed. Check your credentials.')
      }
    } catch (err) {
      console.error('Login error:', err)
      
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to the server. Please check that all Docker containers are running.')
      } else if (err.response) {
        setError(err.response.data?.detail || `Server error: ${err.response.status}`)
      } else {
        setError(err.message || 'Login failed. Check your credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <button className="btn-back" onClick={onBack}>
          ← Back to home
        </button>

        <div className="login-header">
          <div className="login-icon">
            <img 
              src={angelOneLogo} 
              alt="Angel One" 
              className="angel-one-logo"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          </div>
          <h1>Angel One Access</h1>
          <p>Secure read‑only portfolio connection</p>
        </div>

        <div className="form-group">
          <label>Client Code</label>
          <input
            name="client_code"
            placeholder="e.g. A123456"
            value={form.client_code}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Your Angel One login password"
            value={form.password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="form-group">
          <label>
            TOTP <span className="label-hint">(6-digit code from authenticator)</span>
          </label>
          <input
            name="totp"
            placeholder="e.g. 482910"
            maxLength={6}
            value={form.totp}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button className="btn-primary" onClick={handleLogin} disabled={loading}>
          {loading ? (
            <span className="btn-loading">
              <span className="btn-spinner"></span> Authenticating...
            </span>
          ) : (
            'Login with Angel One →'
          )}
        </button>

        {error && <div className="error-msg">⚠️ {error}</div>}

        <p className="login-note">
          We only request read access to your holdings. Nothing is traded. Data never stored.
        </p>
      </div>
    </div>
  )
}
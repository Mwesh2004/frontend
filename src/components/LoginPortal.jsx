import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import './LoginPortal.css'

export default function LoginPortal() {
  const { login, authenticateWithPasskey, checkBiometricSupport } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [bioLoading, setBioLoading] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const hasBio = checkBiometricSupport()

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      const result = login(username, password)
      if (!result.success) {
        setError(result.error)
      }
      setLoading(false)
    }, 600)
  }

  const handleBiometric = async () => {
    setBioLoading(true)
    setError('')
    const result = await authenticateWithPasskey()
    if (!result.success) {
      setError(result.error)
    }
    setBioLoading(false)
  }

  const hints = [
    { u: 'beryl', p: 'bbytes2026', role: 'Super Admin' },
    { u: 'manager', p: 'manager123', role: 'Manager' },
    { u: 'cashier1', p: 'cashier123', role: 'Cashier' },
    { u: 'cashier2', p: 'cashier456', role: 'Cashier' },
  ]

  return (
    <div className={`login-root ${loaded ? 'in' : ''}`}>
      {/* Animated Background */}
      <div className="login-bg">
        <div className="lg-orb lg-o1" />
        <div className="lg-orb lg-o2" />
        <div className="lg-orb lg-o3" />
        <div className="lg-orb lg-o4" />
        <div className="lg-grid" />
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`lg-particle lp-${i + 1}`} />
        ))}
        <div className="lg-ring" />
      </div>

      <div className="login-content">
        {/* Brand */}
        <div className={`login-brand ${loaded ? 'slide-down' : ''}`}>
          <div className="lb-logo">B</div>
          <div className="lb-text">
            <div className="lb-name">Beryl<em>Bytes</em></div>
            <div className="lb-sub">POINT OF SALE SYSTEM</div>
          </div>
        </div>

        {/* Login Card */}
        <div className={`login-card ${loaded ? 'scale-in' : ''}`}>
          <div className="lc-glow" />
          <div className="lc-header">
            <h1>Welcome Back</h1>
            <p>Sign in to access your terminal</p>
          </div>

          <form onSubmit={handleLogin} className="lc-form">
            <div className={`lc-field ${username ? 'has-value' : ''}`}>
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                autoFocus
                autoComplete="username"
              />
              <span className="lc-icon">👤</span>
            </div>

            <div className={`lc-field ${password ? 'has-value' : ''}`}>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
              />
              <span className="lc-icon">🔒</span>
            </div>

            {error && <div className="lc-error shake">{error}</div>}

            <button
              type="submit"
              className={`lc-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className="lc-spinner" />
              ) : (
                <>
                  Sign In <span className="lc-arrow">→</span>
                </>
              )}
            </button>

            {hasBio && (
              <button
                type="button"
                className={`lc-bio-btn ${bioLoading ? 'loading' : ''}`}
                onClick={handleBiometric}
                disabled={bioLoading}
              >
                <span className="bio-icon">🔐</span>
                {bioLoading ? 'Verifying...' : 'Sign in with Biometrics'}
              </button>
            )}
          </form>

          <div className="lc-footer">
            <button
              className="lc-hint-toggle"
              onClick={() => setShowHints(!showHints)}
            >
              {showHints ? 'Hide credentials' : 'Show demo credentials'}
            </button>

            {showHints && (
              <div className="lc-hints">
                {hints.map((h, i) => (
                  <div
                    key={i}
                    className="lc-hint"
                    onClick={() => { setUsername(h.u); setPassword(h.p) }}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <span className="hint-role">{h.role}</span>
                    <span className="hint-creds">{h.u} / {h.p}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={`login-meta ${loaded ? 'fade-up' : ''}`}>
          <span>🔒 Encrypted Connection</span>
          <span>•</span>
          <span>v4.3.0 Enterprise</span>
        </div>
      </div>
    </div>
  )
}

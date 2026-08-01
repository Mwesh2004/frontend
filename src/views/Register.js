import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SvgIcon({ icon, size = 20 }) {
  const getPath = () => {
    switch (icon) {
      case 'google':
        return <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />;
      case 'apple':
        return <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.05 2.26.7 2.94.7.7 0 1.81-.84 3.12-.76 1.41.07 2.66.57 3.5 1.49-3.03 1.83-2.55 5.56.32 6.74-.69 2-1.7 4.14-1.88 4.8zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.36 2.37-1.81 4.19-3.74 4.25z" />;
      default:
        return null;
    }
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {getPath()}
      {icon === 'google' && (
        <>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </>
      )}
    </svg>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [showOAuthModal, setShowOAuthModal] = React.useState(false);
  const [oauthProvider, setOauthProvider] = React.useState('');
  const [oauthStep, setOauthStep] = React.useState(1);

  const handleOAuth = (provider) => {
    setOauthProvider(provider);
    setShowOAuthModal(true);
    setOauthStep(1);
    setTimeout(() => {
      setOauthStep(2);
    }, 1500);
  };

  const completeOAuth = () => {
    setOauthStep(3);
    setTimeout(() => {
      setShowOAuthModal(false);
      navigate('/login');
    }, 1500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#04060a',
      backgroundImage: `radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.15), transparent 50%),
                        radial-gradient(circle at 100% 100%, rgba(5, 150, 105, 0.1), transparent 50%)`,
      padding: '20px',
      color: '#e2e8f0',
      fontFamily: '"DM Sans", "Syne", sans-serif'
    }}>
      <div className="glass-panel fade-in-up" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '48px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        textAlign: 'center'
      }}>
        
        <img src="/logo.jpg" alt="BerylBytes Logo" style={{ 
          width: '64px', height: '64px', margin: '0 auto 24px', display: 'block', 
          borderRadius: '16px', objectFit: 'cover', boxShadow: '0 0 20px rgba(16,185,129,0.3)' 
        }} />

        <h2 style={{ fontFamily: '"Syne", sans-serif', fontSize: '1.8rem', fontWeight: 700, margin: '0 0 8px 0', color: '#fff' }}>Create Workspace</h2>
        <p style={{ color: '#94a3b8', margin: '0 0 32px 0', fontSize: '0.95rem' }}>Join BerylBytes and run your business</p>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button id="btn-google" className="hover-scale" onClick={() => handleOAuth('google')} style={{
            flex: 1, padding: '12px', background: '#fff', border: 'none', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer',
            color: '#0f172a', fontWeight: 600, fontSize: '0.95rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', transition: 'opacity 0.2s'
          }}>
            <SvgIcon icon="google" size={18} /> Google
          </button>
          <button id="btn-apple" className="hover-scale" onClick={() => handleOAuth('apple')} style={{
            flex: 1, padding: '12px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer',
            color: '#fff', fontWeight: 600, fontSize: '0.95rem', transition: 'opacity 0.2s'
          }}>
            <SvgIcon icon="apple" size={18} /> Apple
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>OR CONTINUE WITH EMAIL</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Workspace Name</label>
            <input placeholder="e.g. Acme Corp" style={{
              width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box'
            }} onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Email Address</label>
            <input type="email" placeholder="you@company.com" style={{
              width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box'
            }} onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Password</label>
            <input type="password" placeholder="••••••••" style={{
              width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box'
            }} onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
          </div>

          <button className="hover-scale" onClick={() => navigate('/login')} style={{
            width: '100%', padding: '14px', marginTop: '8px',
            background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff',
            border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '1rem',
            cursor: 'pointer', boxShadow: '0 8px 20px rgba(16,185,129,0.3)'
          }}>
            Create Workspace
          </button>
        </div>

        <p style={{ marginTop: '32px', color: '#64748b', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>

      </div>

      {/* Simulated OAuth Modal */}
      {showOAuthModal && (
        <div style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div style={{ width: '100%', maxWidth: '380px', padding: '32px', background: '#fff', color: '#202124', borderRadius: '8px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
            
            {oauthStep === 1 && (
              <div style={{ padding: '40px 0' }}>
                <div style={{ width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: `3px solid ${oauthProvider === 'google' ? '#4285F4' : '#000'}`, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 500 }}>Connecting to {oauthProvider === 'google' ? 'Google' : 'Apple'}...</h3>
              </div>
            )}

            {oauthStep === 2 && (
              <div style={{ animation: 'fadeIn 0.3s' }}>
                <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  {oauthProvider === 'google' ? (
                    <svg width={32} height={32} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  ) : (
                    <svg width={32} height={32} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#000" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.05 2.26.7 2.94.7.7 0 1.81-.84 3.12-.76 1.41.07 2.66.57 3.5 1.49-3.03 1.83-2.55 5.56.32 6.74-.69 2-1.7 4.14-1.88 4.8zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.36 2.37-1.81 4.19-3.74 4.25z" />
                    </svg>
                  )}
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 500, marginBottom: '8px' }}>Sign in</h2>
                <p style={{ color: '#5f6368', fontSize: '1rem', marginBottom: '24px' }}>to continue to BerylBytes</p>
                
                <div style={{ textAlign: 'left', border: '1px solid #dadce0', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'background 0.2s' }} onClick={completeOAuth} onMouseOver={e => e.currentTarget.style.background='#f8f9fa'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>B</div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>Beryl Munyao</div>
                    <div style={{ color: '#5f6368', fontSize: '0.85rem' }}>beryl@berylbytes.co.ke</div>
                  </div>
                </div>

                <div style={{ textAlign: 'left', color: '#5f6368', fontSize: '0.85rem' }}>
                  To continue, {oauthProvider === 'google' ? 'Google' : 'Apple'} will share your name, email address, and profile picture with BerylBytes.
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
                  <button onClick={() => setShowOAuthModal(false)} style={{ background: 'none', border: 'none', color: '#1a73e8', fontWeight: 500, fontSize: '0.95rem', cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            )}

            {oauthStep === 3 && (
              <div style={{ padding: '40px 0' }}>
                <div style={{ width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: `3px solid ${oauthProvider === 'google' ? '#4285F4' : '#000'}`, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 500 }}>Authenticating...</h3>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

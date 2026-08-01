import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

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
        textAlign: 'center',
        borderRadius: '24px'
      }}>
        
        <img src="/logo.jpg" alt="BerylBytes Logo" style={{ 
          width: '64px', height: '64px', margin: '0 auto 24px', display: 'block', 
          borderRadius: '16px', objectFit: 'cover', boxShadow: '0 0 20px rgba(16,185,129,0.3)' 
        }} />

        <h2 style={{ fontFamily: '"Syne", sans-serif', fontSize: '1.8rem', fontWeight: 700, margin: '0 0 8px 0', color: '#fff' }}>BerylBytes OS</h2>
        <p style={{ color: '#94a3b8', margin: '0 0 32px 0', fontSize: '0.95rem' }}>Enterprise Point of Sale & Retail Management</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button className="hover-scale" onClick={() => navigate('/login')} style={{
            width: '100%', padding: '16px',
            background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff',
            border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '1rem',
            cursor: 'pointer', boxShadow: '0 8px 20px rgba(16,185,129,0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}>
            Sign In to Dashboard
          </button>
          
          <button className="hover-scale" onClick={() => navigate('/register')} style={{
            width: '100%', padding: '16px',
            background: 'rgba(255,255,255,0.05)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontWeight: 600, fontSize: '1rem',
            cursor: 'pointer', transition: 'background 0.2s'
          }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
            Create Workspace
          </button>
        </div>

        <div style={{ marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
          <a href="http://localhost:5173" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#10b981'} onMouseOut={e => e.target.style.color = '#94a3b8'}>
            &larr; Back to Marketing Website
          </a>
        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  return (
    <div style={{ background: '#04070f', minHeight: '100vh', color: 'white', padding: 40, textAlign: 'center' }}>
      <h1>Simple, Transparent Pricing</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 40 }}>
        <div style={{ border: '1px solid #333', padding: 40, borderRadius: 16 }}>
          <h3>Starter</h3><p>$29/mo</p><Link to="/register">Sign Up</Link>
        </div>
        <div style={{ border: '1px solid #00f0a0', padding: 40, borderRadius: 16 }}>
          <h3>Pro</h3><p>$79/mo</p><Link to="/register">Sign Up</Link>
        </div>
        <div style={{ border: '1px solid #333', padding: 40, borderRadius: 16 }}>
          <h3>Enterprise</h3><p>$199/mo</p><Link to="/register">Sign Up</Link>
        </div>
      </div>
      <div style={{ marginTop: 40 }}><Link to="/" style={{color: 'white'}}>Back to Home</Link></div>
    </div>
  );
}

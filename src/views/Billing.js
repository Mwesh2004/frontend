import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Billing() {
  const [activeModal, setActiveModal] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePayment = (method) => {
    setActiveModal(method);
  };

  const simulatePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setActiveModal('success');
    }, 2000);
  };

  return (
    <div style={{ background: '#04070f', minHeight: '100vh', color: 'white', padding: '40px 10%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <h1>Subscription & Billing</h1>
        <Link to="/admin" style={{ color: '#5a7a9a', textDecoration: 'none' }}>&larr; Back to Admin</Link>
      </header>

      <div style={{ display: 'flex', gap: 30 }}>
        <div style={{ background: '#111', padding: 30, borderRadius: 16, flex: 1, border: '1px solid #333' }}>
          <h3 style={{ color: '#00f0a0', marginBottom: 10 }}>Current Plan: Pro (Monthly)</h3>
          <p style={{ color: '#888', fontSize: 14 }}>Manage your workspace limits and features.</p>
          <div style={{ margin: '30px 0', fontSize: 32, fontWeight: 'bold' }}>$79.00 <span style={{fontSize: 14, color: '#666', fontWeight: 'normal'}}>/ user</span></div>
          <p style={{ fontSize: 14 }}>Next billing date: <strong>July 1, 2026</strong></p>
        </div>

        <div style={{ background: '#111', padding: 30, borderRadius: 16, flex: 1, border: '1px solid #333' }}>
          <h3>Upgrade or Change Plan</h3>
          <p style={{ color: '#888', fontSize: 14, marginTop: 10 }}>Ready for more features? Switch to Enterprise.</p>
          <button style={{ marginTop: 20, padding: '10px 20px', background: 'transparent', border: '1px solid #00f0a0', color: '#00f0a0', borderRadius: 8, cursor: 'pointer' }}>View All Plans</button>
        </div>
      </div>

      <h3 style={{ marginTop: 60, marginBottom: 20 }}>Select Payment Gateway</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
        
        {/* Stripe */}
        <div style={{ background: '#1a1b26', padding: 25, borderRadius: 12, border: '1px solid #333', textAlign: 'center', cursor: 'pointer' }} onClick={() => handlePayment('stripe')}>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#635BFF', marginBottom: 10 }}>Stripe</div>
          <p style={{ fontSize: 12, color: '#888' }}>Pay with Credit Card</p>
        </div>

        {/* Paystack */}
        <div style={{ background: '#1a1b26', padding: 25, borderRadius: 12, border: '1px solid #333', textAlign: 'center', cursor: 'pointer' }} onClick={() => handlePayment('paystack')}>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#09A5DB', marginBottom: 10 }}>Paystack</div>
          <p style={{ fontSize: 12, color: '#888' }}>Local Cards & Mobile Money</p>
        </div>

        {/* M-Pesa */}
        <div style={{ background: '#1a1b26', padding: 25, borderRadius: 12, border: '1px solid #333', textAlign: 'center', cursor: 'pointer' }} onClick={() => handlePayment('mpesa')}>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#4CAF50', marginBottom: 10 }}>M-Pesa</div>
          <p style={{ fontSize: 12, color: '#888' }}>Lipa na M-Pesa Online</p>
        </div>

      </div>

      {activeModal && activeModal !== 'success' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', color: '#000', padding: 40, borderRadius: 16, width: 400, position: 'relative' }}>
            <button onClick={() => setActiveModal(null)} style={{ position: 'absolute', top: 15, right: 15, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>&times;</button>
            <h2 style={{ marginBottom: 20, textTransform: 'capitalize', color: activeModal === 'stripe' ? '#635BFF' : activeModal === 'paystack' ? '#09A5DB' : '#4CAF50' }}>{activeModal} Checkout</h2>
            <p style={{ marginBottom: 30, color: '#666' }}>Amount due: <strong>$79.00</strong></p>
            
            {activeModal === 'mpesa' ? (
              <input type="text" placeholder="Phone Number (e.g., 254700000000)" style={{ width: '100%', padding: 12, marginBottom: 20, border: '1px solid #ccc', borderRadius: 8 }} />
            ) : (
              <input type="text" placeholder="Card Number" style={{ width: '100%', padding: 12, marginBottom: 20, border: '1px solid #ccc', borderRadius: 8 }} />
            )}
            
            <button onClick={simulatePayment} disabled={loading} style={{ width: '100%', padding: 15, background: '#111', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>
              {loading ? 'Processing...' : `Pay $79.00`}
            </button>
          </div>
        </div>
      )}

      {activeModal === 'success' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#111', color: '#00f0a0', padding: 40, borderRadius: 16, width: 400, textAlign: 'center', border: '1px solid #00f0a0' }}>
            <div style={{ fontSize: 40, marginBottom: 20 }}>&#10004;</div>
            <h2>Payment Successful!</h2>
            <p style={{ color: '#fff', marginTop: 10, marginBottom: 30 }}>Your subscription has been renewed.</p>
            <button onClick={() => setActiveModal(null)} style={{ padding: '10px 20px', background: '#00f0a0', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

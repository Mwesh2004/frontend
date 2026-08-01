import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Viewer.css';

export default function Viewer() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [liveSales] = useState([
    { id: 'INV-1004', time: '14:32', item: 'Maize Flour 2kg', amount: 220, status: 'Paid' },
    { id: 'INV-1003', time: '14:28', item: 'Espresso Double', amount: 280, status: 'Paid' },
    { id: 'INV-1002', time: '13:15', item: 'Panadol Extra x8', amount: 80, status: 'Paid' },
    { id: 'INV-1001', time: '12:05', item: 'Sugar 2kg', amount: 350, status: 'Paid' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalRevenue = liveSales.reduce((acc, sale) => acc + sale.amount, 0);

  return (
    <div className="viewer-root">
      <header className="viewer-header">
        <div className="viewer-brand">
          <div className="viewer-brand-text">Beryl<em>Bytes</em> Viewer</div>
          <div className="live-indicator">
            <div className="live-dot"></div>
            LIVE
          </div>
        </div>
        <div className="nav-links">
          <Link to="/" className="nav-link">Main POS</Link>
          <Link to="/admin" className="nav-link">Admin</Link>
        </div>
      </header>

      <main className="viewer-main">
        <div className="v-grid">
          <div className="v-card">
            <div className="v-card-title">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              Today's Revenue
            </div>
            <div className="v-card-value">KES {totalRevenue.toLocaleString()}</div>
            <div className="v-card-sub">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7"></path></svg>
              Updated just now
            </div>
          </div>
          
          <div className="v-card">
            <div className="v-card-title">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Total Transactions
            </div>
            <div className="v-card-value">{liveSales.length}</div>
            <div className="v-card-sub">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7"></path></svg>
              Active Session
            </div>
          </div>

          <div className="v-card">
            <div className="v-card-title">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Current Time
            </div>
            <div className="v-card-value">{time}</div>
            <div className="v-card-sub" style={{color: '#94a3b8'}}>
              EAT (Nairobi)
            </div>
          </div>
        </div>

        <div className="v-table-container">
          <div className="v-table-header">
            <h2>Recent Transactions</h2>
          </div>
          <table className="v-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Invoice</th>
                <th>Item</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {liveSales.map((sale) => (
                <tr key={sale.id}>
                  <td style={{color: '#94a3b8'}}>{sale.time}</td>
                  <td style={{fontFamily: 'monospace', color: '#3b82f6'}}>{sale.id}</td>
                  <td>{sale.item}</td>
                  <td style={{fontWeight: '600'}}>KES {sale.amount}</td>
                  <td>
                    <span className={`v-pill ${sale.status === 'Paid' ? 'success' : 'warning'}`}>
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

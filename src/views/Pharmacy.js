import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Pharmacy() {
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Paracetamol 500mg', batch: 'B23910', stock: 450, cost: 10, price: 20, expiry: '2027-01-15' },
    { id: 2, name: 'Amoxicillin 250mg', batch: 'A99212', stock: 12, cost: 30, price: 50, expiry: '2026-08-10' },
    { id: 3, name: 'Ibuprofen 400mg', batch: 'IB0045', stock: 0, cost: 15, price: 30, expiry: '2025-12-01' },
    { id: 4, name: 'Cetirizine 10mg', batch: 'C8833', stock: 200, cost: 5, price: 15, expiry: '2026-06-30' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newDrug, setNewDrug] = useState({ name: '', batch: '', stock: '', cost: '', price: '', expiry: '' });

  const getStatus = (stock, expiry) => {
    const today = new Date();
    const expDate = new Date(expiry);
    const monthsToExpiry = (expDate - today) / (1000 * 60 * 60 * 24 * 30);

    if (stock === 0) return <span style={{ color: '#ff4d4d', background: 'rgba(255,77,77,0.1)', padding: '4px 8px', borderRadius: 4 }}>Out of Stock</span>;
    if (monthsToExpiry <= 0) return <span style={{ color: '#ff4d4d', background: 'rgba(255,77,77,0.1)', padding: '4px 8px', borderRadius: 4 }}>Expired</span>;
    if (monthsToExpiry < 3) return <span style={{ color: '#ffcc00', background: 'rgba(255,204,0,0.1)', padding: '4px 8px', borderRadius: 4 }}>Expiring Soon</span>;
    if (stock < 20) return <span style={{ color: '#ffcc00', background: 'rgba(255,204,0,0.1)', padding: '4px 8px', borderRadius: 4 }}>Low Stock</span>;
    
    return <span style={{ color: '#00f0a0', background: 'rgba(0,240,160,0.1)', padding: '4px 8px', borderRadius: 4 }}>Optimal</span>;
  };

  const handleAddDrug = (e) => {
    e.preventDefault();
    const added = { ...newDrug, id: Date.now(), stock: Number(newDrug.stock), cost: Number(newDrug.cost), price: Number(newDrug.price) };
    setInventory([...inventory, added]);
    setShowModal(false);
    setNewDrug({ name: '', batch: '', stock: '', cost: '', price: '', expiry: '' });
  };

  return (
    <div style={{ background: '#04070f', minHeight: '100vh', color: 'white', padding: '40px 5%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>Pharmacy Module</h1>
          <p style={{ color: '#888', margin: '5px 0 0 0' }}>Manage drug inventory, expirations, and batches.</p>
        </div>
        <div>
          <Link to="/pos" style={{ color: '#5a7a9a', marginRight: 20, textDecoration: 'none' }}>&larr; POS Terminal</Link>
          <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', background: '#00f0a0', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>+ Add Drug</button>
        </div>
      </header>

      <div style={{ background: '#111', borderRadius: 12, marginTop: 40, overflow: 'hidden', border: '1px solid #222' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#1a1b26', borderBottom: '1px solid #333' }}>
            <tr>
              <th style={{ padding: '15px 20px', color: '#888', fontSize: 13, textTransform: 'uppercase' }}>Drug Name</th>
              <th style={{ padding: '15px 20px', color: '#888', fontSize: 13, textTransform: 'uppercase' }}>Batch No.</th>
              <th style={{ padding: '15px 20px', color: '#888', fontSize: 13, textTransform: 'uppercase' }}>Stock</th>
              <th style={{ padding: '15px 20px', color: '#888', fontSize: 13, textTransform: 'uppercase' }}>Cost (KES)</th>
              <th style={{ padding: '15px 20px', color: '#888', fontSize: 13, textTransform: 'uppercase' }}>Price (KES)</th>
              <th style={{ padding: '15px 20px', color: '#888', fontSize: 13, textTransform: 'uppercase' }}>Expiry Date</th>
              <th style={{ padding: '15px 20px', color: '#888', fontSize: 13, textTransform: 'uppercase' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '15px 20px', fontWeight: 'bold' }}>{item.name}</td>
                <td style={{ padding: '15px 20px', fontFamily: 'monospace', color: '#38beff' }}>{item.batch}</td>
                <td style={{ padding: '15px 20px' }}>{item.stock}</td>
                <td style={{ padding: '15px 20px', color: '#ff6b6b' }}>{item.cost}</td>
                <td style={{ padding: '15px 20px', color: '#00f0a0' }}>{item.price}</td>
                <td style={{ padding: '15px 20px' }}>{item.expiry}</td>
                <td style={{ padding: '15px 20px', fontSize: 12, fontWeight: 'bold' }}>
                  {getStatus(item.stock, item.expiry)}
                </td>
              </tr>
            ))}
            {inventory.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#888' }}>No drugs in inventory. Add one to get started.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#111', padding: 40, borderRadius: 16, width: 500, border: '1px solid #333', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: 15, right: 15, background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}>&times;</button>
            <h2 style={{ marginBottom: 20 }}>Add New Drug</h2>
            
            <form onSubmit={handleAddDrug}>
              <div style={{ marginBottom: 15 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 5 }}>Drug Name</label>
                <input required value={newDrug.name} onChange={e=>setNewDrug({...newDrug, name: e.target.value})} type="text" style={{ width: '100%', padding: 12, background: '#1a1b26', border: '1px solid #333', color: '#fff', borderRadius: 8 }} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 5 }}>Batch Number</label>
                  <input required value={newDrug.batch} onChange={e=>setNewDrug({...newDrug, batch: e.target.value})} type="text" style={{ width: '100%', padding: 12, background: '#1a1b26', border: '1px solid #333', color: '#fff', borderRadius: 8 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 5 }}>Expiry Date</label>
                  <input required value={newDrug.expiry} onChange={e=>setNewDrug({...newDrug, expiry: e.target.value})} type="date" style={{ width: '100%', padding: 12, background: '#1a1b26', border: '1px solid #333', color: '#fff', borderRadius: 8, colorScheme: 'dark' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 15, marginBottom: 25 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 5 }}>Stock Level</label>
                  <input required value={newDrug.stock} onChange={e=>setNewDrug({...newDrug, stock: e.target.value})} type="number" min="0" style={{ width: '100%', padding: 12, background: '#1a1b26', border: '1px solid #333', color: '#fff', borderRadius: 8 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 5 }}>Cost Price</label>
                  <input required value={newDrug.cost} onChange={e=>setNewDrug({...newDrug, cost: e.target.value})} type="number" min="0" step="0.01" style={{ width: '100%', padding: 12, background: '#1a1b26', border: '1px solid #333', color: '#fff', borderRadius: 8 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 5 }}>Selling Price</label>
                  <input required value={newDrug.price} onChange={e=>setNewDrug({...newDrug, price: e.target.value})} type="number" min="0" step="0.01" style={{ width: '100%', padding: 12, background: '#1a1b26', border: '1px solid #333', color: '#fff', borderRadius: 8 }} />
                </div>
              </div>

              <button type="submit" style={{ width: '100%', padding: 15, background: '#00f0a0', color: '#000', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>Save Drug to Inventory</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

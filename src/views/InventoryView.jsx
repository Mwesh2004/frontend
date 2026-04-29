export default function InventoryView({ inventory, showAddInv, setShowAddInv, newInv, setNewInv, fKES }) {
  return (
    <div className="dash-grid">
      <div className="panel full-col">
        <div className="panel-hd"><h2>📦 Inventory</h2><button className="btn-p btn-sm" onClick={() => setShowAddInv(true)}>+ Add Item</button></div>
        {showAddInv && (
          <div className="inline-form">
            <div className="form-grid">
              <div className="sf"><label>Item Name</label><input value={newInv.name} onChange={e => setNewInv({ ...newInv, name: e.target.value })} /></div>
              <div className="sf"><label>SKU</label><input value={newInv.sku} onChange={e => setNewInv({ ...newInv, sku: e.target.value })} /></div>
              <div className="sf"><label>Category</label>
                <select value={newInv.category} onChange={e => setNewInv({ ...newInv, category: e.target.value })}>
                  {['General', 'Pharmacy', 'Electronics', 'Food', 'Services', 'Hardware'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="sf"><label>Retail Price</label><input type="number" value={newInv.retailPrice} onChange={e => setNewInv({ ...newInv, retailPrice: e.target.value })} /></div>
              <div className="sf"><label>Buying Price</label><input type="number" value={newInv.buyingPrice} onChange={e => setNewInv({ ...newInv, buyingPrice: e.target.value })} /></div>
              <div className="sf"><label>Stock Level</label><input type="number" value={newInv.stockLevel} onChange={e => setNewInv({ ...newInv, stockLevel: e.target.value })} /></div>
              <div className="sf"><label>Min Alert</label><input type="number" value={newInv.minAlert} onChange={e => setNewInv({ ...newInv, minAlert: e.target.value })} /></div>
              <div className="sf"><label>Expiry</label><input type="date" value={newInv.expiry} onChange={e => setNewInv({ ...newInv, expiry: e.target.value })} /></div>
              <div className="sf"><label>Batch</label><input value={newInv.batch} onChange={e => setNewInv({ ...newInv, batch: e.target.value })} /></div>
            </div>
            <div className="btn-row" style={{ marginTop: 10 }}>
              <button className="btn-p" onClick={() => {
                if (!newInv.name) return;
                setInventory(p => [...p, { id: Date.now(), ...newInv, added: new Date().toLocaleDateString('en-KE') }]);
                setNewInv({ name: '', sku: '', category: 'General', retailPrice: '', buyingPrice: '', stockLevel: '', minAlert: '', expiry: '', batch: '' });
                setShowAddInv(false);
              }}>Save</button>
              <button className="btn-g" onClick={() => setShowAddInv(false)}>Cancel</button>
            </div>
          </div>
        )}
        {inventory.length === 0
          ? <div className="empty-state"><div className="e-icon">📦</div><p>No inventory items yet</p></div>
          : <table className="data-table"><thead><tr><th>Name</th><th>SKU</th><th>Category</th><th>Retail</th><th>Stock</th><th>Status</th></tr></thead><tbody>{inventory.map(item => {
            const low = parseInt(item.stockLevel) <= parseInt(item.minAlert || 0);
            return <tr key={item.id}><td>{item.name}</td><td>{item.sku}</td><td>{item.category}</td><td>{fKES(item.retailPrice)}</td><td>{item.stockLevel}</td><td><span className={`pill ${low ? 'unpaid' : 'paid'}`}>{low ? 'Low Stock' : 'OK'}</span></td></tr>
          })}</tbody></table>
        }
      </div>
    </div>
  )
}

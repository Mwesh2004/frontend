import { useState, useEffect } from 'react'
import './App.css'

const categories = {
  shop: {
    label: 'General Shop', icon: '🛒',
    products: [
      { id: 1, name: 'Maize Flour 2kg', price: 220, icon: '🌽' },
      { id: 2, name: 'Cooking Oil 1L', price: 350, icon: '🫙' },
      { id: 3, name: 'Sugar 1kg', price: 180, icon: '🍬' },
      { id: 4, name: 'Rice 2kg', price: 310, icon: '🍚' },
      { id: 5, name: 'Tea Leaves 500g', price: 220, icon: '🍵' },
      { id: 6, name: 'Milk 500ml', price: 65, icon: '🥛' },
      { id: 7, name: 'Bread Loaf', price: 75, icon: '🍞' },
      { id: 8, name: 'Vegetable Oil 2L', price: 680, icon: '🫙' },
      { id: 9, name: 'Omo Detergent 1kg', price: 320, icon: '🧺' },
      { id: 10, name: 'Bar Soap x3', price: 150, icon: '🧼' },
      { id: 11, name: 'Toothpaste 75ml', price: 120, icon: '🪥' },
      { id: 12, name: 'Bathing Soap', price: 80, icon: '🧼' },
    ]
  },
  pharmacy: {
    label: 'Pharmacy', icon: '💊',
    products: [
      { id: 101, name: 'Panadol 500mg x8', price: 50, icon: '💊', tag: 'OTC' },
      { id: 102, name: 'Ibuprofen 400mg x8', price: 80, icon: '💊', tag: 'OTC' },
      { id: 103, name: 'Aspirin 300mg x8', price: 40, icon: '💊', tag: 'OTC' },
      { id: 104, name: 'Amoxicillin 250mg x21', price: 320, icon: '💉', tag: 'POM' },
      { id: 105, name: 'Azithromycin 500mg x3', price: 450, icon: '💉', tag: 'POM' },
      { id: 106, name: 'Ciprofloxacin 500mg', price: 380, icon: '💉', tag: 'POM' },
      { id: 107, name: 'Actifed Syrup 100ml', price: 280, icon: '🍶', tag: 'OTC' },
      { id: 108, name: 'ORS Sachet x5', price: 100, icon: '💧', tag: 'OTC' },
      { id: 109, name: 'Coartem x24', price: 850, icon: '💊', tag: 'POM' },
      { id: 110, name: 'Vitamin C 1000mg x30', price: 480, icon: '🍊', tag: 'OTC' },
      { id: 111, name: 'Dettol 250ml', price: 320, icon: '🧴', tag: 'OTC' },
      { id: 112, name: 'Thermometer Digital', price: 850, icon: '🌡️', tag: 'OTC' },
    ]
  },
  airbnb: {
    label: 'Airbnb', icon: '🏠',
    products: [
      { id: 201, name: 'Single Room 1 Night', price: 2500, icon: '🛏️' },
      { id: 202, name: 'Double Room 1 Night', price: 4500, icon: '🛏️' },
      { id: 203, name: 'Full House 1 Night', price: 8000, icon: '🏠' },
      { id: 204, name: 'Airport Pickup', price: 1500, icon: '🚗' },
      { id: 205, name: 'Breakfast x1', price: 800, icon: '🍳' },
      { id: 206, name: 'Extra Towels', price: 200, icon: '🛁' },
      { id: 207, name: 'Late Checkout Fee', price: 1000, icon: '⏰' },
      { id: 208, name: 'Laundry Service', price: 500, icon: '👕' },
      { id: 209, name: 'City Tour 4hrs', price: 3500, icon: '🗺️' },
      { id: 210, name: 'Pool Access', price: 500, icon: '🏊' },
    ]
  }
}

export default function App() {
  const [cart, setCart] = useState([])
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [msgType, setMsgType] = useState('info')
  const [activeCategory, setActiveCategory] = useState('shop')
  const [search, setSearch] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [payMethod, setPayMethod] = useState('mpesa')
  const [showPayPanel, setShowPayPanel] = useState(false)
  const [cashIn, setCashIn] = useState('')

  useEffect(() => { setTimeout(() => setLoaded(true), 80) }, [])

  const addToCart = (product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id)
      return ex ? prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...product, qty: 1 }]
    })
  }

  const removeFromCart = (id) => setCart(c => c.filter(i => i.id !== id))
  const updateQty = (id, d) => setCart(c => c.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i))

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const tax = Math.round(subtotal * 0.16)
  const grand = subtotal + tax
  const change = cashIn ? parseInt(cashIn) - grand : 0

  const handleMpesa = async () => {
    if (!phone) { setMessage('Enter customer phone number'); setMsgType('error'); return }
    setMessage('Sending prompt to customer phone...'); setMsgType('loading')
    try {
      const res = await fetch('http://localhost:3000/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount: grand })
      })
      const data = await res.json()
      if (data.ResponseCode === '0') {
        setMessage('✓ Prompt sent! Awaiting PIN entry.'); setMsgType('success')
        setTimeout(() => { setCart([]); setMessage(''); setShowPayPanel(false); setPhone('') }, 4000)
      } else {
        setMessage('Payment request failed. Try again.'); setMsgType('error')
      }
    } catch { setMessage('Cannot reach server. Check connection.'); setMsgType('error') }
  }

  const handleCash = () => {
    if (!cashIn || change < 0) { setMessage('Insufficient cash amount'); setMsgType('error'); return }
    setMessage(`✓ Change: KES ${change.toLocaleString()}`); setMsgType('success')
    setTimeout(() => { setCart([]); setMessage(''); setShowPayPanel(false); setCashIn('') }, 3000)
  }

  const products = categories[activeCategory].products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={`pr ${loaded ? 'in' : ''}`}>
      {/* Ambient Background */}
      <div className="amb">
        {[...Array(8)].map((_, i) => <div key={i} className={`ab ab${i + 1}`}></div>)}
        <div className="grid-tex"></div>
      </div>

      {/* Header */}
      <header className="hd">
        <div className="hd-brand">
          <img src="/logo.png" alt="BBytes" className="hd-logo" />
          <div className="hd-txt">
            <span className="hd-name">Beryl<em>Bytes</em></span>
            <span className="hd-sub">Point of Sale Terminal</span>
          </div>
        </div>

        <nav className="cat-nav">
          {Object.entries(categories).map(([key, val]) => (
            <button key={key} className={`cn ${activeCategory === key ? 'act' : ''}`}
              onClick={() => { setActiveCategory(key); setSearch('') }}>
              <span>{val.icon}</span>
              <span>{val.label}</span>
            </button>
          ))}
        </nav>

        <div className="hd-right">
          <div className="srch">
            <span>⌕</span>
            <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <a href="/admin" className="adm-link">Admin Portal ↗</a>
        </div>
      </header>

      {/* Body */}
      <div className="bd">
        {/* Products */}
        <section className="ps">
          {activeCategory === 'pharmacy' && (
            <div className="ph-warn">⚠ POM items require a valid prescription before dispensing.</div>
          )}
          <div className="pg">
            {products.map((p, i) => (
              <div key={p.id} className="pc" style={{ animationDelay: `${i * 0.035}s` }} onClick={() => addToCart(p)}>
                <div className="pc-shine"></div>
                <div className="pc-ic">{p.icon}</div>
                <div className="pc-nm">{p.name}</div>
                <div className="pc-pr">KES {p.price.toLocaleString()}</div>
                {p.tag && <span className={`pc-tag ${p.tag === 'POM' ? 'pom' : 'otc'}`}>{p.tag}</span>}
                <div className="pc-plus">＋</div>
              </div>
            ))}
          </div>
        </section>

        {/* Cart */}
        <aside className="cp">
          <div className="cp-hd">
            <h2>Order</h2>
            {cart.length > 0 && <button className="clr" onClick={() => setCart([])}>Clear all</button>}
          </div>

          <div className="ci-list">
            {cart.length === 0 ? (
              <div className="ci-empty">
                <div className="ce-ic">🛍</div>
                <p>Cart is empty</p>
                <span>Tap products to add them</span>
              </div>
            ) : cart.map(item => (
              <div key={item.id} className="ci">
                <span className="ci-ico">{item.icon}</span>
                <div className="ci-inf">
                  <div className="ci-nm">{item.name}</div>
                  <div className="ci-pr">KES {(item.price * item.qty).toLocaleString()}</div>
                </div>
                <div className="ci-ctl">
                  <button className="qb" onClick={() => updateQty(item.id, -1)}>−</button>
                  <span>{item.qty}</span>
                  <button className="qb" onClick={() => updateQty(item.id, 1)}>+</button>
                  <button className="rb" onClick={() => removeFromCart(item.id)}>×</button>
                </div>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <>
              <div className="tots">
                <div className="tr"><span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span></div>
                <div className="tr"><span>VAT 16%</span><span>KES {tax.toLocaleString()}</span></div>
                <div className="tr gd"><span>Total</span><span>KES {grand.toLocaleString()}</span></div>
              </div>
              <button className="chg-btn" onClick={() => setShowPayPanel(true)}>
                Charge KES {grand.toLocaleString()} <span>→</span>
              </button>
            </>
          )}
        </aside>
      </div>

      {/* Payment Modal */}
      {showPayPanel && (
        <div className="ov" onClick={e => e.target === e.currentTarget && setShowPayPanel(false)}>
          <div className="pm">
            <div className="pm-hd">
              <div>
                <h3>Payment</h3>
                <div className="pm-amt">KES {grand.toLocaleString()}</div>
              </div>
              <button className="pm-cls" onClick={() => setShowPayPanel(false)}>×</button>
            </div>

            <div className="pm-methods">
              {[{ id: 'mpesa', icon: '📱', label: 'M-Pesa' }, { id: 'card', icon: '💳', label: 'Card' }, { id: 'cash', icon: '💵', label: 'Cash' }].map(m => (
                <button key={m.id} className={`pmm ${payMethod === m.id ? 'act' : ''}`} onClick={() => setPayMethod(m.id)}>
                  <span>{m.icon}</span><span>{m.label}</span>
                </button>
              ))}
            </div>

            {payMethod === 'mpesa' && (
              <div className="pm-form">
                <label>Customer Phone</label>
                <input type="tel" placeholder="254712345678" value={phone} onChange={e => setPhone(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleMpesa()} />
                <button className="pm-go" onClick={handleMpesa}>📱 Send M-Pesa Prompt</button>
              </div>
            )}

            {payMethod === 'card' && (
              <div className="pm-form">
                <div className="pm-info">Present card to terminal. Powered by Flutterwave.</div>
                <button className="pm-go">💳 Process Card Payment</button>
              </div>
            )}

            {payMethod === 'cash' && (
              <div className="pm-form">
                <label>Cash Received (KES)</label>
                <input type="number" placeholder="Enter amount" value={cashIn} onChange={e => setCashIn(e.target.value)} />
                {cashIn && <div className={`pm-change ${change >= 0 ? 'pos' : 'neg'}`}>
                  {change >= 0 ? `Change: KES ${change.toLocaleString()}` : `Short: KES ${Math.abs(change).toLocaleString()}`}
                </div>}
                <button className="pm-go" onClick={handleCash}>💵 Confirm Cash Payment</button>
              </div>
            )}

            {message && <div className={`pm-msg ${msgType}`}>{message}</div>}
          </div>
        </div>
      )}
    </div>
  )
}
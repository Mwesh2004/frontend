import { useState } from 'react'
import Admin from './Admin'
const categories = {
  shop: {
    label: '🛒 General Shop',
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
    label: '💊 Pharmacy',
    products: [
      // OTC Pain & Fever
      { id: 101, name: 'Panadol 500mg x8', price: 50, icon: '💊', tag: 'OTC' },
      { id: 102, name: 'Ibuprofen 400mg x8', price: 80, icon: '💊', tag: 'OTC' },
      { id: 103, name: 'Aspirin 300mg x8', price: 40, icon: '💊', tag: 'OTC' },
      { id: 104, name: 'Hedex Extra x8', price: 90, icon: '💊', tag: 'OTC' },
      // Antibiotics (require prescription in Kenya)
      { id: 105, name: 'Amoxicillin 250mg x21', price: 320, icon: '💉', tag: 'POM' },
      { id: 106, name: 'Amoxicillin 500mg x21', price: 480, icon: '💉', tag: 'POM' },
      { id: 107, name: 'Azithromycin 500mg x3', price: 450, icon: '💉', tag: 'POM' },
      { id: 108, name: 'Ciprofloxacin 500mg x10', price: 380, icon: '💉', tag: 'POM' },
      { id: 109, name: 'Metronidazole 400mg x21', price: 280, icon: '💉', tag: 'POM' },
      { id: 110, name: 'Doxycycline 100mg x10', price: 350, icon: '💉', tag: 'POM' },
      // Cough & Cold
      { id: 111, name: 'Actifed Syrup 100ml', price: 280, icon: '🍶', tag: 'OTC' },
      { id: 112, name: 'Benylin Chesty Cough', price: 320, icon: '🍶', tag: 'OTC' },
      { id: 113, name: 'Piriton Tabs x10', price: 120, icon: '💊', tag: 'OTC' },
      { id: 114, name: 'Loratadine 10mg x10', price: 150, icon: '💊', tag: 'OTC' },
      { id: 115, name: 'Vicks VapoRub 50g', price: 280, icon: '🫙', tag: 'OTC' },
      // Stomach & Digestion
      { id: 116, name: 'Flagyl 200mg x21', price: 250, icon: '💊', tag: 'POM' },
      { id: 117, name: 'Buscopan x10', price: 180, icon: '💊', tag: 'OTC' },
      { id: 118, name: 'ORS Sachet x5', price: 100, icon: '💧', tag: 'OTC' },
      { id: 119, name: 'Antacid Tabs x10', price: 90, icon: '💊', tag: 'OTC' },
      { id: 120, name: 'Omeprazole 20mg x14', price: 320, icon: '💊', tag: 'POM' },
      // Antimalarials
      { id: 121, name: 'Coartem 80/480mg x24', price: 850, icon: '💊', tag: 'POM' },
      { id: 122, name: 'Quinine Tabs x21', price: 420, icon: '💊', tag: 'POM' },
      { id: 123, name: 'Doxycycline Malaria x28', price: 680, icon: '💊', tag: 'POM' },
      // Vitamins & Supplements
      { id: 124, name: 'Vitamin C 1000mg x30', price: 480, icon: '🍊', tag: 'OTC' },
      { id: 125, name: 'Multivitamins x30', price: 550, icon: '💊', tag: 'OTC' },
      { id: 126, name: 'Folic Acid 5mg x28', price: 120, icon: '💊', tag: 'OTC' },
      { id: 127, name: 'Iron Tabs x28', price: 180, icon: '💊', tag: 'OTC' },
      { id: 128, name: 'Calcium + D3 x30', price: 650, icon: '💊', tag: 'OTC' },
      // Skin & Topical
      { id: 129, name: 'Betamethasone Cream', price: 220, icon: '🧴', tag: 'POM' },
      { id: 130, name: 'Clotrimazole Cream', price: 280, icon: '🧴', tag: 'OTC' },
      { id: 131, name: 'Dettol Antiseptic 250ml', price: 320, icon: '🧴', tag: 'OTC' },
      { id: 132, name: 'Savlon Cream 50g', price: 180, icon: '🧴', tag: 'OTC' },
      // Medical Supplies
      { id: 133, name: 'Surgical Gloves x10', price: 250, icon: '🧤', tag: 'OTC' },
      { id: 134, name: 'Face Masks x10', price: 200, icon: '😷', tag: 'OTC' },
      { id: 135, name: 'Bandage Roll 5cm', price: 120, icon: '🩹', tag: 'OTC' },
      { id: 136, name: 'Cotton Wool 100g', price: 150, icon: '🧻', tag: 'OTC' },
      { id: 137, name: 'Thermometer Digital', price: 850, icon: '🌡️', tag: 'OTC' },
      { id: 138, name: 'Blood Pressure Monitor', price: 3800, icon: '🩺', tag: 'OTC' },
      { id: 139, name: 'Glucometer Kit', price: 3200, icon: '🩸', tag: 'OTC' },
      { id: 140, name: 'Glucometer Strips x50', price: 1800, icon: '🩸', tag: 'OTC' },
      // Eye & Ear
      { id: 141, name: 'Chloramphenicol Eye Drops', price: 280, icon: '👁️', tag: 'POM' },
      { id: 142, name: 'Otrivin Nasal Drops', price: 350, icon: '👃', tag: 'OTC' },
    ]
  },
  airbnb: {
    label: '🏠 Airbnb',
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
      { id: 210, name: 'Extra Bed', price: 1200, icon: '🛏️' },
      { id: 211, name: 'Parking Fee/Day', price: 300, icon: '🚗' },
      { id: 212, name: 'Swimming Pool Access', price: 500, icon: '🏊' },
    ]
  }
}

function App() {
  const [cart, setCart] = useState([])
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [activeCategory, setActiveCategory] = useState('shop')
  const [search, setSearch] = useState('')

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id)
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, qty: item.qty + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, qty: 1 }])
    }
  }

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const tax = Math.round(total * 0.16)
  const grand = total + tax

  const handleMpesa = async () => {
    if (!phone) return setMessage('Please enter phone number')
    if (cart.length === 0) return setMessage('Please add items to cart')
    setMessage('Sending STK Push...')
    try {
      const res = await fetch('http://localhost:3001/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount: grand })
      })
      const data = await res.json()
      if (data.ResponseCode === '0') {
        setMessage('✅ STK Push sent! Check your phone.')
        setCart([])
      } else {
        setMessage('❌ Payment failed. Try again.')
      }
    } catch (err) {
      setMessage('❌ Could not connect to server.')
    }
  }

  const products = categories[activeCategory].products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="pos">
      <div className="header">
        <div className="brand">
  <img src="/logo.png" alt="B.Bytes Logo" className="logo" />
  <h1>B.Bytes System</h1>
</div>
        <div className="cats">
          {Object.entries(categories).map(([key, val]) => (
            <button
              key={key}
              className={`cat-btn ${activeCategory === key ? 'active' : ''}`}
              onClick={() => { setActiveCategory(key); setSearch('') }}
            >
              {val.label}
            </button>
          ))}
        </div>
      </div>

      <div className="main">
        <div className="products">
          <div className="products-header">
            <h2>{categories[activeCategory].label}</h2>
            <input
              className="search"
              type="text"
              placeholder="🔍 Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {activeCategory === 'pharmacy' && (
            <div className="notice">
              ⚠️ POM = Prescription Only Medicine. Confirm valid prescription before dispensing.
            </div>
          )}
          <div className="grid">
            {products.map(p => (
              <div key={p.id} className="product-card" onClick={() => addToCart(p)}>
                <div className="icon">{p.icon}</div>
                <div className="name">{p.name}</div>
                <div className="price">KES {p.price.toLocaleString()}</div>
                {p.tag && (
                  <span className={`tag ${p.tag === 'POM' ? 'tag-pom' : 'tag-otc'}`}>
                    {p.tag}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="cart">
          <h2>Order</h2>
          {cart.length === 0 && <p className="empty">Add items to begin</p>}
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div>
                <div className="cart-name">{item.name}</div>
                <div className="cart-qty">x{item.qty}</div>
              </div>
              <div className="cart-right">
                <span>KES {(item.price * item.qty).toLocaleString()}</span>
                <button onClick={() => removeFromCart(item.id)}>×</button>
              </div>
            </div>
          ))}
          {cart.length > 0 && (
            <div className="totals">
              <div className="total-row"><span>Subtotal</span><span>KES {total.toLocaleString()}</span></div>
              <div className="total-row"><span>VAT 16%</span><span>KES {tax.toLocaleString()}</span></div>
              <div className="total-row grand"><span>Total</span><span>KES {grand.toLocaleString()}</span></div>
            </div>
          )}
          <div className="payment">
            <h3>M-Pesa Payment</h3>
            <input
              type="text"
              placeholder="e.g. 254712345678"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <button className="pay-btn" onClick={handleMpesa}>
              📱 Pay KES {grand.toLocaleString()} via M-Pesa
            </button>
            {message && <div className="message">{message}</div>}
            <div className="admin-access">
  <a href="/admin" style={{fontSize:'12px',color:'#999'}}>Admin Portal</a>
</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
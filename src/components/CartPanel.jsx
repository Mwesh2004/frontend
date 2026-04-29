export default function CartPanel({ cart, remFromCart, updQty, subtotal, discount, afterDisc, tax, grand, change, cashIn, setCashIn, selCust, setSelCust, customers, showPay, setShowPay, payMethod, setPayMethod, phone, setPhone, custEmail, setCustEmail, msg, msgType, fKES, getTier, currentUser }) {
  return (
    <div className="cart-panel">
      <div className="cart-hd">
        <h3>🛒 Cart</h3>
        <span className="cart-count">{cart.length} item(s)</span>
      </div>
      <div className="cart-items">
        {cart.length === 0
          ? <div className="empty-cart"><div style={{ fontSize: 32 }}>🛒</div><p>Your cart is empty</p><span>Tap products to add them</span></div>
          : cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="ci-info">
                <span className="ci-icon">{item.icon}</span>
                <div className="ci-name">{item.name}</div>
                <div className="ci-price">KES {item.price.toLocaleString()}</div>
              </div>
              <div className="ci-qty">
                <button onClick={() => updQty(item.id, -1)}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => updQty(item.id, 1)}>+</button>
              </div>
              <div className="ci-total">KES {(item.price * item.qty).toLocaleString()}</div>
              <button className="ci-del" onClick={() => remFromCart(item.id)}>×</button>
            </div>
          ))
        }
      </div>
      <div className="cart-summary">
        {selCust && (
          <div className="loyalty-badge" style={{ background: getTier(selCust.points).color + '18', borderColor: getTier(selCust.points).color + '40', color: getTier(selCust.points).color }}>
            ⭐ {selCust.name} — {getTier(selCust.points).name} ({getTier(selCust.points).disc}% off)
          </div>
        )}
        <div className="sum-row"><span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span></div>
        {discount > 0 && <div className="sum-row" style={{ color: 'var(--accent)' }}><span>Loyalty Discount</span><span>−KES {discount.toLocaleString()}</span></div>}
        <div className="sum-row"><span>VAT 16%</span><span>KES {tax.toLocaleString()}</span></div>
        <div className="sum-row big"><span>Total</span><span>KES {grand.toLocaleString()}</span></div>
        {payMethod === 'cash' && cashIn && (
          <div className="sum-row" style={{ color: change >= 0 ? 'var(--accent)' : 'var(--red)' }}>
            <span>Change</span><span>KES {change.toLocaleString()}</span>
          </div>
        )}
        <button className="btn-p checkout-btn" disabled={cart.length === 0} onClick={() => setShowPay(true)}>💳 Checkout — KES {grand.toLocaleString()}</button>
      </div>
    </div>
  )
}

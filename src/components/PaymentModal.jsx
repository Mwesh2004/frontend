import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

export default function PaymentModal({ showPay, setShowPay, payMethod, setPayMethod, grand, phone, setPhone, custEmail, setCustEmail, cashIn, setCashIn, change, handleMpesa, handleCash, handlePaystack, msg, msgType, PAYPAL_ID }) {
  if (!showPay) return null
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && setShowPay(false)}>
      <div className="pay-modal">
        <h3>💳 Payment</h3>
        <div className="pay-amount">KES {grand.toLocaleString()}</div>
        <div className="pay-methods">
          {['mpesa', 'cash', 'card', 'paypal'].map(m => (
            <button key={m} className={`pay-method ${payMethod === m ? 'active' : ''}`} onClick={() => setPayMethod(m)}>
              {m === 'mpesa' && '📱 M-Pesa'}{m === 'cash' && '💵 Cash'}{m === 'card' && '💳 Card'}{m === 'paypal' && '🅿️ PayPal'}
            </button>
          ))}
        </div>
        {payMethod === 'mpesa' && (
          <div className="pay-form">
            <label>Phone Number</label>
            <input placeholder="254712345678" value={phone} onChange={e => setPhone(e.target.value)} />
            <button className="btn-p" onClick={handleMpesa}>Request Payment</button>
          </div>
        )}
        {payMethod === 'cash' && (
          <div className="pay-form">
            <label>Cash Received</label>
            <input type="number" placeholder="0" value={cashIn} onChange={e => setCashIn(e.target.value)} />
            {cashIn && <div className={`pay-change ${change >= 0 ? 'pos' : 'neg'}`}>Change: KES {change.toLocaleString()}</div>}
            <button className="btn-p" onClick={handleCash}>Complete Sale</button>
          </div>
        )}
        {payMethod === 'card' && (
          <div className="pay-form">
            <label>Customer Email</label>
            <input placeholder="customer@email.com" value={custEmail} onChange={e => setCustEmail(e.target.value)} />
            <button className="btn-p" onClick={handlePaystack}>Pay with Paystack</button>
          </div>
        )}
        {payMethod === 'paypal' && (
          <div className="pay-form">
            <PayPalScriptProvider options={{ 'client-id': PAYPAL_ID, currency: 'USD' }}>
              <PayPalButtons style={{ layout: 'vertical', color: 'blue', shape: 'rect', height: 40 }}
                createOrder={(_, actions) => actions.order.create({ purchase_units: [{ amount: { value: (grand / 130).toFixed(2), currency_code: 'USD' }, description: `BerylBytes — Payment` }] })}
                onApprove={(_, actions) => actions.order.capture().then(d => completeSale('PayPal', { transactionId: d.id }))}
                onError={() => flash('PayPal failed', 'error')}
              />
            </PayPalScriptProvider>
          </div>
        )}
        {msg && <div className={`pay-msg ${msgType}`}>{msg}</div>}
        <button className="btn-g" style={{ marginTop: 10, width: '100%' }} onClick={() => setShowPay(false)}>Cancel</button>
      </div>
    </div>
  )
}

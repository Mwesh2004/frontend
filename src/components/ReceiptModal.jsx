import jsPDF from 'jspdf'

export default function ReceiptModal({ showReceipt, setShowReceipt, receiptData }) {
  if (!showReceipt || !receiptData) return null

  const generatePDF = () => {
    if (!receiptData) return
    const doc = new jsPDF(); let y = 20
    doc.setFontSize(20); doc.setFont('helvetica', 'bold'); doc.text('BERYLBYTES POS', 20, y); y += 9
    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.text('berylbytes.co.ke | berylmunyao8@gmail.com', 20, y); y += 6
    doc.line(20, y, 190, y); y += 6
    doc.text(`Invoice: ${receiptData.invoiceId}`, 20, y); doc.text(`Date: ${new Date().toLocaleString('en-KE')}`, 110, y); y += 6
    doc.text(`Customer: ${receiptData.customer || 'Walk-in'}`, 20, y); doc.text(`Method: ${receiptData.method}`, 110, y); y += 8
    doc.line(20, y, 190, y); y += 5
    doc.setFont('helvetica', 'bold'); doc.text('ITEM', 20, y); doc.text('QTY', 120, y); doc.text('UNIT', 140, y); doc.text('TOTAL', 165, y); y += 5
    doc.line(20, y, 190, y); y += 5; doc.setFont('helvetica', 'normal')
    receiptData.items.forEach(item => { doc.text(item.name.substring(0, 32), 20, y); doc.text(String(item.qty), 122, y); doc.text(`KES ${item.price.toLocaleString()}`, 135, y); doc.text(`KES ${(item.price * item.qty).toLocaleString()}`, 162, y); y += 6 })
    y += 2; doc.line(20, y, 190, y); y += 6
    const sub = receiptData.items.reduce((s, i) => s + i.price * i.qty, 0)
    doc.text('Subtotal:', 130, y); doc.text(`KES ${sub.toLocaleString()}`, 162, y); y += 6
    doc.text('VAT 16%:', 130, y); doc.text(`KES ${Math.round(sub * 0.16).toLocaleString()}`, 162, y); y += 6
    doc.setFont('helvetica', 'bold'); doc.text('TOTAL:', 130, y); doc.text(`KES ${receiptData.amount.toLocaleString()}`, 162, y); y += 6; doc.setFont('helvetica', 'normal')
    if (receiptData.change > 0) { doc.text('Change:', 130, y); doc.text(`KES ${receiptData.change.toLocaleString()}`, 162, y); y += 6 }
    y += 4; doc.line(20, y, 190, y); y += 6
    doc.setFontSize(10); doc.text('Thank you for shopping at BerylBytes!', 105, y, { align: 'center' })
    doc.save(`${receiptData.invoiceId}.pdf`)
  }

  const sub = receiptData.items.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && setShowReceipt(false)}>
      <div className="receipt-modal">
        <div className="receipt-top"><h3>🧾 BerylBytes Receipt</h3><div className="r-id">{receiptData.invoiceId}</div></div>
        <div className="receipt-meta">
          <span>📅 {new Date().toLocaleString('en-KE')}</span>
          <span>💳 {receiptData.method}</span>
          {receiptData.customer && <span>👤 {receiptData.customer}</span>}
        </div>
        <div>{receiptData.items.map(item => <div key={item.id} className="r-line"><span>{item.icon} {item.name} × {item.qty}</span><span>KES {(item.price * item.qty).toLocaleString()}</span></div>)}</div>
        <div className="r-totals">
          <div className="r-total-line"><span>Subtotal</span><span>KES {sub.toLocaleString()}</span></div>
          <div className="r-total-line"><span>VAT 16%</span><span>KES {Math.round(sub * 0.16).toLocaleString()}</span></div>
          <div className="r-total-line big"><span>Total Paid</span><span>KES {receiptData.amount.toLocaleString()}</span></div>
          {receiptData.change > 0 && <div className="r-total-line"><span>Change</span><span style={{ color: 'var(--accent)' }}>KES {receiptData.change.toLocaleString()}</span></div>}
        </div>
        <div className="receipt-thanks">Thank you for shopping at BerylBytes! 🎉</div>
        <div className="btn-row" style={{ marginTop: 16 }}>
          <button className="btn-p" style={{ flex: 1 }} onClick={generatePDF}>⬇️ Download PDF</button>
          <button className="btn-g" onClick={() => setShowReceipt(false)}>Close</button>
        </div>
      </div>
    </div>
  )
}

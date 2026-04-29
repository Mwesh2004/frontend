import { categories, NICHES } from '../data/products'

export default function POSView({ activeCat, setActiveCat, search, setSearch, niche, setNiche, cart, addToCart, visCats, allProds, products, customers, selCust, setSelCust, getTier }) {
  return (
    <>
      {activeCat === 'pharmacy' && <div className="ph-warn">⚠️ POM items require a valid prescription before dispensing.</div>}
      <div className="pg">
        {products.length === 0
          ? <div className="no-results"><div style={{ fontSize: 40 }}>🔍</div><p>No products found{search ? ` for "${search}"` : ''}</p></div>
          : products.map((p, i) => (
            <div key={p.id} className="pc" style={{ animationDelay: `${i * 0.025}s` }} onClick={() => addToCart(p)}>
              <div className="pc-shine" />
              <div className="pc-ic">{p.icon}</div>
              <div className="pc-nm">{p.name}</div>
              <div className="pc-pr">KES {p.price.toLocaleString()}</div>
              {p.tag && <span className={`pc-tag ${p.tag === 'POM' ? 'pom' : 'otc'}`}>{p.tag}</span>}
              <div className="pc-plus">＋</div>
            </div>
          ))
        }
      </div>
    </>
  )
}

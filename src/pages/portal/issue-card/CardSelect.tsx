import { useEffect } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CircleDollarSign, Edit2 } from 'lucide-react'
import { useIssueCard } from './IssueCardContext'
import { BANKS, PRODUCTS, findProduct } from './data'
import type { CardType } from './data'

export default function CardSelect() {
  const navigate = useNavigate()
  const { state, patch } = useIssueCard()

  if (!state.customerId || !state.customer) {
    return <Navigate to="/portal/issue-card" replace />
  }

  const products = state.bankId ? PRODUCTS[state.bankId] ?? [] : []
  const selectedProduct = findProduct(state.bankId, state.productId)

  function selectBank(bankId: string) {
    patch({ bankId, productId: undefined, productType: null, currency: undefined })
  }

  function selectProduct(productId: string) {
    const product = findProduct(state.bankId, productId)
    if (!product) return
    patch({ productId, productType: null, currency: product.currency })
  }

  function selectType(productType: CardType) {
    patch({ productType })
  }

  function onContinue() {
    if (!state.bankId || !state.productId || !state.productType) return
    navigate(state.productType === 'PHYSICAL'
      ? '/portal/issue-card/delivery'
      : '/portal/issue-card/review')
  }

  // Clear stale productType if product changes
  useEffect(() => {
    if (state.productId && !selectedProduct) {
      patch({ productId: undefined, productType: null, currency: undefined })
    }
  }, [state.productId, selectedProduct, patch])

  const canContinue = !!state.bankId && !!state.productId && !!state.productType

  return (
    <main className="scr-main">
      <div className="container">
        <header className="page-head">
          <div>
            <h1 className="page-title">Choose a card</h1>
            <p className="page-sub">
              Pick the issuing bank, then a product. Card type and currency depend on the product.
            </p>
          </div>
        </header>

        <div className="iss-warm-banner" style={{ marginBottom: 24 }}>
          <div className="av">{initials(state.customer.fullName)}</div>
          <div className="body">
            <div className="ttl">Issuing for <span>{state.customer.fullName}</span></div>
            <div className="mta">Customer reference <span className="mono">{state.customerId}</span></div>
          </div>
          <Link to="/portal/issue-card/customer" className="btn btn-ghost btn-sm">
            <Edit2 /> Edit
          </Link>
        </div>

        <section className="card card-pad-lg">
          <div className="form-section-head">
            <h2 className="form-section-title">Issuing bank</h2>
          </div>
          <div className="option-grid">
            {BANKS.map((b) => {
              const isSelected = state.bankId === b.id
              return (
                <label
                  key={b.id}
                  className={isSelected ? 'option-card is-selected' : 'option-card'}
                  onClick={() => selectBank(b.id)}
                >
                  <input type="radio" name="bank" value={b.id} checked={isSelected} readOnly />
                  <span className="check" />
                  <div className="option-head">
                    <div className={`option-logo ${b.code}`}>
                      {b.name.split(' ')[0].slice(0, 4).toUpperCase()}
                    </div>
                    <div>
                      <div className="option-name">{b.name}</div>
                      <div className="option-meta">{b.sub}</div>
                    </div>
                  </div>
                </label>
              )
            })}
          </div>
        </section>

        {state.bankId && (
          <section className="card card-pad-lg" style={{ marginTop: 18 }}>
            <div className="form-section-head">
              <h2 className="form-section-title">Product</h2>
              <span className="form-section-meta">Pick a product variant</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {products.map((p) => {
                const isSelected = state.productId === p.id
                return (
                  <label
                    key={p.id}
                    className={isSelected ? 'product-card is-selected' : 'product-card'}
                    onClick={() => selectProduct(p.id)}
                  >
                    <input type="radio" name="product" value={p.id} checked={isSelected} readOnly />
                    <div className={`product-chip ${p.style}`}>{p.currency}</div>
                    <div className="product-info">
                      <div className="product-name">{p.name}</div>
                      <div className="product-meta">{p.limits}</div>
                      <div className="product-fee">{p.fee}</div>
                    </div>
                    <span className="check" />
                  </label>
                )
              })}
            </div>
          </section>
        )}

        {state.productId && selectedProduct && (
          <section className="card card-pad-lg" style={{ marginTop: 18 }}>
            <div className="form-section-head">
              <h2 className="form-section-title">Card type</h2>
              <span className="form-section-meta">
                Virtual issues immediately; physical goes to bureau
              </span>
            </div>
            <div className="type-toggle">
              <TypeTile type="VIRTUAL" current={state.productType ?? null} onSelect={selectType}
                name="Virtual"
                meta="Issued immediately. PAN, expiry, CVV returned in the API response."
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                } />
              <TypeTile type="PHYSICAL" current={state.productType ?? null} onSelect={selectType}
                name="Physical"
                meta="Sent to personalization bureau. Status PERSONALIZING until card is dispatched."
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="6" y1="14" x2="10" y2="14" /><line x1="6" y1="17" x2="8" y2="17" />
                  </svg>
                } />
            </div>
            <div style={{ marginTop: 18 }}>
              <span className="currency-pill">
                <CircleDollarSign /> Currency: <span className="strong">{selectedProduct.currency}</span> · auto-derived from product
              </span>
            </div>
          </section>
        )}

        <div className="form-foot" style={{ marginTop: 24 }}>
          <Link to="/portal/issue-card/customer" className="btn btn-ghost btn-sm">
            <ArrowLeft /> Back
          </Link>
          <button className="btn btn-primary" disabled={!canContinue} onClick={onContinue}>
            Continue <ArrowRight />
          </button>
        </div>
      </div>
    </main>
  )
}

function TypeTile({ type, current, onSelect, icon, name, meta }: {
  type: CardType; current: CardType | null; onSelect: (t: CardType) => void;
  icon: React.ReactNode; name: string; meta: string;
}) {
  const isSelected = current === type
  return (
    <label
      className={isSelected ? 'type-tile is-selected' : 'type-tile'}
      onClick={() => onSelect(type)}
    >
      <input type="radio" name="type" value={type} checked={isSelected} readOnly />
      <div className="type-tile-icon">{icon}</div>
      <div className="type-tile-name">{name}</div>
      <div className="type-tile-meta">{meta}</div>
    </label>
  )
}

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

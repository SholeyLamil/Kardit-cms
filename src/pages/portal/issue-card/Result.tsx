import { Link, Navigate } from 'react-router-dom'
import {
  Check, Clock, Wallet, CircleDollarSign, User, Truck, Plus,
} from 'lucide-react'
import { useIssueCard } from './IssueCardContext'
import { findBank, findProduct } from './data'

export default function Result() {
  const { state, reset } = useIssueCard()

  if (!state.outcome || !state.customer) {
    return <Navigate to="/portal/issue-card" replace />
  }

  const o = state.outcome
  const bank = findBank(state.bankId)
  const product = findProduct(state.bankId, state.productId)
  const isVirtual = state.productType === 'VIRTUAL'

  if (!bank || !product) return <Navigate to="/portal/issue-card" replace />

  const cleanPan = o.maskedPan.replace(/\s|\*|•/g, '')
  const pan1 = cleanPan.slice(0, 4) || '••••'
  const pan4 = cleanPan.slice(-4) || '••••'
  let variantClass = ''
  if (!isVirtual) variantClass = 'physical'
  else if (/gold/i.test(product.name)) variantClass = 'gold'
  else if (/platinum/i.test(product.name)) variantClass = 'platinum'
  else if (/usd/i.test(product.name) || product.currency === 'USD') variantClass = 'usd'

  return (
    <main className="scr-main">
      <div className="container container--narrow">
        <section className="result-card">
          <div className={isVirtual ? 'result-icon' : 'result-icon personalizing'}>
            {isVirtual ? <Check /> : <Clock />}
          </div>
          <div className="result-title">
            {isVirtual ? 'Card issued' : 'Card sent for personalization'}
          </div>
          <div className="result-sub">
            {isVirtual ? (
              <>Virtual card is <strong>ACTIVE</strong> and ready for funding. Linked virtual account provisioned.</>
            ) : (
              <>Physical card is <strong>PERSONALIZING</strong>. Bureau push succeeded — typical personalization 24–48 hours.</>
            )}
          </div>

          <div className={variantClass ? `issued-card ${variantClass}` : 'issued-card'}>
            <div className="ic-header">
              <span className="ic-bank">
                {bank.name.toUpperCase()}
                <small>{product.name.toUpperCase()}</small>
              </span>
              <span className="ic-status">{o.status}</span>
            </div>
            <div className="ic-chip-row">
              <span className="ic-chip" />
              <svg className="ic-contactless" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M8 9c1.5-1.5 3.5-1.5 5 0" />
                <path d="M6 12c3-3 7-3 10 0" />
                <path d="M4 15c4-4 10-4 14 0" />
              </svg>
            </div>
            <div className="ic-pan">
              <span>{pan1}</span><span>••••</span><span>••••</span><span>{pan4}</span>
            </div>
            <div className="ic-footer">
              <div className="ic-col">
                <span className="ic-label">Cardholder</span>
                <span className="ic-value">{state.customer.fullName.toUpperCase()}</span>
              </div>
              <div className="ic-col">
                <span className="ic-label">Valid thru</span>
                <span className="ic-value">{o.expiryMonth}/{o.expiryYear}</span>
              </div>
              <div className="ic-scheme">
                <div className="ic-scheme-mark"><span className="blend" /></div>
                <span className="ic-scheme-name">Verve</span>
              </div>
            </div>
          </div>

          <div className="va-strip">
            <div className="icn-wrap"><Wallet /></div>
            <div>
              <div className="va-label">Virtual account</div>
              <div className="va-value">{o.virtualAccount.virtualAccountId}</div>
            </div>
          </div>

          <div className="next-panel">
            <div className="next-panel-title">What's next</div>
            <div className="next-panel-grid">
              {isVirtual ? (
                <>
                  <NextLink to={`/portal/funds?cardId=${encodeURIComponent(o.cardId)}`}
                    icon={<Wallet />} label="Load funds" meta="Top up VA" />
                  <NextLink to={`/portal/card/${encodeURIComponent(o.cardId)}`}
                    icon={<CircleDollarSign />} label="View balance" meta="See the card" />
                  <NextLink to={`/portal/customers/${encodeURIComponent(state.customerId!)}`}
                    icon={<User />} label="Open customer" meta={state.customerId!} />
                </>
              ) : (
                <>
                  <NextLink to="#" disabled icon={<Truck />} label="Track delivery" meta="Coming soon"
                    onClick={(e) => { e.preventDefault(); window.alert('Physical card tracking — coming later.') }} />
                  <NextLink to="#" disabled icon={<Wallet />} label="Load funds" meta="Locked until ACTIVE"
                    onClick={(e) => { e.preventDefault(); window.alert('Funding unlocks once card status is ACTIVE.') }} />
                  <NextLink to={`/portal/customers/${encodeURIComponent(state.customerId!)}`}
                    icon={<User />} label="Open customer" meta={state.customerId!} />
                </>
              )}
            </div>
          </div>

          <div className="result-actions">
            <Link to="/portal/issue-card" className="btn btn-secondary" onClick={reset}>
              <Plus /> Issue another card
            </Link>
            <Link to="/portal" className="btn btn-ghost">Back to dashboard</Link>
          </div>

          <div style={{
            marginTop: 24, fontSize: 11.5, color: 'var(--cs-ink-100)',
            textAlign: 'center', fontFamily: 'var(--font-mono)',
          }}>
            Card ID: <span>{o.cardId}</span>
          </div>
        </section>
      </div>
    </main>
  )
}

function NextLink({ to, icon, label, meta, disabled, onClick }: {
  to: string; icon: React.ReactNode; label: string; meta: string;
  disabled?: boolean; onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const cls = disabled ? 'next-link disabled' : 'next-link'
  if (disabled) {
    return (
      <a href={to} className={cls} onClick={onClick}>
        <span className="nl-icon">{icon}</span>
        <div><div className="nl-label">{label}</div><div className="nl-meta">{meta}</div></div>
      </a>
    )
  }
  return (
    <Link to={to} className={cls}>
      <span className="nl-icon">{icon}</span>
      <div><div className="nl-label">{label}</div><div className="nl-meta">{meta}</div></div>
    </Link>
  )
}

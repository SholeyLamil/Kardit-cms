import { Link, useParams, useSearchParams } from 'react-router-dom'
import {
  AlertTriangle, ArrowDownLeft, ArrowUpRight,
  Check, Database, List, PlayCircle, Sliders, Snowflake, User, Wallet, Zap,
} from 'lucide-react'
import { findCard } from './cardLookup'
import { fmtAmount, fmtMoneyPlain, fmtTime, mockBalance, mockTxns } from './data'
import { CardVisual } from './CardVisual'
import { NotFound } from './NotFound'

export default function CardDetail() {
  const { cardId } = useParams<{ cardId: string }>()
  const [params] = useSearchParams()
  const just = params.get('just')

  if (!cardId) return <NotFound cardId={null} />
  const card = findCard(cardId)
  if (!card) return <NotFound cardId={cardId} />

  const b = mockBalance(card.id)
  const isCached = (cardId.charCodeAt(cardId.length - 1) % 4) === 0
  const retrievedAt = new Date(
    Date.now() - (isCached ? 12 * 60 * 1000 : 30 * 1000),
  ).toISOString()

  const isActive = card.status === 'ACTIVE'
  const isFrozen = card.status === 'FROZEN'
  const isTerminated = card.status === 'TERMINATED'

  const txns = mockTxns(card.id)

  return (
    <main className="scr-main">
      <div className="container">
        {just === 'froze' && (
          <div className="action-toast warn">
            <span className="ico"><Snowflake /></span>
            <div className="body">
              <div className="ttl">Card frozen</div>
              <div className="mta">
                Status changed from ACTIVE → FROZEN.{' '}
                <span className="ref">CMS ref <strong>{card.cmsRef ?? '—'}</strong></span>
              </div>
            </div>
          </div>
        )}
        {just === 'unfroze' && (
          <div className="action-toast">
            <span className="ico"><Check /></span>
            <div className="body">
              <div className="ttl">Card unfrozen</div>
              <div className="mta">
                Status changed from FROZEN → ACTIVE.{' '}
                <span className="ref">CMS ref <strong>{card.cmsRef ?? '—'}</strong></span>
              </div>
            </div>
          </div>
        )}

        <header className="page-head">
          <div>
            <h1 className="page-title">Card detail</h1>
            <p className="page-sub">
              Balance, status, and lifecycle actions. Balance retrieved from CMS with cached
              fallback when CMS is unreachable.
            </p>
          </div>
          <Link to={`/portal/customers/${encodeURIComponent(card.owner.ref)}`}
                className="btn btn-ghost btn-sm">
            <User /> Open customer
          </Link>
        </header>

        <section className="card-detail-grid">
          <div>
            <CardVisual card={card} cardholderName={card.owner.fullName} />

            <div className="card-actions-grid">
              {isActive && (
                <Link to={`/portal/card/${encodeURIComponent(card.id)}/freeze`}
                      className="card-action danger">
                  <Snowflake /><span className="label">Freeze</span>
                </Link>
              )}
              {isFrozen && (
                <Link to={`/portal/card/${encodeURIComponent(card.id)}/unfreeze`}
                      className="card-action">
                  <PlayCircle /><span className="label">Unfreeze</span>
                </Link>
              )}
              <a href="#txns" className={isTerminated ? 'card-action disabled' : 'card-action'}
                 onClick={(e) => {
                   e.preventDefault()
                   if (!isTerminated) window.alert('Transactions — coming later.')
                 }}>
                <List /><span className="label">Transactions</span>
              </a>
              {isActive ? (
                <Link to={`/portal/funds?cardId=${encodeURIComponent(card.id)}`}
                      className="card-action">
                  <Wallet /><span className="label">Load funds</span>
                </Link>
              ) : (
                <a href="#load" className="card-action disabled"
                   onClick={(e) => e.preventDefault()}>
                  <Wallet /><span className="label">Load funds</span>
                </a>
              )}
              <a href="#limits" className={isTerminated ? 'card-action disabled' : 'card-action'}
                 onClick={(e) => {
                   e.preventDefault()
                   if (!isTerminated) window.alert('Limit increase — coming later.')
                 }}>
                <Sliders /><span className="label">Limits</span>
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="balance-card">
              <div className="balance-head">
                <span className="balance-label">Available balance</span>
                <span className={isCached ? 'balance-source-pill cached' : 'balance-source-pill'}>
                  {isCached ? (<><Database /> CACHED</>) : (<><Zap /> CMS · LIVE</>)}
                </span>
              </div>
              <div>
                <span className="balance-amount">
                  {b.availableBalance.toLocaleString('en-NG', {
                    minimumFractionDigits: 2, maximumFractionDigits: 2,
                  })}
                </span>
                <span className="balance-currency">{b.currency}</span>
              </div>
              <div className="balance-meta">
                <div>
                  <div className="item-label">Ledger balance</div>
                  <div className="item-value">{fmtMoneyPlain(b.ledgerBalance, b.currency)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="item-label">Retrieved at</div>
                  <div className="item-value">{fmtTime(retrievedAt)}</div>
                </div>
              </div>
              {isCached && (
                <div className="balance-stale-banner">
                  <AlertTriangle />
                  <div>
                    <strong>Cached snapshot.</strong> CMS was unreachable — value may not be
                    real-time.
                  </div>
                </div>
              )}
            </div>

            <div className="panel">
              <div className="panel-head">
                <span className="panel-title">Card details</span>
                <span className="panel-meta">Persisted in Cards service</span>
              </div>
              <div className="panel-body">
                <dl>
                  <div><dt>Card ID</dt><dd className="mono">{card.id}</dd></div>
                  <div><dt>Type</dt>
                    <dd>{card.type.charAt(0) + card.type.slice(1).toLowerCase()}</dd>
                  </div>
                  <div><dt>Product</dt><dd>{card.product}</dd></div>
                  <div><dt>Issuing bank</dt>
                    <dd>
                      {card.bank}{' '}
                      <span className="mono" style={{ color: 'var(--cs-ink-100)', fontSize: 11 }}>
                        ({card.bankCode})
                      </span>
                    </dd>
                  </div>
                  <div><dt>Created</dt><dd>{fmtTime(card.createdAt)}</dd></div>
                  {card.lastChangedAt && (
                    <div><dt>Last status change</dt><dd>{fmtTime(card.lastChangedAt)}</dd></div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section style={{ marginTop: 20 }}>
          <div className="panel" id="txns">
            <div className="panel-head" style={{
              padding: '14px 20px', display: 'flex',
              alignItems: 'center', justifyContent: 'space-between',
              borderBottom: '1px solid var(--cs-line)',
            }}>
              <span className="panel-title">Recent activity</span>
              <a href="#all" onClick={(e) => {
                e.preventDefault()
                window.alert('Full transactions list — coming later.')
              }} className="cta-link"
                 style={{ fontSize: 12, fontWeight: 700, color: 'var(--cs-green-700)' }}>
                View all →
              </a>
            </div>
            <div className="txn-snippet">
              {txns.map((t, i) => (
                <div key={i} className="txn-row">
                  <div className={`txn-icon ${t.type}`}>
                    {t.type === 'in' ? <ArrowDownLeft /> : <ArrowUpRight />}
                  </div>
                  <div className="txn-merchant">
                    <div className="txn-name">{t.merchant}</div>
                    <div className="txn-meta">{t.category}</div>
                  </div>
                  <div className={`txn-amount ${t.type}`}>{fmtAmount(t.amount, b.currency)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

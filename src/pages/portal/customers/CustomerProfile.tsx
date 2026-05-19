import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CreditCard, Edit2, List, Plus, Snowflake, Sun, UserX, Wallet } from 'lucide-react'
import {
  findCustomer, customerFullName, customerInitials,
  maskBvn, formatDate, relativeTime, idTypeLabel,
} from './data'
import type { CustomerRecord, LinkedCard, CardStatus } from './data'
import { KycBadge, StatusBadge } from './CustomersList'

export default function CustomerProfile() {
  const { ref } = useParams<{ ref: string }>()
  const c = findCustomer(ref)

  return (
    <main className="scr-main">
      <div className="container">
        <Link to="/portal/customers" className="back-link">
          <ArrowLeft /> Back to customers
        </Link>
        {c ? <Profile c={c} /> : <NotFound ref={ref} />}
      </div>
    </main>
  )
}

function Profile({ c }: { c: CustomerRecord }) {
  const fullName = customerFullName(c)
  const cardCount = c.cards.length
  const issueLink = `/portal/issue-card?customerId=${encodeURIComponent(c.ref)}`

  return (
    <>
      <section className="profile-hero">
        <div className="profile-avatar">{customerInitials(c)}</div>
        <div className="profile-meta">
          <div className="profile-name">{fullName}</div>
          <div className="profile-meta-row">
            <span className="profile-ref">{c.ref}</span>
            <StatusBadge status={c.status} />
            <KycBadge level={c.kycLevel} />
            <span>Captured {relativeTime(c.createdAt)}</span>
          </div>
        </div>
        <div className="profile-actions">
          <a href="#edit" className="btn btn-secondary btn-sm"
             onClick={(e) => {
               e.preventDefault()
               window.alert('Editing happens in the capture flow — not from this view.')
             }}>
            <Edit2 /> Edit
          </a>
          <Link to={issueLink} className="btn btn-primary">
            <CreditCard /> Issue new card
          </Link>
        </div>
      </section>

      <div className="profile-two-col">
        <div className="panel-card">
          <div className="panel-head"><div className="panel-title">Identity</div></div>
          <div className="panel-body">
            <dl className="profile-specs">
              <div><dt>Title</dt><dd>{c.title ?? '—'}</dd></div>
              <div><dt>Full name</dt><dd>{fullName}</dd></div>
              <div><dt>Date of birth</dt><dd>{formatDate(c.dob)}</dd></div>
              <div><dt>Gender</dt><dd>{c.gender ?? '—'}</dd></div>
              <div><dt>Nationality</dt><dd>{c.nationality ?? '—'}</dd></div>
              <div><dt>Mobile</dt><dd className="mono">{c.phone}</dd></div>
              {c.phoneAlt && (
                <div><dt>Alt. mobile</dt><dd className="mono">{c.phoneAlt}</dd></div>
              )}
              <div><dt>Email</dt>
                <dd>{c.email ?? <span className="muted">not provided</span>}</dd>
              </div>
              <div><dt>Address</dt>
                <dd style={{ textAlign: 'right' }}>
                  {c.street}<br />
                  {c.lga}, {c.state}, {c.country}{c.postcode && ` · ${c.postcode}`}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-head"><div className="panel-title">KYC details</div></div>
          <div className="panel-body">
            <dl className="profile-specs">
              <div><dt>KYC level</dt><dd><KycBadge level={c.kycLevel} /></dd></div>
              <div><dt>BVN</dt><dd className="mono">{maskBvn(c.bvn)}</dd></div>
              <div><dt>NIN</dt>
                <dd className="mono">
                  {c.nin ? maskBvn(c.nin) : <span className="muted">not provided</span>}
                </dd>
              </div>
              <div><dt>Secondary ID</dt>
                <dd>
                  {c.idType ? (
                    <>{idTypeLabel(c.idType)} · <span className="mono" style={{ fontSize: 11.5 }}>{c.idNumber}</span></>
                  ) : <span className="muted">not provided</span>}
                </dd>
              </div>
              <div><dt>Verified at</dt>
                <dd>{c.verifiedAt ? formatDate(c.verifiedAt) : <span className="muted">pending</span>}</dd>
              </div>
              <div><dt>Captured by</dt><dd>{c.capturedBy}</dd></div>
              <div><dt>Created</dt><dd>{formatDate(c.createdAt)}</dd></div>
            </dl>
          </div>
        </div>
      </div>

      <div className="cards-list-card">
        <div className="cards-list-head">
          <div>
            <span className="cards-list-title">Cards</span>
            <span className="cards-list-count">{cardCount} linked</span>
          </div>
          {cardCount > 0 && (
            <Link to={issueLink} className="btn btn-secondary btn-sm">
              <Plus /> Issue card
            </Link>
          )}
        </div>
        <div className="cards-list-body">
          {cardCount === 0 ? (
            <div className="cards-empty">
              No cards linked to this customer yet.{' '}
              <Link to={issueLink} className="cta-link">Issue the first card →</Link>
            </div>
          ) : (
            c.cards.map((card) => <CardRow key={card.id} card={card} />)
          )}
        </div>
      </div>
    </>
  )
}

function CardRow({ card }: { card: LinkedCard }) {
  const thumbCls = card.status === 'FROZEN'
    ? 'frozen'
    : card.type === 'PHYSICAL' ? 'physical' : ''
  return (
    <div className="card-row">
      <div className={`card-thumb ${thumbCls}`}>VERVE</div>
      <div className="card-body">
        <div className="card-head-row">
          <span className="card-id">{card.id}</span>
          <CardStatusBadge status={card.status} />
          <span className={`kyc-pill lvl-${card.type === 'VIRTUAL' ? '2' : '3'}`}>
            {card.type}
          </span>
        </div>
        <div className="card-product">{card.product} · {card.bank}</div>
        <div className="card-meta">
          <span className="card-pan">{card.maskedPan}</span> · exp {card.expiry} · {card.bankCode} · created {formatDate(card.createdAt)}
        </div>
      </div>
      <div className="card-actions">
        <Link to={`/portal/card/${encodeURIComponent(card.id)}`} className="btn btn-ghost btn-sm">
          <Wallet /> Balance
        </Link>
        <a href="#txns" className="btn btn-ghost btn-sm"
           onClick={(e) => { e.preventDefault(); window.alert('Transactions — coming later.') }}>
          <List /> Txns
        </a>
        {card.status === 'ACTIVE' && (
          <Link to={`/portal/card/${encodeURIComponent(card.id)}/freeze`} className="btn btn-ghost btn-sm">
            <Snowflake /> Freeze
          </Link>
        )}
        {card.status === 'FROZEN' && (
          <Link to={`/portal/card/${encodeURIComponent(card.id)}/unfreeze`} className="btn btn-ghost btn-sm">
            <Sun /> Unfreeze
          </Link>
        )}
      </div>
    </div>
  )
}

function CardStatusBadge({ status }: { status: CardStatus }) {
  return <span className={`badge status-${status.toLowerCase()}`}>{status}</span>
}

function NotFound({ ref }: { ref: string | undefined }) {
  return (
    <div className="empty-list" style={{
      background: 'var(--cs-white)', border: '1px solid var(--cs-line)',
      borderRadius: 'var(--cs-radius-lg)',
    }}>
      <UserX />
      <div className="empty-list-title">Customer not found</div>
      <div className="empty-list-sub">
        {ref ? (
          <>No customer in your tenant scope with reference{' '}
            <span className="mono" style={{ color: 'var(--cs-ink-700)' }}>{ref}</span>.</>
        ) : 'No customer reference was provided.'}
        <br />
        It may belong to a different tenant or have been removed — you only see customers in
        your scope.
      </div>
      <Link to="/portal/customers" className="btn btn-primary">
        <ArrowLeft /> Back to customers
      </Link>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { ArrowLeft, CreditCard } from 'lucide-react'

export function NotFound({ cardId }: { cardId: string | null }) {
  return (
    <main className="scr-main">
      <div className="container">
        <div className="empty-list" style={{ marginTop: 24 }}>
          <div className="empty-icon"><CreditCard /></div>
          <div className="empty-list-title">Card not found</div>
          <div className="empty-list-sub">
            {cardId ? (
              <>No card in your tenant scope with reference{' '}
                <span className="mono" style={{ color: 'var(--cs-ink-700)' }}>{cardId}</span>.</>
            ) : 'No card reference was provided.'}
            <br />
            You only see cards in your authorised scope.
          </div>
          <Link to="/portal/customers" className="btn btn-primary">
            <ArrowLeft /> Back to customers
          </Link>
        </div>
      </div>
    </main>
  )
}

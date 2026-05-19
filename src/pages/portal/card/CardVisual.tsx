import type { ResolvedCard } from './data'

export function CardVisual({ card, cardholderName }: {
  card: ResolvedCard
  cardholderName: string
}) {
  const statusClass = card.status === 'FROZEN'
    ? 'frozen'
    : card.status === 'TERMINATED' ? 'terminated' : ''

  let typeClass = ''
  if (card.type === 'PHYSICAL') typeClass = 'physical'
  else if (/gold/i.test(card.product)) typeClass = 'gold'
  else if (/platinum/i.test(card.product)) typeClass = 'platinum'
  else if (/usd/i.test(card.product)) typeClass = 'usd'

  const cleanPan = card.maskedPan.replace(/\s|\*|•/g, '')
  const g1 = cleanPan.slice(0, 4) || '••••'
  const g4 = cleanPan.slice(-4) || '••••'

  return (
    <div className={['card-visual', typeClass, statusClass].filter(Boolean).join(' ')}>
      <div className="cv-header">
        <span className="cv-bank">
          {card.bank.toUpperCase()}
          <small>{(card.product || 'VERVE · KARDIT').toUpperCase()}</small>
        </span>
        <span className="cv-status">{card.status}</span>
      </div>
      <div className="cv-chip-row">
        <span className="cv-chip" />
        <svg className="cv-contactless" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M8 9c1.5-1.5 3.5-1.5 5 0" />
          <path d="M6 12c3-3 7-3 10 0" />
          <path d="M4 15c4-4 10-4 14 0" />
        </svg>
      </div>
      <div className="cv-pan">
        <span>{g1}</span><span>••••</span><span>••••</span><span>{g4}</span>
      </div>
      <div className="cv-footer">
        <div className="cv-col">
          <span className="cv-label">Cardholder</span>
          <span className="cv-value">{cardholderName.toUpperCase()}</span>
        </div>
        <div className="cv-col">
          <span className="cv-label">Valid thru</span>
          <span className="cv-value">{card.expiry}</span>
        </div>
        <div className="cv-scheme">
          <div className="cv-scheme-mark"><span className="blend" /></div>
          <span className="cv-scheme-name">Verve</span>
        </div>
      </div>
    </div>
  )
}

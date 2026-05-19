import { Link } from 'react-router-dom'
import { Swoosh } from '../components/marketing/Swoosh'

export default function Industries() {
  return (
    <>
      <section className="subhero" data-swoosh>
        <Swoosh variant="subtle" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="eyebrow">Industries</span>
          <h1 className="subhero__title">Built for the way Nigeria — and West Africa — actually pays.</h1>
          <p className="subhero__lede">Eight verticals, one platform. Each industry profile ships with the schemes, integrations and reconciliation rules that operators in that sector actually need.</p>
        </div>
      </section>

      <section className="section section--tight section--white">
        <div className="container reveal">
          <div className="chips">
            <a className="chip" href="#financial">Financial Institutions</a>
            <a className="chip" href="#transport">Public Transport</a>
            <a className="chip" href="#government">Government</a>
            <a className="chip" href="#education">Education</a>
            <a className="chip" href="#health">Healthcare</a>
            <a className="chip" href="#retail">Retail</a>
            <a className="chip" href="#telecoms">Telecoms</a>
            <a className="chip" href="#hr">HR & Payroll</a>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container">
          <div className="grid-2" style={{ gap: 24 }}>
            <article className="card reveal" data-delay="1" id="financial">
              <div className="card__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18" />
                  <path d="M5 21V8l7-5 7 5v13" />
                  <path d="M9 21v-7h6v7" />
                </svg>
              </div>
              <div className="eyebrow eyebrow--muted">Banks & PSPs</div>
              <div className="card__name">Financial Institutions</div>
              <p className="card__desc">Card issuance, ATM driving, POS acquiring and switching for tier-1 banks, microfinance and payment service providers. Direct integration with the NIBSS Instant Payment rail and all major card schemes.</p>
              <ul className="dotted-list" style={{ marginTop: 8 }}>
                <li>Real-time switching, sub-200ms typical</li>
                <li>EMV, 3-D Secure, tokenization</li>
                <li>Chargeback and dispute workflow</li>
              </ul>
            </article>

            <article className="card reveal" data-delay="2" id="transport">
              <div className="card__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="7" cy="17" r="2" />
                  <circle cx="17" cy="17" r="2" />
                  <path d="M5 17H3V6a1 1 0 0 1 1-1h10v12" />
                  <path d="M14 9h4l3 4v4h-2" />
                </svg>
              </div>
              <div className="eyebrow eyebrow--muted">Cashless transit</div>
              <div className="card__name">Public Transport</div>
              <p className="card__desc">Powering MX Move — fare collection across BRT corridors, ferry terminals and intercity bus operators. Closed-loop transit cards, open-loop card acceptance, and reconciliation for operators.</p>
            </article>

            <article className="card reveal" data-delay="3" id="government">
              <div className="card__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18" />
                  <path d="M5 21V10l7-3 7 3v11" />
                  <path d="M9 21V14h6v7" />
                </svg>
              </div>
              <div className="eyebrow eyebrow--muted">Public sector</div>
              <div className="card__name">Government</div>
              <p className="card__desc">Internally-Generated Revenue (IGR) collection, treasury single-account integrations, levy collection and licensing. Audit trails meet SAS and federal reconciliation requirements.</p>
            </article>

            <article className="card reveal" data-delay="1" id="education">
              <div className="card__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2 2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                </svg>
              </div>
              <div className="eyebrow eyebrow--muted">Universities & schools</div>
              <div className="card__name">Education</div>
              <p className="card__desc">Tuition, hostels, ID cards, library fines, levies — one rail across faculties. MX Campus integrates with the most common bursar and student-information systems.</p>
            </article>

            <article className="card reveal" data-delay="2" id="health">
              <div className="card__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
                </svg>
              </div>
              <div className="eyebrow eyebrow--muted">Hospitals & HMOs</div>
              <div className="card__name">Healthcare</div>
              <p className="card__desc">HMO claims, point-of-care collection, drug levies and hospital-wide billing — wired to the schemes patients actually carry.</p>
            </article>

            <article className="card reveal" data-delay="3" id="retail">
              <div className="card__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <div className="eyebrow eyebrow--muted">Merchants</div>
              <div className="card__name">Retail</div>
              <p className="card__desc">Single-tap acceptance — card, USSD, transfer, QR — for chains, SMEs and standalone outlets. Daily settlement to your operating account.</p>
            </article>

            <article className="card reveal" data-delay="1" id="telecoms">
              <div className="card__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12a10 10 0 0 1 20 0" />
                  <path d="M5 12a7 7 0 0 1 14 0" />
                  <path d="M8.5 12a3.5 3.5 0 0 1 7 0" />
                  <circle cx="12" cy="12" r="1" />
                </svg>
              </div>
              <div className="eyebrow eyebrow--muted">Mobile operators</div>
              <div className="card__name">Telecoms</div>
              <p className="card__desc">Airtime, data and VAS billing — direct integrations with MTN, Airtel, Glo and 9mobile, plus reconciliation for partner agents.</p>
            </article>

            <article className="card reveal" data-delay="2" id="hr">
              <div className="card__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="eyebrow eyebrow--muted">Workforce payouts</div>
              <div className="card__name">HR & Payroll</div>
              <p className="card__desc">Bulk salary, contractor and benefits disbursement via Naira Plus — schedule, audit, and pay across any Nigerian bank in one batch.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--ink" data-swoosh>
        <Swoosh variant="ink" />
        <div className="container">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow eyebrow--inverse">Across all verticals</div>
              <h2 className="section-head__title">One switch. Many sectors.</h2>
            </div>
          </div>
          <div className="stats-grid">
            <div className="reveal">
              <div className="stat__num" data-count="8" data-suffix="">0</div>
              <div className="stat__lab">verticals served</div>
            </div>
            <div className="reveal" data-delay="1">
              <div className="stat__num" data-count="36" data-suffix="">0</div>
              <div className="stat__lab">states with active deployments</div>
            </div>
            <div className="reveal" data-delay="2">
              <div className="stat__num" data-count="120" data-suffix="+">0</div>
              <div className="stat__lab">institutional integrations</div>
            </div>
            <div className="reveal" data-delay="3">
              <div className="stat__num">99.95%</div>
              <div className="stat__lab">platform uptime, trailing 12 months</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container reveal">
          <div className="cta-band">
            <div>
              <h2 className="cta-band__title">Don't see your vertical?</h2>
              <p className="cta-band__lede">If your sector has a payments problem, we have probably switched something close to it. Send us the brief — we will tell you honestly whether Kardit is the right fit.</p>
            </div>
            <div className="cta-band__actions">
              <Link className="btn btn--accent" to="/contact">Tell us your use case</Link>
              <Link className="btn btn--outline-green" to="/solutions">See all solutions</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

import { Link } from 'react-router-dom'
import { Swoosh } from '../components/marketing/Swoosh'

export default function About() {
  return (
    <>
      <section className="subhero" data-swoosh>
        <Swoosh variant="subtle" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="eyebrow">About Kardit</span>
          <h1 className="subhero__title">
            A Nigerian payments switch, built for the way Africa actually moves money.
          </h1>
          <p className="subhero__lede">
            A subsidiary of Chams Holdco Plc, Kardit is a multichannel electronic payments switch —
            licensed by the Central Bank of Nigeria, listed on the Visa Global Registry, and a
            UnionPay International cross-border partner. Headquartered in Victoria Island, Lagos.
          </p>
        </div>
      </section>

      <section className="section section--white">
        <div className="container">
          <div className="grid-2 reveal" style={{ gap: 64, alignItems: 'start' }}>
            <div>
              <span className="eyebrow">Our story</span>
              <h2 className="section-head__title" style={{ marginTop: 8 }}>
                From a single switch to multichannel rails.
              </h2>
            </div>
            <div>
              <p className="cs-p" style={{ fontSize: 17, lineHeight: 1.7 }}>
                We started in 2008 with a clear question: how do you connect every Nigerian payment
                channel — ATM, POS, web, mobile, USSD, agent — to one fast, secure platform?
                Sixteen years on, the answer is a switch that processes for tier-1 banks, payment
                service providers, fintechs and the government, and that has been listed on the
                Visa Global Registry since 2022.
              </p>
              <p className="cs-p" style={{ fontSize: 17, lineHeight: 1.7, marginTop: 18 }}>
                We are not the loudest fintech in Lagos, and that is deliberate. Our customers —
                banks, ministries, hospitals, transit operators — choose us because the rails
                work, the audits pass, and the team picks up the phone.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container reveal">
          <div className="pullquote">
            We empower issuers, acquirers, fintechs and the merchants they serve with smarter,
            simpler payments solutions for their diverse lifestyle and businesses.
            <span className="pullquote__attr">— Kardit operating principle</span>
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">Milestones</div>
              <h2 className="section-head__title">Sixteen years of payments work.</h2>
            </div>
          </div>
          <div className="grid-3" style={{ gap: 24 }}>
            <Milestone year="2008" name="Founded"
              desc="Incorporated in Lagos as a subsidiary of Chams Holdco Plc, focused on multichannel electronic payments." delay={1} />
            <Milestone year="2014" name="CBN switch licence"
              desc="Licensed by the Central Bank of Nigeria as a payments switch and processor — the foundation everything else is built on." delay={2} />
            <Milestone year="2018" name="Naira.com launch"
              desc="Public launch of the Naira.com bill-payment and e-commerce platform — PCI-DSS-secured, OWASP-certified." delay={3} />
            <Milestone year="2022" name="Visa Global Registry"
              desc="Listed on the Visa Global Registry of Service Providers — independent validation of the platform's security posture." delay={1} />
            <Milestone year="2023" name="$2.5M Series raise"
              desc="Closed a $2.5M round to accelerate the cross-border switch and expand MX Suite vertical coverage." delay={2} />
            <Milestone year="2024" name="UnionPay licence"
              desc="Became a UnionPay International cross-border licensee — extending our acquiring footprint beyond West Africa."
              delay={3}
              highlight
            />
          </div>
        </div>
      </section>

      <section className="section section--paper" id="leadership">
        <div className="container">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">Leadership</div>
              <h2 className="section-head__title">A team built for the long road.</h2>
            </div>
            <p className="section-head__lede">
              Operators and engineers from Nigerian banking, fintech and the public sector. Roughly
              100 strong across Lagos, Abuja and Port Harcourt.
            </p>
          </div>
          <div className="grid-4">
            <Person initials="AO" name="Adebayo Okeowo" role="Group Managing Director" delay={1} />
            <Person initials="CN" name="Chinwe Nwosu" role="Chief Operating Officer" delay={2} />
            <Person initials="IT" name="Ibrahim Tijani" role="Chief Technology Officer" delay={3} />
            <Person initials="FA" name="Folake Adeyemi" role="Chief Financial Officer" delay={4} />
          </div>
          <p className="cs-small" style={{ marginTop: 16 }}>
            Executive lineup is illustrative for this design pass — replace with verified
            leadership data before publishing.
          </p>
        </div>
      </section>

      <section className="section section--white" id="brands">
        <div className="container">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">Our brands</div>
              <h2 className="section-head__title">A family of payment products.</h2>
            </div>
          </div>
          <div className="chips">
            {['ChamsPay','Naira.com','Naira Plus','MX Campus','MX Health','MX E-Gov','MX Move','MX Enterprise','Mail Pay','Kardit','Pelpay'].map((b) => (
              <span key={b} className="chip">{b}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--ink" data-swoosh>
        <Swoosh variant="ink" />
        <div className="container">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow eyebrow--inverse">Credibility, in numbers</div>
              <h2 className="section-head__title">Why teams pick Kardit.</h2>
            </div>
          </div>
          <div className="stats-grid">
            <div className="reveal">
              <div className="stat__num" data-count="200000" data-suffix="+" data-format="compact">0</div>
              <div className="stat__lab">businesses on the platform</div>
            </div>
            <div className="reveal" data-delay="1">
              <div className="stat__num" data-count="100" data-suffix="+">0</div>
              <div className="stat__lab">staff across Lagos, Abuja, Port Harcourt</div>
            </div>
            <div className="reveal" data-delay="2">
              <div className="stat__num">2008</div>
              <div className="stat__lab">year founded</div>
            </div>
            <div className="reveal" data-delay="3">
              <div className="stat__num">CBN</div>
              <div className="stat__lab">licensed payments switch</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container reveal">
          <div className="cta-band">
            <div>
              <h2 className="cta-band__title">Want to work with us?</h2>
              <p className="cta-band__lede">
                Whether you are integrating, partnering or hiring — we are always here for you.
                Drop us a note and a real human will respond within one working day.
              </p>
            </div>
            <div className="cta-band__actions">
              <Link className="btn btn--accent" to="/contact">Let's Talk</Link>
              <a className="btn btn--outline-green" href="#careers">View open roles</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function Milestone({ year, name, desc, delay, highlight }: {
  year: string; name: string; desc: string; delay: number; highlight?: boolean;
}) {
  return (
    <article className="card reveal" data-delay={delay}
      style={highlight ? { background: 'var(--cs-green-100)', borderColor: 'var(--cs-green-300)' } : undefined}>
      <div className="eyebrow eyebrow--muted" style={highlight ? { color: 'var(--cs-green-900)' } : undefined}>{year}</div>
      <div className="card__name">{name}</div>
      <p className="card__desc">{desc}</p>
    </article>
  )
}

function Person({ initials, name, role, delay }: { initials: string; name: string; role: string; delay: number }) {
  return (
    <div className="person reveal" data-delay={delay}>
      <div className="person__avatar">{initials}</div>
      <div className="person__name">{name}</div>
      <div className="person__role">{role}</div>
    </div>
  )
}

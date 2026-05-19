import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { useIssueCard } from './IssueCardContext'
import { genCustomerId } from './data'

export default function CustomerCapture() {
  const navigate = useNavigate()
  const { patch } = useIssueCard()
  const [saving, setSaving] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const fullName = [fd.get('firstName'), fd.get('middleName'), fd.get('lastName')]
      .filter(Boolean).join(' ')
    const customerId = genCustomerId()
    patch({
      customerId,
      customer: {
        fullName,
        phone: String(fd.get('phone') ?? ''),
        email: String(fd.get('email') ?? '') || undefined,
        state: String(fd.get('state') ?? 'Lagos'),
        bvn: String(fd.get('bvn') ?? ''),
        street: String(fd.get('street') ?? ''),
        lga: String(fd.get('lga') ?? ''),
        nin: String(fd.get('nin') ?? '') || undefined,
      },
    })
    setSaving(true)
    window.setTimeout(() => navigate('/portal/issue-card/card'), 600)
  }

  return (
    <main className="scr-main">
      <div className="container container--narrow">
        <header className="page-head">
          <div>
            <h1 className="page-title">Customer details</h1>
            <p className="page-sub">
              Identity, contact, address, KYC — same payload the issuance request embeds.
            </p>
          </div>
        </header>

        <form onSubmit={onSubmit} className="card card-pad-lg" autoComplete="off">
          <section className="form-section">
            <div className="form-section-head">
              <h2 className="form-section-title">Identity</h2>
              <span className="form-section-meta">Required</span>
            </div>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="firstName">First name<span className="req">*</span></label>
                <input id="firstName" name="firstName" type="text" required placeholder="Tunde" />
              </div>
              <div className="field">
                <label htmlFor="middleName">Middle name</label>
                <input id="middleName" name="middleName" type="text" placeholder="Akinwale" />
              </div>
              <div className="field form-row-2">
                <label htmlFor="lastName">Last name<span className="req">*</span></label>
                <input id="lastName" name="lastName" type="text" required placeholder="Bakare" />
              </div>
              <div className="field">
                <label htmlFor="dob">Date of birth<span className="req">*</span></label>
                <input id="dob" name="dob" type="date" required />
              </div>
              <div className="field">
                <span className="label">Gender<span className="req">*</span></span>
                <div className="radio-group">
                  <label className="radio-pill">
                    <input type="radio" name="gender" value="M" defaultChecked /><span className="dot" /> Male
                  </label>
                  <label className="radio-pill">
                    <input type="radio" name="gender" value="F" /><span className="dot" /> Female
                  </label>
                </div>
              </div>
            </div>
          </section>

          <section className="form-section">
            <div className="form-section-head">
              <h2 className="form-section-title">Contact</h2>
              <span className="form-section-meta">Phone required</span>
            </div>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="phone">Mobile number<span className="req">*</span></label>
                <input id="phone" name="phone" type="tel" required placeholder="+234 805 442 0098" />
                <div className="help">E.164 format preferred.</div>
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="tunde.bakare@example.com" />
              </div>
            </div>
          </section>

          <section className="form-section">
            <div className="form-section-head">
              <h2 className="form-section-title">Address</h2>
              <span className="form-section-meta">Used for delivery if physical</span>
            </div>
            <div className="form-grid">
              <div className="field form-row-full">
                <label htmlFor="street">Street address<span className="req">*</span></label>
                <input id="street" name="street" type="text" required placeholder="27 Awolowo Road, Ikoyi" />
              </div>
              <div className="field">
                <label htmlFor="lga">LGA<span className="req">*</span></label>
                <input id="lga" name="lga" type="text" required placeholder="Eti-Osa" />
              </div>
              <div className="field">
                <label htmlFor="state">State<span className="req">*</span></label>
                <select id="state" name="state" required defaultValue="Lagos">
                  <option value="Lagos">Lagos</option>
                  <option value="FCT — Abuja">FCT — Abuja</option>
                  <option value="Rivers">Rivers</option>
                  <option value="Kano">Kano</option>
                  <option value="Oyo">Oyo</option>
                </select>
              </div>
            </div>
          </section>

          <section className="form-section">
            <div className="form-section-head">
              <h2 className="form-section-title">KYC identifiers</h2>
              <span className="form-section-meta">BVN required</span>
            </div>
            <div className="form-grid">
              <div className="field is-mono">
                <label htmlFor="bvn">BVN<span className="req">*</span></label>
                <input id="bvn" name="bvn" type="text" required inputMode="numeric"
                       pattern="[0-9]{11}" maxLength={11} placeholder="22198765432" />
                <div className="help">11 digits.</div>
              </div>
              <div className="field is-mono">
                <label htmlFor="nin">NIN</label>
                <input id="nin" name="nin" type="text" inputMode="numeric"
                       pattern="[0-9]{11}" maxLength={11} placeholder="12345678901" />
              </div>
            </div>
          </section>

          <div className="form-foot">
            <Link to="/portal/issue-card" className="btn btn-ghost btn-sm">
              <ArrowLeft /> Back
            </Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (<><Loader2 className="spin" /> Saving…</>) : (<>Save & continue <ArrowRight /></>)}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

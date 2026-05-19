import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, Save, X } from 'lucide-react'
import { saveDraft, genDraftRef } from './draftStorage'

const STATES = [
  ['LA','Lagos'], ['AB','Abia'], ['AD','Adamawa'], ['AK','Akwa Ibom'],
  ['AN','Anambra'], ['BA','Bauchi'], ['BY','Bayelsa'], ['BE','Benue'],
  ['BO','Borno'], ['CR','Cross River'], ['DE','Delta'], ['EB','Ebonyi'],
  ['ED','Edo'], ['EK','Ekiti'], ['EN','Enugu'], ['FC','FCT — Abuja'],
  ['GO','Gombe'], ['IM','Imo'], ['JI','Jigawa'], ['KD','Kaduna'],
  ['KN','Kano'], ['KT','Katsina'], ['KE','Kebbi'], ['KO','Kogi'],
  ['KW','Kwara'], ['NA','Nasarawa'], ['NI','Niger'], ['OG','Ogun'],
  ['ON','Ondo'], ['OS','Osun'], ['OY','Oyo'], ['PL','Plateau'],
  ['RI','Rivers'], ['SO','Sokoto'], ['TA','Taraba'], ['YO','Yobe'],
  ['ZA','Zamfara'],
] as const

export default function NewCustomerForm() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    saveDraft({
      ref: genDraftRef(),
      customerType: (fd.get('customerType') as 'individual' | 'corporate') ?? 'individual',
      title: (fd.get('title') as string) || null,
      firstName: String(fd.get('firstName') ?? ''),
      middleName: (fd.get('middleName') as string) || null,
      lastName: String(fd.get('lastName') ?? ''),
      dob: String(fd.get('dob') ?? ''),
      gender: (fd.get('gender') as 'M' | 'F') ?? 'F',
      nationality: String(fd.get('nationality') ?? 'NG'),
      phone: String(fd.get('phone') ?? ''),
      phoneAlt: (fd.get('phoneAlt') as string) || null,
      email: (fd.get('email') as string) || null,
      street: String(fd.get('street') ?? ''),
      lga: String(fd.get('lga') ?? ''),
      state: String(fd.get('state') ?? 'LA'),
      postcode: (fd.get('postcode') as string) || null,
      country: String(fd.get('country') ?? 'NG'),
      bvn: String(fd.get('bvn') ?? ''),
      nin: (fd.get('nin') as string) || null,
      idType: (fd.get('idType') as string) || null,
      idNumber: (fd.get('idNumber') as string) || null,
      capturedBy: 'Adaeze O.',
      createdAt: new Date().toISOString(),
    })
    setSaving(true)
    window.setTimeout(() => navigate('/portal/customers/new/saved'), 700)
  }

  return (
    <main className="scr-main">
      <div className="container container--narrow">
        <header className="page-head">
          <div>
            <h1 className="page-title">New customer</h1>
            <p className="page-sub">
              Capture details for one customer. Saved as a draft — you can issue a card
              immediately afterwards or come back later.
            </p>
          </div>
        </header>

        <form onSubmit={onSubmit} className="card card-pad-lg" autoComplete="off">
          <section className="form-section">
            <div className="form-section-head">
              <h2 className="form-section-title">Identity</h2>
              <span className="form-section-meta">Required</span>
            </div>

            <div className="form-grid form-row-full" style={{ marginBottom: 18 }}>
              <div className="field form-row-full">
                <span className="label">Customer type<span className="req">*</span></span>
                <div className="radio-group">
                  <label className="radio-pill">
                    <input type="radio" name="customerType" value="individual" defaultChecked />
                    <span className="dot" /> Individual
                  </label>
                  <label className="radio-pill">
                    <input type="radio" name="customerType" value="corporate" />
                    <span className="dot" /> Corporate
                  </label>
                </div>
              </div>
            </div>

            <div className="form-grid">
              <div className="field">
                <label htmlFor="title">Title</label>
                <select id="title" name="title" defaultValue="">
                  <option value="">Select…</option>
                  <option>Mr</option><option>Mrs</option><option>Ms</option>
                  <option>Dr</option><option>Chief</option>
                </select>
              </div>
              <div className="field" />

              <div className="field">
                <label htmlFor="firstName">First name<span className="req">*</span></label>
                <input id="firstName" name="firstName" type="text" required placeholder="Adaeze" />
              </div>
              <div className="field">
                <label htmlFor="middleName">Middle name</label>
                <input id="middleName" name="middleName" type="text" placeholder="Ngozi" />
              </div>
              <div className="field form-row-2">
                <label htmlFor="lastName">Last name<span className="req">*</span></label>
                <input id="lastName" name="lastName" type="text" required placeholder="Okafor" />
              </div>

              <div className="field">
                <label htmlFor="dob">Date of birth<span className="req">*</span></label>
                <input id="dob" name="dob" type="date" required />
              </div>
              <div className="field">
                <span className="label">Gender<span className="req">*</span></span>
                <div className="radio-group">
                  <label className="radio-pill">
                    <input type="radio" name="gender" value="F" defaultChecked />
                    <span className="dot" /> Female
                  </label>
                  <label className="radio-pill">
                    <input type="radio" name="gender" value="M" />
                    <span className="dot" /> Male
                  </label>
                </div>
              </div>

              <div className="field form-row-2">
                <label htmlFor="nationality">Nationality<span className="req">*</span></label>
                <select id="nationality" name="nationality" required defaultValue="NG">
                  <option value="NG">Nigerian</option>
                  <option value="GH">Ghanaian</option>
                  <option value="KE">Kenyan</option>
                  <option value="ZA">South African</option>
                  <option value="other">Other</option>
                </select>
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
                <input id="phone" name="phone" type="tel" required
                       placeholder="+234 803 555 0142" pattern="\+?[0-9 ]+" />
                <div className="help">E.164 format preferred — leading + and country code.</div>
              </div>
              <div className="field">
                <label htmlFor="phoneAlt">Alternative number</label>
                <input id="phoneAlt" name="phoneAlt" type="tel" placeholder="+234 …" />
              </div>
              <div className="field form-row-2">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="adaeze.okafor@example.com" />
                <div className="help">Used for card statements and transaction alerts.</div>
              </div>
            </div>
          </section>

          <section className="form-section">
            <div className="form-section-head">
              <h2 className="form-section-title">Address</h2>
              <span className="form-section-meta">Street, LGA, State required</span>
            </div>
            <div className="form-grid">
              <div className="field form-row-full">
                <label htmlFor="street">Street address<span className="req">*</span></label>
                <input id="street" name="street" type="text" required
                       placeholder="14 Bourdillon Road, Ikoyi" />
              </div>
              <div className="field">
                <label htmlFor="lga">LGA (Local Government Area)<span className="req">*</span></label>
                <input id="lga" name="lga" type="text" required placeholder="Eti-Osa" />
              </div>
              <div className="field">
                <label htmlFor="state">State<span className="req">*</span></label>
                <select id="state" name="state" required defaultValue="LA">
                  <option value="">Select state…</option>
                  {STATES.map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="postcode">Postal code</label>
                <input id="postcode" name="postcode" type="text" placeholder="101233" />
              </div>
              <div className="field">
                <label htmlFor="country">Country<span className="req">*</span></label>
                <select id="country" name="country" required defaultValue="NG">
                  <option value="NG">Nigeria</option>
                  <option value="GH">Ghana</option>
                  <option value="KE">Kenya</option>
                  <option value="ZA">South Africa</option>
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
                       pattern="[0-9]{11}" maxLength={11} placeholder="22123456789" />
                <div className="help">11 digits. Bank Verification Number from any Nigerian bank.</div>
              </div>
              <div className="field is-mono">
                <label htmlFor="nin">NIN</label>
                <input id="nin" name="nin" type="text" inputMode="numeric"
                       pattern="[0-9]{11}" maxLength={11} placeholder="12345678901" />
                <div className="help">11 digits, optional — National Identification Number.</div>
              </div>
              <div className="field">
                <label htmlFor="idType">Secondary ID type</label>
                <select id="idType" name="idType" defaultValue="">
                  <option value="">None</option>
                  <option value="passport">International Passport</option>
                  <option value="drivers">Driver's License</option>
                  <option value="voters">Voter's Card</option>
                </select>
              </div>
              <div className="field is-mono">
                <label htmlFor="idNumber">Secondary ID number</label>
                <input id="idNumber" name="idNumber" type="text" placeholder="A12345678" />
              </div>
            </div>
          </section>

          <div className="form-foot">
            <div className="left">
              <Link to="/portal" className="btn btn-ghost btn-sm">
                <X /> Cancel
              </Link>
            </div>
            <div className="right">
              <button type="reset" className="btn btn-ghost">Reset</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? (<><Loader2 className="spin" /> Saving draft…</>) : (<><Save /> Save as draft</>)}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MarketingHeader } from '../components/marketing/MarketingHeader'
import { MarketingFooter } from '../components/marketing/MarketingFooter'
import { TrustStrip } from '../components/marketing/TrustStrip'
import { Swoosh } from '../components/marketing/Swoosh'
import { useSiteEffects } from '../lib/useSiteEffects'
import './SignIn.css'

export default function SignIn() {
  useSiteEffects()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitText, setSubmitText] = useState('Sign In')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Enter your email and password to continue. Both fields are required.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setError(null)
    setSubmitting(true)
    setSubmitText('Signing in…')
    window.setTimeout(() => {
      setSubmitText('Welcome back ✓')
      window.setTimeout(() => navigate('/portal'), 450)
    }, 700)
  }

  return (
    <>
      <MarketingHeader currentPage="signin" />

      <section className="subhero" data-swoosh>
        <Swoosh variant="subtle" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="eyebrow">Account</span>
          <h1 className="subhero__title">Welcome back.</h1>
          <p className="subhero__lede">
            Sign in to your Kardit dashboard to monitor transactions, manage settlements and
            configure your channels.
          </p>
        </div>
      </section>

      <section className="section section--white">
        <div className="container">
          <div className="signin-wrap reveal">
            <form className="signin-card" onSubmit={onSubmit} noValidate>
              <div className="eyebrow eyebrow--muted">Already enrolled? Log in below.</div>
              <h2 className="section-head__title" style={{ margin: '8px 0 24px', fontSize: 24 }}>
                Sign in to your account
              </h2>

              <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="field field--full">
                  <label htmlFor="s-email">Work email</label>
                  <input
                    id="s-email"
                    name="email"
                    type="email"
                    required
                    placeholder="adaeze@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="field field--full">
                  <label htmlFor="s-pwd">Password</label>
                  <div className="pwd-wrap">
                    <input
                      id="s-pwd"
                      name="password"
                      type={showPwd ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="pwd-toggle"
                      aria-label={showPwd ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPwd((s) => !s)}
                    >
                      {showPwd ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="signin-row">
                <label className="remember">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span>Keep me signed in</span>
                </label>
                <a className="forgot" href="#forgot">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="btn btn--accent signin-submit"
                disabled={submitting}
              >
                {submitText}
              </button>

              {error && (
                <div className="signin-error is-visible" role="alert" aria-live="polite">
                  {error}
                </div>
              )}
            </form>

            <div className="signin-divider">New to Kardit?</div>

            <div className="enroll-card">
              <span className="eyebrow">Become an affiliate</span>
              <h4>Don't have an account yet?</h4>
              <p>
                Walk through our 9-step affiliate onboarding to register your business, submit
                compliance documents and go live on the Kardit switch — typically reviewed within
                two working days.
              </p>
              <Link className="btn btn--outline-green" to="/partners" style={{ display: 'inline-flex' }}>
                Start enrollment{' '}
                <span style={{ marginLeft: 8 }} aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip />
      <MarketingFooter />
    </>
  )
}

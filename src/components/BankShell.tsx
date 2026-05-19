import { Link, Outlet } from 'react-router-dom'
import {
  BarChart3, Building2, CreditCard, HelpCircle, Users,
} from 'lucide-react'
import { KarditWordmark } from './Logo'

export default function BankShell() {
  return (
    <div className="scr">
      <header className="scr-app-bar">
        <Link to="/portal" className="logo-link" aria-label="Kardit home">
          <KarditWordmark />
        </Link>
        <div className="vbar" />
        <nav className="crumbs" aria-label="Breadcrumb">
          <span className="crumb-faint">Bank oversight</span>
          <strong>Portfolio</strong>
        </nav>
        <div className="spacer" />
        <a href="#help" className="help-link">
          <HelpCircle /> Help
        </a>
        <div className="user">
          <div
            className="avatar"
            style={{ background: '#FFF6DD', color: '#7A5800', borderColor: '#F2DC9E' }}
          >
            CN
          </div>
          <div className="user-meta">
            <div className="user-name">Chioma N.</div>
            <div className="user-org">
              Zenith Bank ·{' '}
              <Link to="/signin" className="signout-link">
                Sign out
              </Link>
            </div>
          </div>
        </div>
      </header>

      <aside className="scr-side" aria-label="Main navigation">
        <div className="side-section">
          <div className="side-label">Bank oversight</div>
          <nav className="side-nav">
            <a href="#portfolio" className="side-link is-active" onClick={(e) => e.preventDefault()}>
              <Building2 />
              <span>Portfolio</span>
            </a>
            <a href="#affiliates" className="side-link is-disabled" onClick={(e) => e.preventDefault()}>
              <Users />
              <span>Affiliates</span>
              <span className="side-soon">Drill-down</span>
            </a>
            <a href="#cards" className="side-link is-disabled" onClick={(e) => e.preventDefault()}>
              <CreditCard />
              <span>Cards</span>
              <span className="side-soon">Read-only</span>
            </a>
            <a href="#reports" className="side-link is-disabled" onClick={(e) => e.preventDefault()}>
              <BarChart3 />
              <span>Reports</span>
              <span className="side-soon">Soon</span>
            </a>
          </nav>
        </div>
        <div className="side-tenant">
          <div className="name">Zenith Bank</div>
          <div className="role" style={{ color: '#7A5800' }}>Issuing Bank</div>
        </div>
      </aside>

      <div className="scr-content">
        <Outlet />
      </div>
    </div>
  )
}

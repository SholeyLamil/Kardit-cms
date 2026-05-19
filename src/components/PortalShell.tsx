import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import {
  Home,
  Users,
  CreditCard,
  UploadCloud,
  Wallet,
  BarChart3,
  HelpCircle,
} from 'lucide-react'
import { KarditWordmark } from './Logo'

type Crumb = { label: string; to?: string }

const ISSUE_CARD_STEP_LABEL: Record<string, string> = {
  '': 'Start',
  customer: 'Customer',
  card: 'Card',
  delivery: 'Delivery',
  review: 'Review',
  result: 'Result',
}

function crumbsFor(pathname: string): Crumb[] {
  if (pathname === '/portal' || pathname === '/portal/') {
    return [{ label: 'Dashboard' }]
  }
  if (pathname.startsWith('/portal/issue-card')) {
    const tail = pathname.replace(/^\/portal\/issue-card\/?/, '')
    const step = ISSUE_CARD_STEP_LABEL[tail] ?? 'Start'
    return [
      { label: 'Dashboard', to: '/portal' },
      { label: 'Issue card', to: '/portal/issue-card' },
      { label: step },
    ]
  }
  if (pathname.startsWith('/portal/reports')) {
    return [{ label: 'Dashboard', to: '/portal' }, { label: 'Reports' }]
  }
  if (pathname.startsWith('/portal/batches')) {
    const tail = pathname.replace(/^\/portal\/batches\/?/, '')
    const labels: Record<string, string> = {
      welcome: 'Welcome',
      upload: 'Upload',
      validation: 'Validation',
      submit: 'Submit',
      approval: 'Approval',
      processing: 'Processing',
      result: 'Result',
    }
    if (!tail) return [{ label: 'Dashboard', to: '/portal' }, { label: 'Batches' }]
    return [
      { label: 'Dashboard', to: '/portal' },
      { label: 'Batches', to: '/portal/batches' },
      { label: labels[tail] ?? 'Batches' },
    ]
  }
  if (pathname.startsWith('/portal/funds')) {
    const tail = pathname.replace(/^\/portal\/funds\/?/, '')
    if (tail === 'review') {
      return [
        { label: 'Dashboard', to: '/portal' },
        { label: 'Load funds', to: '/portal/funds' },
        { label: 'Review' },
      ]
    }
    if (tail === 'result') {
      return [
        { label: 'Dashboard', to: '/portal' },
        { label: 'Load funds', to: '/portal/funds' },
        { label: 'Result' },
      ]
    }
    return [{ label: 'Dashboard', to: '/portal' }, { label: 'Load funds' }]
  }
  if (pathname.startsWith('/portal/card/')) {
    const m = pathname.match(/^\/portal\/card\/([^/]+)(?:\/(freeze|unfreeze))?$/)
    const cardId = m ? decodeURIComponent(m[1]) : undefined
    const action = m?.[2]
    const baseCrumbs: Crumb[] = [
      { label: 'Dashboard', to: '/portal' },
      { label: 'Customers', to: '/portal/customers' },
      { label: cardId ?? 'Card', to: cardId ? `/portal/card/${encodeURIComponent(cardId)}` : undefined },
    ]
    if (action === 'freeze') return [...baseCrumbs.slice(0, -1), { ...baseCrumbs[baseCrumbs.length - 1] }, { label: 'Freeze' }]
    if (action === 'unfreeze') return [...baseCrumbs.slice(0, -1), { ...baseCrumbs[baseCrumbs.length - 1] }, { label: 'Unfreeze' }]
    return [...baseCrumbs.slice(0, -1), { label: baseCrumbs[baseCrumbs.length - 1].label }]
  }
  if (pathname.startsWith('/portal/customers')) {
    const tail = pathname.replace(/^\/portal\/customers\/?/, '')
    if (!tail) {
      return [{ label: 'Dashboard', to: '/portal' }, { label: 'Customers' }]
    }
    if (tail === 'new') {
      return [
        { label: 'Dashboard', to: '/portal' },
        { label: 'Customers', to: '/portal/customers' },
        { label: 'New customer' },
      ]
    }
    if (tail === 'new/saved') {
      return [
        { label: 'Dashboard', to: '/portal' },
        { label: 'Customers', to: '/portal/customers' },
        { label: 'New customer', to: '/portal/customers/new' },
        { label: 'Saved' },
      ]
    }
    return [
      { label: 'Dashboard', to: '/portal' },
      { label: 'Customers', to: '/portal/customers' },
      { label: 'Profile' },
    ]
  }
  return [
    { label: 'Dashboard', to: '/portal' },
    { label: pathname.replace('/portal/', '').replace(/\//g, ' / ') },
  ]
}

export default function PortalShell() {
  const { pathname } = useLocation()
  const crumbs = crumbsFor(pathname)

  return (
    <div className="scr">
      <header className="scr-app-bar">
        <Link to="/portal" className="logo-link" aria-label="Kardit home">
          <KarditWordmark />
        </Link>
        <div className="vbar" />
        <nav className="crumbs" aria-label="Breadcrumb">
          {crumbs.map((c, i) =>
            c.to ? (
              <Link key={i} to={c.to}>
                {c.label}
              </Link>
            ) : (
              <strong key={i}>{c.label}</strong>
            ),
          )}
        </nav>
        <div className="spacer" />
        <a href="#help" className="help-link">
          <HelpCircle /> Help
        </a>
        <div className="user">
          <div className="avatar">AO</div>
          <div className="user-meta">
            <div className="user-name">Adaeze O.</div>
            <div className="user-org">
              <Link to="/signin" className="signout-link">
                Sign out
              </Link>
            </div>
          </div>
        </div>
      </header>

      <aside className="scr-side" aria-label="Main navigation">
        <div className="side-section">
          <div className="side-label">Operations</div>
          <nav className="side-nav">
            <NavLink to="/portal" end className={navClass}>
              <Home />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/portal/customers" className={navClass}>
              <Users />
              <span>Customers</span>
            </NavLink>
            <NavLink to="/portal/issue-card" className={navClass}>
              <CreditCard />
              <span>Cards</span>
            </NavLink>
            <NavLink to="/portal/batches" className={navClass}>
              <UploadCloud />
              <span>Batches</span>
            </NavLink>
            <NavLink to="/portal/funds" className={navClass}>
              <Wallet />
              <span>Funds</span>
            </NavLink>
            <NavLink to="/portal/reports" className={navClass}>
              <BarChart3 />
              <span>Reports</span>
            </NavLink>
          </nav>
        </div>
        <div className="side-tenant">
          <div className="name">Kardit Lagos</div>
          <div className="role">Affiliate</div>
        </div>
      </aside>

      <div className="scr-content">
        <Outlet />
      </div>
    </div>
  )
}

function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? 'side-link is-active' : 'side-link'
}

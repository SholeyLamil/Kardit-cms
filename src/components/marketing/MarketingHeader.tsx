import { Link } from 'react-router-dom'
import { KarditWordmark } from '../Logo'

export function MarketingHeader({ currentPage }: { currentPage?: string }) {
  return (
    <header className="site-header" role="banner">
      <div className="site-header__inner">
        <Link className="site-header__logo" to="/" aria-label="Kardit home">
          <KarditWordmark />
        </Link>
        <div className="site-header__cta">
          <Link className="signin" to="/signin" aria-current={currentPage === 'signin' ? 'page' : undefined}>
            Sign in
          </Link>
          <Link className="btn btn--accent btn--small" to="/contact">
            Let's Talk
          </Link>
        </div>
      </div>
    </header>
  )
}

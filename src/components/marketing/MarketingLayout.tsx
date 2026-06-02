import { Outlet, useLocation } from 'react-router-dom'
import { MarketingHeader } from './MarketingHeader'
import { MarketingFooter } from './MarketingFooter'
import { useSiteEffects } from '../../lib/useSiteEffects'

export default function MarketingLayout() {
  const location = useLocation()
  useSiteEffects()

  return (
    <>
      {location.pathname !== '/' && <MarketingHeader />}
      <Outlet />
      <MarketingFooter />
    </>
  )
}

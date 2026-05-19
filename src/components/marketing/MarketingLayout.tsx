import { Outlet } from 'react-router-dom'
import { MarketingHeader } from './MarketingHeader'
import { MarketingFooter } from './MarketingFooter'
import { useSiteEffects } from '../../lib/useSiteEffects'

export default function MarketingLayout() {
  useSiteEffects()
  return (
    <>
      <MarketingHeader />
      <Outlet />
      <MarketingFooter />
    </>
  )
}

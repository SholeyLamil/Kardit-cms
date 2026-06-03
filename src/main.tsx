import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './styles/tokens.css'
import './styles/site.css'
import './styles/portal.css'
import './styles/issue-card.css'
import './styles/customers.css'
import './styles/card.css'
import './styles/load-funds.css'
import './styles/reports.css'
import './styles/bank.css'
import './styles/batches.css'
import './styles/onboarding.css'
import './styles/app.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)

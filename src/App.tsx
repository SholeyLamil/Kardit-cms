import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MarketingLayout from './components/marketing/MarketingLayout'
import { OnboardingProvider } from './pages/onboarding/OnboardingContext'

// Marketing
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Solutions = lazy(() => import('./pages/Solutions'))
const Industries = lazy(() => import('./pages/Industries'))
const Partners = lazy(() => import('./pages/Partners'))
const Contact = lazy(() => import('./pages/Contact'))
const SignIn = lazy(() => import('./pages/SignIn'))

// Portal shells
const PortalShell = lazy(() => import('./components/PortalShell'))
const BankShell = lazy(() => import('./components/BankShell'))
const Dashboard = lazy(() => import('./pages/portal/Dashboard'))

// Issue card journey
const IssueCardLayout = lazy(() => import('./pages/portal/issue-card/IssueCardLayout'))
const IssueCardStart = lazy(() => import('./pages/portal/issue-card/Start'))
const IssueCardCustomer = lazy(() => import('./pages/portal/issue-card/CustomerCapture'))
const IssueCardSelect = lazy(() => import('./pages/portal/issue-card/CardSelect'))
const IssueCardDelivery = lazy(() => import('./pages/portal/issue-card/Delivery'))
const IssueCardReview = lazy(() => import('./pages/portal/issue-card/Review'))
const IssueCardResult = lazy(() => import('./pages/portal/issue-card/Result'))

// Customers
const CustomersList = lazy(() => import('./pages/portal/customers/CustomersList'))
const CustomerProfile = lazy(() => import('./pages/portal/customers/CustomerProfile'))
const NewCustomerLayout = lazy(() => import('./pages/portal/customers/NewCustomerLayout'))
const NewCustomerForm = lazy(() => import('./pages/portal/customers/NewCustomerForm'))
const CustomerSaved = lazy(() => import('./pages/portal/customers/CustomerSaved'))

// Card servicing
const CardDetail = lazy(() => import('./pages/portal/card/CardDetail'))
const FreezeConfirm = lazy(() => import('./pages/portal/card/FreezeConfirm'))
const UnfreezeConfirm = lazy(() => import('./pages/portal/card/UnfreezeConfirm'))

// Load funds
const LoadFundsLayout = lazy(() => import('./pages/portal/load-funds/LoadFundsLayout'))
const LoadForm = lazy(() => import('./pages/portal/load-funds/LoadForm'))
const LoadReview = lazy(() => import('./pages/portal/load-funds/LoadReview'))
const LoadResult = lazy(() => import('./pages/portal/load-funds/LoadResult'))

// Reports + Bank
const Reports = lazy(() => import('./pages/portal/reports/Reports'))
const BankPortfolio = lazy(() => import('./pages/portal/bank/BankPortfolio'))

// Batches
const BatchesLayout = lazy(() => import('./pages/portal/batches/BatchesLayout'))
const BatchesWelcome = lazy(() => import('./pages/portal/batches/BatchesWelcome'))
const BatchesDashboard = lazy(() => import('./pages/portal/batches/BatchesDashboard'))
const BatchesUpload = lazy(() => import('./pages/portal/batches/BatchesUpload'))
const BatchesValidation = lazy(() => import('./pages/portal/batches/BatchesValidation'))
const BatchesSubmit = lazy(() => import('./pages/portal/batches/BatchesSubmit'))
const BatchesApproval = lazy(() => import('./pages/portal/batches/BatchesApproval'))
const BatchesProcessing = lazy(() => import('./pages/portal/batches/BatchesProcessing'))
const BatchesResult = lazy(() => import('./pages/portal/batches/BatchesResult'))

// Onboarding
const OnboardingShell = lazy(() => import('./pages/onboarding/OnboardingShell'))
const OnbStart = lazy(() => import('./pages/onboarding/Start'))
const OnbOrg = lazy(() => import('./pages/onboarding/Org'))
const OnbDocs = lazy(() => import('./pages/onboarding/Docs'))
const OnbBanks = lazy(() => import('./pages/onboarding/Banks'))
const OnbReview = lazy(() => import('./pages/onboarding/Review'))
const OnbSubmitted = lazy(() => import('./pages/onboarding/Submitted'))
const OnbErrors = lazy(() => import('./pages/onboarding/Errors'))
const OnbStatus = lazy(() => import('./pages/onboarding/Status'))
const OnbRespond = lazy(() => import('./pages/onboarding/Respond'))

function RouteFallback() {
  return (
    <div
      aria-busy="true"
      style={{
        minHeight: '60vh',
        display: 'grid',
        placeItems: 'center',
        color: 'var(--cs-ink-100)',
        fontSize: 13,
      }}
    />
  )
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<MarketingLayout />}>
          <Route path="/about" element={<About />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/onboarding"
          element={
            <OnboardingProvider>
              <OnboardingShell />
            </OnboardingProvider>
          }
        >
          <Route index element={<OnbStart />} />
          <Route path="org" element={<OnbOrg />} />
          <Route path="docs" element={<OnbDocs />} />
          <Route path="banks" element={<OnbBanks />} />
          <Route path="review" element={<OnbReview />} />
          <Route path="submitted" element={<OnbSubmitted />} />
          <Route path="errors" element={<OnbErrors />} />
          <Route path="status" element={<OnbStatus />} />
          <Route path="respond" element={<OnbRespond />} />
        </Route>
        <Route path="/portal/bank" element={<BankShell />}>
          <Route index element={<BankPortfolio />} />
        </Route>
        <Route path="/portal" element={<PortalShell />}>
          <Route index element={<Dashboard />} />
          <Route path="customers">
            <Route index element={<CustomersList />} />
            <Route path="new" element={<NewCustomerLayout />}>
              <Route index element={<NewCustomerForm />} />
              <Route path="saved" element={<CustomerSaved />} />
            </Route>
            <Route path=":ref" element={<CustomerProfile />} />
          </Route>
          <Route path="card/:cardId">
            <Route index element={<CardDetail />} />
            <Route path="freeze" element={<FreezeConfirm />} />
            <Route path="unfreeze" element={<UnfreezeConfirm />} />
          </Route>
          <Route path="funds" element={<LoadFundsLayout />}>
            <Route index element={<LoadForm />} />
            <Route path="review" element={<LoadReview />} />
            <Route path="result" element={<LoadResult />} />
          </Route>
          <Route path="reports" element={<Reports />} />
          <Route path="batches" element={<BatchesLayout />}>
            <Route index element={<BatchesDashboard />} />
            <Route path="welcome" element={<BatchesWelcome />} />
            <Route path="upload" element={<BatchesUpload />} />
            <Route path="validation" element={<BatchesValidation />} />
            <Route path="submit" element={<BatchesSubmit />} />
            <Route path="approval" element={<BatchesApproval />} />
            <Route path="processing" element={<BatchesProcessing />} />
            <Route path="result" element={<ResultLazyAlias />} />
          </Route>
          <Route path="issue-card" element={<IssueCardLayout />}>
            <Route index element={<IssueCardStart />} />
            <Route path="customer" element={<IssueCardCustomer />} />
            <Route path="card" element={<IssueCardSelect />} />
            <Route path="delivery" element={<IssueCardDelivery />} />
            <Route path="review" element={<IssueCardReview />} />
            <Route path="result" element={<IssueCardResult />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

// Aliases to disambiguate names that collide visually (BatchesResult vs IssueCardResult)
function ResultLazyAlias() {
  return <BatchesResult />
}

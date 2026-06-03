# Kardit Website Sitemap

## Marketing/Public Pages
```
/ (Home)
├── /about (About)
├── /solutions (Solutions)
├── /industries (Industries)
├── /partners (Partners)
└── /contact (Contact)
```

### Logic
- **Home page** (`/`): Rendered standalone without `MarketingLayout` wrapper
- **Other marketing pages**: All wrapped with `MarketingLayout` component which:
  - Conditionally displays `MarketingHeader` (hidden on home page)
  - Always displays `MarketingFooter`
  - Uses `useSiteEffects` hook for page-level effects
- **Code splitting**: All pages use React `lazy()` with `Suspense` for performance optimization
- **Outlet pattern**: Marketing pages are rendered via `<Outlet />` from `MarketingLayout`

## Authentication
```
/signin (Sign In)
```

### Logic
- **Standalone route**: Not wrapped in any layout component
- **Direct navigation**: Users navigate here before accessing protected portals
- **No context providers**: Simple authentication page without state management

## Onboarding Flow
```
/onboarding/
├── / (Start)
├── /org (Organization)
├── /docs (Documents)
├── /banks (Banks)
├── /review (Review)
├── /submitted (Submitted)
├── /errors (Errors)
├── /status (Status)
└── /respond (Respond)
```

### Logic
- **Context Provider Wrapper**: All onboarding routes wrapped with `OnboardingProvider` to manage shared state
- **Stateful Flow**: Uses context to persist data across multi-step workflow
- **Shell Pattern**: `OnboardingShell` component provides consistent layout for all onboarding pages
- **Index route**: Default index route shows `OnbStart` component
- **Nested routing**: All sub-routes are children of `/onboarding` path
- **Sequential workflow**: Each step is a discrete page, allowing progress tracking and validation

## Portal Application

### Bank Portal
```
/portal/bank/
└── / (Bank Portfolio)
```

#### Logic
- **Separate Shell**: Uses `BankShell` component instead of main `PortalShell`
- **Bank-specific UI**: Independent UI layout for bank users vs regular portal users
- **Isolated Navigation**: Bank portal has its own navigation context
- **Single route**: Simple structure with only portfolio dashboard

### Main Portal
```
/portal/
├── / (Dashboard)
├── /customers (Customers Management)
│   ├── / (Customers List)
│   ├── /new (New Customer)
│   │   ├── / (New Customer Form)
│   │   └── /saved (Customer Saved)
│   └── /:ref (Customer Profile - Dynamic)
├── /card/:cardId (Card Services - Dynamic)
│   ├── / (Card Detail)
│   ├── /freeze (Freeze Confirmation)
│   └── /unfreeze (Unfreeze Confirmation)
├── /funds (Load Funds)
│   ├── / (Load Form)
│   ├── /review (Load Review)
│   └── /result (Load Result)
├── /reports (Reports)
├── /batches (Batch Processing)
│   ├── / (Batches Dashboard)
│   ├── /welcome (Batches Welcome)
│   ├── /upload (Batches Upload)
│   ├── /validation (Batches Validation)
│   ├── /submit (Batches Submit)
│   ├── /approval (Batches Approval)
│   ├── /processing (Batches Processing)
│   └── /result (Batches Result)
└── /issue-card (Issue Card Journey)
    ├── / (Issue Card Start)
    ├── /customer (Customer Capture)
    ├── /card (Card Select)
    ├── /delivery (Delivery)
    ├── /review (Review)
    └── /result (Result)
```

#### Portal Shell Logic
- **Main Wrapper**: `PortalShell` provides:
  - Left sidebar navigation with feature icons
  - Breadcrumb generation based on current route
  - Portal-wide styling and layout
  - Dynamic breadcrumb labels for multi-step flows

#### Customers Sub-section Logic
- **Nested Layout**: `NewCustomerLayout` wraps the customer creation workflow
- **Multiple steps**: Form → Saved confirmation
- **Dynamic routing**: `:ref` parameter stores customer reference ID
- **List view**: `/customers` shows all existing customers

#### Card Servicing Logic
- **Dynamic card ID**: `:cardId` parameter identifies specific card
- **Confirmation flows**: Separate pages for freeze/unfreeze actions
- **Card-specific detail**: `/card/:cardId` shows card information

#### Load Funds Logic
- **Multi-step workflow**: Form → Review → Result
- **Layout wrapper**: `LoadFundsLayout` maintains state across steps
- **Linear flow**: Users progress through defined steps

#### Reports
- **Standalone feature**: Simple route with no nested sub-pages
- **Dashboard access**: Available from main portal navigation

#### Batches Processing Logic
- **Complex workflow**: 8-step batch lifecycle
- **Layout wrapper**: `BatchesLayout` manages batch processing state
- **Step progression**:
  1. Dashboard - Overview
  2. Welcome - Introduction
  3. Upload - File selection
  4. Validation - Data validation
  5. Submit - Confirmation
  6. Approval - Awaiting approval
  7. Processing - Background processing
  8. Result - Completion status
- **Route aliasing**: `ResultLazyAlias()` prevents name collision between `BatchesResult` and `IssueCardResult`

#### Issue Card Logic
- **6-step journey**: Multi-step card issuance workflow
- **Layout wrapper**: `IssueCardLayout` provides context and styling
- **Breadcrumb tracking**: Dynamic breadcrumb labels via `ISSUE_CARD_STEP_LABEL` map
- **Step progression**:
  1. Start - Journey initiation
  2. Customer - Capture customer details
  3. Card - Select card type
  4. Delivery - Set delivery preferences
  5. Review - Confirm before submission
  6. Result - Issuance confirmation

## Route Summary

| Category | Count | Description |
|----------|-------|-------------|
| Public Pages | 5 | Marketing and informational pages |
| Authentication | 1 | Sign-in page |
| Onboarding | 9 | Multi-step onboarding workflow |
| Portal - Bank | 1 | Bank portfolio management |
| Portal - Core | 20+ | Main application features |
| **Total** | **35+** | Unique routes |

## Global Routing Architecture

### Performance Optimization
- **Code Splitting**: All page components use `React.lazy()` for dynamic imports
- **Suspense Fallback**: `RouteFallback` component displays loading state with spinner
- **Memory efficiency**: Components loaded only when their routes are accessed

### Error Handling
- **Catch-all route**: `<Route path="*" element={<Navigate to="/" replace />} />`
- **Fallback behavior**: Any unmatched routes redirect to home page
- **Replace navigation**: Uses `replace` to prevent back button issues

### Layout Hierarchy
```
App (Route handler)
├── Home (standalone)
├── MarketingLayout (wraps marketing pages)
│   ├── MarketingHeader (conditional, not on home)
│   ├── [Marketing Pages via Outlet]
│   └── MarketingFooter
├── SignIn (standalone)
├── OnboardingProvider (context wrapper)
│   └── OnboardingShell (layout component)
│       └── [Onboarding pages via Outlet]
├── BankShell (separate portal shell)
│   └── [Bank pages via Outlet]
└── PortalShell (main portal layout)
    ├── Sidebar Navigation
    ├── Breadcrumb Navigation
    └── [Portal pages via Outlet]
```

### Context Providers
- **OnboardingProvider**: Manages onboarding workflow state and data persistence
- **PortalShell**: Manages portal-level navigation state and breadcrumbs
- **BankShell**: Separate context for bank-specific functionality

## Routing Patterns

### URL Parameters (Dynamic Segments)
| Pattern | Usage | Example | Component |
|---------|-------|---------|-----------|
| `:ref` | Customer reference ID | `/portal/customers/CUST123` | CustomerProfile |
| `:cardId` | Card identifier | `/portal/card/CARD456` | CardDetail |

### Breadcrumb Generation Logic
- **Batches flow**: Maps batch step names to breadcrumb labels via object lookup
  ```javascript
  const labels = {
    welcome: 'Welcome',
    upload: 'Upload',
    validation: 'Validation',
    // ... etc
  }
  ```
- **Issue Card flow**: Maps issue card steps using `ISSUE_CARD_STEP_LABEL` constant
- **Reports/Dashboard**: Simplified breadcrumbs without step tracking
- **Format**: Dashboard → Feature → Current Step

### Multi-step Workflow Patterns

#### Layout Wrappers
- **Purpose**: Maintain shared state and navigation context across multiple pages
- **Examples**: 
  - `BatchesLayout` - Holds batch file data and progress state
  - `LoadFundsLayout` - Maintains fund load transaction data
  - `NewCustomerLayout` - Preserves customer form data
  - `IssueCardLayout` - Tracks card issuance progress

#### Navigation Flow
1. **Entry page**: Landing page of feature (index route)
2. **Sub-pages**: Numbered routes accessed sequentially
3. **Completion**: Final result page confirms action
4. **Back navigation**: Breadcrumbs allow returning to previous states

### Code Organization
- **Components**: Layout components stored in `src/components/`
- **Pages**: Page components organized by feature in `src/pages/`
  - `portal/` - All portal features
  - `onboarding/` - Onboarding workflow
  - Top-level - Marketing pages
- **Lazy loading**: All page imports wrapped in `lazy()`
- **Folder structure**: Matches route structure for easy file discovery

## Portal Features

### Customer Management
- View all customers
- Create new customers
- View customer profiles with reference ID

### Card Servicing
- View card details
- Freeze/Unfreeze cards
- Dynamic routing based on card ID

### Load Funds
- Submit fund load requests
- Review before submission
- View transaction results

### Batch Processing
- Upload batch files
- Validate batch data
- Submit batches for approval
- Track batch approval status
- Monitor batch processing
- View batch results

### Issue Card
- Start new issue card journey
- Capture customer information
- Select card for issuance
- Set delivery preferences
- Review before submission
- View issuance results

### Reporting
- Access various reports

## Route Architecture

- **Marketing Layout**: Wraps public pages with navigation and footer
- **Portal Shell**: Main authenticated portal with sidebar navigation
- **Bank Shell**: Separate shell for bank-specific portal
- **Onboarding Shell**: Dedicated onboarding workflow with context provider

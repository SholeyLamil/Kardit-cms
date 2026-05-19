# Kardit → React port log

Tracks which screens from the original `kardit-merged/` HTML prototype have been
ported into this React app. Updated as new screens land.

> For the **SRS module map** (UJR / FR / SCR / API codes, working integrations,
> pending stubs), see [MODULES.md](MODULES.md). SRS codes were removed from the
> user-facing UI on 2026-05-18 and now live in that doc.

Stack: Vite + React 18 + TypeScript + React Router + lucide-react.
Dev server: `npm run dev` → http://localhost:5173

## Infrastructure

| Piece | File |
|---|---|
| Brand tokens | [src/styles/tokens.css](src/styles/tokens.css) |
| Marketing site CSS | [src/styles/site.css](src/styles/site.css) |
| Portal shell CSS | [src/styles/portal.css](src/styles/portal.css) |
| Issue-card CSS | [src/styles/issue-card.css](src/styles/issue-card.css) |
| Site interactions hook (sticky header, reveal, swoosh, parallax, counters) | [src/lib/useSiteEffects.ts](src/lib/useSiteEffects.ts) |
| Marketing layout (header + footer + outlet + effects) | [src/components/marketing/MarketingLayout.tsx](src/components/marketing/MarketingLayout.tsx) |
| Marketing header / footer / trust strip / swoosh | [src/components/marketing/](src/components/marketing/) |
| Portal shell (AppBar + Sidebar + breadcrumbs) | [src/components/PortalShell.tsx](src/components/PortalShell.tsx) |
| Kardit wordmark | [src/components/Logo.tsx](src/components/Logo.tsx) |
| Routes | [src/App.tsx](src/App.tsx) |

## Marketing pages

| Source | Route | React file | Status |
|---|---|---|---|
| `index.html` | `/` | [Home.tsx](src/pages/Home.tsx) | ✅ |
| `about.html` | `/about` | [About.tsx](src/pages/About.tsx) | ✅ |
| `solutions.html` | `/solutions` | [Solutions.tsx](src/pages/Solutions.tsx) | ✅ |
| `industries.html` | `/industries` | [Industries.tsx](src/pages/Industries.tsx) | ✅ |
| `partners.html` | `/partners` | [Partners.tsx](src/pages/Partners.tsx) | ⚠️ Wizard placeholder |
| `contact.html` | `/contact` | [Contact.tsx](src/pages/Contact.tsx) | ✅ |
| `kardit-website.html` | `/kardit` | [KarditWebsite.tsx](src/pages/KarditWebsite.tsx) | ⚠️ Variant header collapsed |
| `kardit-website-2.html` | `/kardit-v2` | [KarditWebsite2.tsx](src/pages/KarditWebsite2.tsx) | ⚠️ Variant header collapsed |
| `kardit-website-3.html` | `/kardit-v3` | [KarditWebsite3.tsx](src/pages/KarditWebsite3.tsx) | ⚠️ Variant header collapsed |
| `chamsswitch-website.html` | `/chamsswitch` | [ChamsSwitchWebsite.tsx](src/pages/ChamsSwitchWebsite.tsx) | ✅ |
| `signin.html` | `/signin` | [SignIn.tsx](src/pages/SignIn.tsx) | ✅ |

## Portal

| Source | Route | React file | Status |
|---|---|---|---|
| `portal/index.html` | `/portal` | [Dashboard.tsx](src/pages/portal/Dashboard.tsx) | ✅ |

### UJR005 + UJR007 — Customers (`portal/customers/`)

| Source | Route | React file | Status |
|---|---|---|---|
| `index.html` | `/portal/customers` | [CustomersList.tsx](src/pages/portal/customers/CustomersList.tsx) | ✅ UJR007 search with KYC + status filters |
| `profile.html?ref=…` | `/portal/customers/:ref` | [CustomerProfile.tsx](src/pages/portal/customers/CustomerProfile.tsx) | ✅ UJR007 profile + linked cards |
| `01-form.html` | `/portal/customers/new` | [NewCustomerForm.tsx](src/pages/portal/customers/NewCustomerForm.tsx) | ✅ UJR005 capture form |
| `02-saved.html` | `/portal/customers/new/saved` | [CustomerSaved.tsx](src/pages/portal/customers/CustomerSaved.tsx) | ✅ UJR005 draft confirmation |

Mock customer data + helpers in [data.ts](src/pages/portal/customers/data.ts). Form → saved bridge uses [draftStorage.ts](src/pages/portal/customers/draftStorage.ts) (sessionStorage, `kardit_customer_draft_v1`). Card-row actions on the profile (Balance, Txns, Freeze, Unfreeze) show alerts pointing at the not-yet-ported UJR009/010/015/018.

### UJR012 — Load funds (`portal/load-funds/`)

| Source | Route | React file | Status |
|---|---|---|---|
| `01-form.html` | `/portal/funds` | [LoadForm.tsx](src/pages/portal/load-funds/LoadForm.tsx) | ✅ Cold-start card picker + warm-start via `?cardId=…` + amount/funding-reference/reference form |
| `02-review.html` | `/portal/funds/review` | [LoadReview.tsx](src/pages/portal/load-funds/LoadReview.tsx) | ✅ Maker-checker banner, idempotency key, "Submit for approval" |
| `03-result.html` | `/portal/funds/result` | [LoadResult.tsx](src/pages/portal/load-funds/LoadResult.tsx) | ✅ Approval simulated by "Folake A.", audit trail, CMS ref |

Shared state via [LoadFundsContext.tsx](src/pages/portal/load-funds/LoadFundsContext.tsx) + sessionStorage (`kardit_load_state_v1`). Mock card pool, proof types, quick amounts, and ID generators in [data.ts](src/pages/portal/load-funds/data.ts).

### UJR006 — Batch issuance (`portal/batches/`)

| Source | Route | React file | Status |
|---|---|---|---|
| `00-welcome.html` | `/portal/batches/welcome` | [BatchesWelcome.tsx](src/pages/portal/batches/BatchesWelcome.tsx) | ✅ Journey landing with currently-pill + resume banner + big stepper |
| `01-dashboard.html` | `/portal/batches` | [BatchesDashboard.tsx](src/pages/portal/batches/BatchesDashboard.tsx) | ✅ KPI tiles + recent jobs table (7 rows) |
| `02-upload.html` | `/portal/batches/upload` | [BatchesUpload.tsx](src/pages/portal/batches/BatchesUpload.tsx) | ✅ Dropzone + product picker; "Upload & validate" stays disabled until a file is chosen |
| `03-validation.html` | `/portal/batches/validation` | [BatchesValidation.tsx](src/pages/portal/batches/BatchesValidation.tsx) | ✅ Summary KPIs + 8 invalid-row table |
| `04-submit.html` | `/portal/batches/submit` | [BatchesSubmit.tsx](src/pages/portal/batches/BatchesSubmit.tsx) | ✅ Maker-checker summary + warning notice + checker note |
| `05-approval.html` | `/portal/batches/approval` | [BatchesApproval.tsx](src/pages/portal/batches/BatchesApproval.tsx) | ✅ Queue list + selectable detail panel; Approve → processing |
| `06-processing.html` | `/portal/batches/processing` | [BatchesProcessing.tsx](src/pages/portal/batches/BatchesProcessing.tsx) | ✅ Live progress bar (interval-driven), KPIs, recent-activity table |
| `07-result.html` | `/portal/batches/result` | [BatchesResult.tsx](src/pages/portal/batches/BatchesResult.tsx) | ✅ Result KPIs, failure-cluster breakdown, created-records table |

Horizontal stepper lives in [BatchesLayout.tsx](src/pages/portal/batches/BatchesLayout.tsx) (Outlet wrapper, derives active step from pathname). Seed data + types in [data.ts](src/pages/portal/batches/data.ts). The Dashboard "Batch issuance" action card now links straight in, and the Recent activity "Batch BATCH-2026-00018 completed" row links to the result screen.

### UJR023 — Bank portfolio (`portal/bank/`)

| Source | Route | React file | Status |
|---|---|---|---|
| `index.html` | `/portal/bank` | [BankPortfolio.tsx](src/pages/portal/bank/BankPortfolio.tsx) | ✅ Bank actor view — persona banner, bank hero, KPI tiles, affiliates table |

Different actor than the rest of the portal — Chioma N. at Zenith Bank, Issuing Bank role, read-only scope. Renders in its own shell ([BankShell.tsx](src/components/BankShell.tsx)) with a bank-scoped sidebar (Portfolio active, Affiliates/Cards/Reports disabled with "Soon" pills) and a yellow-toned persona avatar to make the role switch obvious. Affiliates seed in [data.ts](src/pages/portal/bank/data.ts). "Switch back to Affiliate" returns to `/portal`; affiliate row "Open" alerts (drill-down not in scope).

### UJR020 — Reports (`portal/reports/`)

| Source | Route | React file | Status |
|---|---|---|---|
| `index.html` | `/portal/reports` | [Reports.tsx](src/pages/portal/reports/Reports.tsx) | ✅ 8 report cards, range picker, simulated two-phase queued → ready, recent reports panel |

Report definitions, ranges, recent-list seed, and `newJobId()` helper live in [data.ts](src/pages/portal/reports/data.ts). Generation is local: clicking CSV/XLSX flips through `idle → queued (700ms) → generating (1.3s more) → ready` and surfaces a fake download link. Per-card state is local React state — there's no shared context because nothing else in the app needs the job status.

### UJR009 + UJR010 + UJR015 — Card servicing (`portal/card/`)

| Source | Route | React file | Status |
|---|---|---|---|
| `index.html?cardId=…` | `/portal/card/:cardId` | [CardDetail.tsx](src/pages/portal/card/CardDetail.tsx) | ✅ UJR015 detail: card visual, balance (CMS / cached fallback), recent activity stub, action grid |
| `freeze.html?cardId=…` | `/portal/card/:cardId/freeze` | [FreezeConfirm.tsx](src/pages/portal/card/FreezeConfirm.tsx) | ✅ UJR009: confirm + reason + idempotency key; 409-conflict guard when not ACTIVE |
| `unfreeze.html?cardId=…` | `/portal/card/:cardId/unfreeze` | [UnfreezeConfirm.tsx](src/pages/portal/card/UnfreezeConfirm.tsx) | ✅ UJR010: confirm + reason + idempotency key; 409-conflict guard when not FROZEN |

Card lookup ([cardLookup.ts](src/pages/portal/card/cardLookup.ts)) resolves a `cardId` against the customer seed pool first, then falls back to the most recent issuance outcome in sessionStorage. Status overrides from freeze/unfreeze persist in [overrideStorage.ts](src/pages/portal/card/overrideStorage.ts) (`kardit_card_overrides_v1`), so the detail page shows the latest state across the rest of the session. After submission, freeze/unfreeze redirect back to detail with `?just=froze|unfroze` to surface a toast.

### UJR008 — Issue Card (`portal/issue-card/`)

| Source | Route | React file | Status |
|---|---|---|---|
| `01-start.html` | `/portal/issue-card` | [Start.tsx](src/pages/portal/issue-card/Start.tsx) | ✅ Cold + warm start via `?customerId=` |
| `02-customer.html` | `/portal/issue-card/customer` | [CustomerCapture.tsx](src/pages/portal/issue-card/CustomerCapture.tsx) | ✅ |
| `03-card.html` | `/portal/issue-card/card` | [CardSelect.tsx](src/pages/portal/issue-card/CardSelect.tsx) | ✅ Bank → product → type cascade |
| `04-delivery.html` | `/portal/issue-card/delivery` | [Delivery.tsx](src/pages/portal/issue-card/Delivery.tsx) | ✅ Auto-skipped for virtual |
| `05-review.html` | `/portal/issue-card/review` | [Review.tsx](src/pages/portal/issue-card/Review.tsx) | ✅ Idempotency key preserved |
| `06-result.html` | `/portal/issue-card/result` | [Result.tsx](src/pages/portal/issue-card/Result.tsx) | ✅ Virtual/physical variants |

Shared state across the journey via [IssueCardContext.tsx](src/pages/portal/issue-card/IssueCardContext.tsx) with sessionStorage persistence (`kardit_iss_state_v1`). Mock catalog data in [data.ts](src/pages/portal/issue-card/data.ts).

### Affiliate Onboarding (`flows/affiliate_onboarding/`)

| Source | Route | React file | Status |
|---|---|---|---|
| `ScrStart` | `/onboarding` | [Start.tsx](src/pages/onboarding/Start.tsx) | ✅ Landing — "Start fresh" vs draft resume |
| `ScrOrg` | `/onboarding/org` | [Org.tsx](src/pages/onboarding/Org.tsx) | ✅ Org + primary-contact form with field-level errors |
| `ScrDocs` | `/onboarding/docs` | [Docs.tsx](src/pages/onboarding/Docs.tsx) | ✅ 5 required docs with toggle-upload + remaining counter |
| `ScrBanks` | `/onboarding/banks` | [Banks.tsx](src/pages/onboarding/Banks.tsx) | ✅ 10-bank picker with live search + checkbox state |
| `ScrReview` | `/onboarding/review` | [Review.tsx](src/pages/onboarding/Review.tsx) | ✅ Sectioned review with edit-jumps + terms checkbox; missing docs/banks → errors screen |
| `ScrSubmitted` | `/onboarding/submitted` | [Submitted.tsx](src/pages/onboarding/Submitted.tsx) | ✅ Success state with case ID + today's date |
| `ScrErrors` | `/onboarding/errors` | [Errors.tsx](src/pages/onboarding/Errors.tsx) | ✅ 3 sample issues, "Fix Now" deep-links to the right step |
| `ScrStatus` | `/onboarding/status` | [Status.tsx](src/pages/onboarding/Status.tsx) | ✅ Stage banner + timeline; clarification stage exposes Respond CTA |
| `ScrRespond` | `/onboarding/respond` | [Respond.tsx](src/pages/onboarding/Respond.tsx) | ✅ Reply textarea + re-upload dropzone; submit advances stage to "review" |

Shared shell ([OnboardingShell.tsx](src/pages/onboarding/OnboardingShell.tsx)) hosts its own AppBar + left progress rail (mirrors the original `flows/affiliate_onboarding/shell.jsx`). The rail is hidden on Start/Submitted/Errors/Status/Respond — those screens are full-bleed. State persists via sessionStorage-backed [OnboardingContext.tsx](src/pages/onboarding/OnboardingContext.tsx) (`kardit_onboarding_v1`). The Partners page CTA now links straight into `/onboarding`.

## Not yet ported

_All journeys from the source prototype are now ported._

## Known caveats

1. **Kardit variants collapsed** — source had three Kardit homepage designs that differed only in their headers (`img` logo vs wordmark vs primary nav). The shared `MarketingHeader` strips those differences, so all three currently render identically. Fix: make `MarketingHeader` configurable per route.
2. **Partners wizard is a placeholder** ([Partners.tsx:43-57](src/pages/Partners.tsx#L43-L57)). Original embeds a 9-step iframe + postMessage coordination from `flows/affiliate_onboarding/`. Needs either re-embedding the iframe or a native React rebuild.
3. **ChamsSwitch "Become a Partner" CTA** has `href="#partners"` (in-page anchor that doesn't exist on that page) — preserved from the source HTML; was a pre-existing bug there.

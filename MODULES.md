# Kardit modules — SRS mapping & working integrations

The original Kardit prototype was scaffolded against an internal Software
Requirements Spec (SRS). Each screen carried a user-journey code (UJRxxx),
functional-requirement codes (FR-xxx), screen identifiers (SCR-xxx) and API
identifiers (API-xxx) directly in its visible copy.

This document keeps that mapping for engineers / PMs without leaking it into
the user-facing UI.

## Module map

### Marketing site

| Route | Page | SRS codes |
|---|---|---|
| `/` | Home | — (public-facing) |
| `/about` | About | — |
| `/solutions` | Solutions | — |
| `/industries` | Industries | — |
| `/partners` | Partners | references the affiliate onboarding flow (not yet wired) |
| `/contact` | Contact | — |
| `/kardit`, `/kardit-v2`, `/kardit-v3` | Kardit website variants | — |
| `/chamsswitch` | ChamsSwitch website | — |
| `/signin` | Sign in | SCR-AUTH-02 (success → dashboard redirect) |

### Portal — operational

| Route | Module | UJR | Screens (SCR) | Key FRs |
|---|---|---|---|---|
| `/portal` | Dashboard | UJR019 | SCR-DSH-01 | FR-DSH-06…15 (KPI tiles); pulls audit feed from UJR022 (AuditLog) |
| `/portal/customers` | Customer search | UJR007 | SCR-VCUS-01 | FR-VCUS-API-01…08 (tenant scoping) |
| `/portal/customers/:ref` | Customer profile | UJR007 | SCR-VCUS-02 | FR-VCUS-API-01…08 |
| `/portal/customers/new` | New customer capture | UJR005 | (capture form) | — |
| `/portal/customers/new/saved` | Saved draft confirmation | UJR005 | — | — |
| `/portal/issue-card` | Issue card — Start (cold + warm) | UJR008 | SCR-ISS-01 | FR-ISS-S01…S03 |
| `/portal/issue-card/customer` | Customer capture (issuance path) | UJR008 | SCR-ISS-02 | API-ISS-02 |
| `/portal/issue-card/card` | Bank → product → type | UJR008 | SCR-ISS-03 | FR-ISS-S01 (catalog) |
| `/portal/issue-card/delivery` | Physical delivery (conditional) | UJR008 | SCR-ISS-04 | — |
| `/portal/issue-card/review` | Review + idempotency | UJR008 | SCR-ISS-05 | FR-ISS-S03 (idempotency), FR-ISS-M01…M04 (CMS Token24, Signature/MAC, CreateUnitCard) |
| `/portal/issue-card/result` | Result (virtual ACTIVE / physical PERSONALIZING) | UJR008 | SCR-ISS-06 | FR-ISS-S02 (single outcome), FR-ISS-VA-01 (virtual account auto-provision) |
| `/portal/card/:cardId` | Card detail / balance | UJR015 | (card detail) | FR-BAL-API-01 (CMS retrieval with cached fallback) |
| `/portal/card/:cardId/freeze` | Card freeze | UJR009 | (confirm) | FR-FRZ-API-01 (CardLifecycleEvent + AuditLog), 409 conflict guard |
| `/portal/card/:cardId/unfreeze` | Card unfreeze | UJR010 | (confirm) | FR-UFR-API-01, 409 conflict guard |
| `/portal/funds` | Load funds — form | UJR012 | (form) | FR-LOAD-MC-01 (maker-checker), FR-LOAD-API-01-07/08 (funding reference) |
| `/portal/funds/review` | Load funds — review | UJR012 | (review) | FR-LOAD-API-01-21 (idempotency) |
| `/portal/funds/result` | Load funds — result | UJR012 | (result) | maker-checker audit trail |
| `/portal/reports` | Reports | UJR020 | (single screen) | FR-RPT-API-01-01 (tenant scope), FR-RPT-API-01-03 (async generation), FR-RPT-12 (final-state-only funding) |
| `/portal/bank` | Bank portfolio | UJR023 | (single screen) | FR-BNK-API-01-05…14 (bank-scoped KPIs), FR-PORT-API-01-02 (read-only scope), FR-FRZ-API-01-02 (no lifecycle actions for bank role) |
| `/portal/batches` | Batch dashboard | UJR006 | SCR-BATCH-01 | FR-BAT-API-01 (recent jobs list) |
| `/portal/batches/welcome` | Batch journey landing | UJR006 | — | (explainer page) |
| `/portal/batches/upload` | Upload batch file | UJR006 | SCR-BATCH-02 | FR-BAT-API-02 (file accept rules) |
| `/portal/batches/validation` | Validation summary | UJR006 | SCR-BATCH-03 | FR-BAT-API-03 (row-level errors) |
| `/portal/batches/submit` | Submit batch | UJR006 | SCR-BATCH-04 | FR-BAT-MC-01 (maker-checker handoff) |
| `/portal/batches/approval` | Approval queue (checker) | UJR006 | SCR-BATCH-05 | FR-BAT-MC-02 (checker scope) |
| `/portal/batches/processing` | Processing monitor | UJR006 | SCR-BATCH-06 | FR-BAT-API-04 (live progress) |
| `/portal/batches/result` | Result summary | UJR006 | SCR-BATCH-07 | FR-BAT-API-05 (retryable failures) |

### Portal — not yet ported

| Folder in source | Module | UJR | Notes |
|---|---|---|---|
| `portal/batches/` | Batch issuance | UJR006 | 8 screens — CSV upload, validation, maker-checker, processing |
| (not in prototype) | Transactions | UJR018 | — |
| (not in prototype) | Physical card tracking | UJR027 | — |
| (cross-cutting) | Audit log | UJR022 | Feeds Dashboard "Recent activity" |
| (cross-cutting) | Operational portal home | UJR017 | The shell itself |

### Other journeys

| Route | Module | UJR | Notes |
|---|---|---|---|
| `/onboarding` | Affiliate onboarding wizard | UJR001 (Affiliate role provisioning) | 9 screens: Start → Org → Docs → Banks → Review → Submitted; Errors, Status, Respond as branches |

## Working integrations (in this build)

These deep-links are wired and exercise real state transitions:

| From | To | Mechanism |
|---|---|---|
| Dashboard action card "New customer" | `/portal/customers/new` | Link |
| Dashboard action card "Find a customer" | `/portal/customers` | Link |
| Dashboard action card "Issue a card" | `/portal/issue-card` | Link |
| Dashboard Recent activity (customer rows) | `/portal/customers/:ref` | Link, ref from row meta |
| Sidebar "Customers" | `/portal/customers` | NavLink |
| Sidebar "Cards" | `/portal/issue-card` | NavLink |
| Sidebar "Reports" | `/portal/reports` | NavLink |
| Dashboard action card "Reports" | `/portal/reports` | Link |
| Dashboard action card "View as Issuing Bank" | `/portal/bank` | Link |
| Bank portfolio "Switch back to Affiliate" | `/portal` | Link |
| Dashboard action card "Batch issuance" | `/portal/batches` | Link |
| Sidebar "Batches" | `/portal/batches` | NavLink |
| Dashboard Recent activity → "Batch completed" row | `/portal/batches/result` | Link |
| Batches Dashboard "New batch" | `/portal/batches/upload` | Link |
| Batches Upload → Validation → Submit → Approval → Processing → Result | next step | linear |
| Batches Approval "Approve and process" | `/portal/batches/processing` | Link |
| Partners page "Start Onboarding" CTA | `/onboarding` | Link |
| Onboarding Start → Org → Docs → Banks → Review → Submitted | next step | linear, draft state persisted in sessionStorage |
| Onboarding Review (missing docs/banks) → Errors | `/onboarding/errors` | programmatic navigate |
| Onboarding Errors row "Fix Now" | corresponding step | programmatic navigate |
| Onboarding Status "Respond to Clarification" | `/onboarding/respond` | Link (only shown in clarification stage) |
| Onboarding Respond → Status | `/onboarding/status` | advances statusStage from clarification → review |
| Customer search row click | `/portal/customers/:ref` | Programmatic navigate |
| Customer profile "Issue new card" | `/portal/issue-card?customerId=<ref>` | warm-start (falls back through KNOWN_CUSTOMERS → CUSTOMERS list → draft) |
| New customer "Issue a card now" (saved page) | `/portal/issue-card?customerId=<draft.ref>` | warm-start via draft sessionStorage |
| Issue Card Start (warm) | `/portal/issue-card/card` | skips capture, hydrates customer into IssueCardContext |
| Issue Card Customer → Card → (Delivery|Review) | next step | linear, virtual cards auto-skip delivery |
| Issue Card Review → Result | post-issuance state set in context, navigate | idempotency key + request ID generated once and persisted |
| Issue Card Result "Open customer" | `/portal/customers/:customerId` | Link |
| Issue Card Result "Issue another card" | `/portal/issue-card` | clears IssueCardContext + sessionStorage |
| Issue Card Result "View balance" (virtual) | `/portal/card/:cardId` | card lookup falls back to issuance outcome in sessionStorage |
| Customer profile card row → Balance | `/portal/card/:cardId` | Link |
| Customer profile card row → Freeze (ACTIVE only) | `/portal/card/:cardId/freeze` | Link |
| Customer profile card row → Unfreeze (FROZEN only) | `/portal/card/:cardId/unfreeze` | Link |
| Card freeze/unfreeze submit | `/portal/card/:cardId?just=froze\|unfroze` | sets override in sessionStorage, toast on detail |
| Dashboard Recent activity → "Card frozen" row | `/portal/card/CARD-2026-VRP00984` | Link, FROZEN status persists from seed |
| Dashboard Recent activity → "Funds loaded" row | `/portal/funds?cardId=CARD-2026-VRP01028` | Link, warm-starts the load with Chiamaka's card |
| Card detail → Load funds (ACTIVE only) | `/portal/funds?cardId=<id>` | Link, warm-starts |
| Issue Card Result → Load funds (virtual) | `/portal/funds?cardId=<newCardId>` | Link, warm-starts using the just-issued card's id |
| Load Funds Result → "View card balance" | `/portal/card/:cardId` | Link, lookup falls back to issuance outcome |
| Load Funds Result → "Load another" | `/portal/funds?cardId=<id>` | Resets context first, then warm-starts |

## Pending / dead-ended actions

These are intentionally stubbed because the target module isn't ported yet.
Clicking them surfaces an alert.

| Click | Stub message | Target module |
|---|---|---|
| Customer profile card → Txns | "Transactions — coming later" | UJR018 |
| Customer profile → Edit | "Editing happens in the capture flow" | UJR005 owns capture |
| Card detail → Transactions | "Transactions — coming later" | UJR018 |
| Card detail → Limits | "Limit increase — coming later" | UJR016 |
| Issue Card Result → Track delivery (physical) | "Physical card tracking — coming later" | UJR027 |
| Issue Card Result → Load funds (physical, locked) | "Funding unlocks once card is ACTIVE" | UJR012 |
| Dashboard action card → Load funds | falls through to catch-all | UJR012 |

## SRS code key

- **UJRxxx** — User journey (e.g. UJR008 = Unified Customer + Card Issuance)
- **SCR-XXX-NN** — Individual screen within a journey (e.g. SCR-ISS-05 = Issue card / Review)
- **FR-XXX-…** — Functional requirement (e.g. FR-ISS-S03 = idempotency on issuance)
- **API-XXX-NN** — Backend API endpoint (e.g. API-ISS-02 = CreateUnitCard request)
- **FR-ISS-M01…M04** — CMS handshake sequence: Token24, Signature, MAC, CreateUnitCard call
- **FR-ISS-VA-01** — Auto-provisioned linked virtual account on successful issuance
- **FR-VCUS-API-01…08** — Customer service tenant-scoping rules
- **FR-DSH-06…15** — Dashboard KPI tile families
- **AuditLog (UJR022)** — Centralised audit feed surfaced as "Recent activity"

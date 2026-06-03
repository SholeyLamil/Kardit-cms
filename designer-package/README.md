# Kardit CMS - Complete Design System & Pages

## Overview
This package contains the complete Kardit website and portal for redesign purposes.

## What's Included

### Pages
1. **Landing Page** - Hero section, trust indicators, platform overview
2. **Sign In** - Account login with email/password form
3. **Dashboard/Portal** - Account dashboard with KPIs and transaction data
4. **About** - Company information and history
5. **Solutions** - Enterprise payment solutions
6. **Partners** - Partner integrations
7. **Industries** - Vertical solutions
8. **Contact** - Contact form

### Marketing Pages
- Home with hero, features, and trust indicators
- Regulatory compliance section (ChamsSwitch, CBN, UnionPay, Wema Bank, Providus Bank)
- Enterprise solutions
- Partner ecosystem
- Industry-specific offerings

### Portal/Admin Pages
- Dashboard with KPI metrics
- Batch processing
- Customer management
- Card management (issuance, freezing)
- Transaction reporting
- Fund loading
- User management

## Design System Files

### CSS Files
- `tokens.css` - Design tokens (colors, spacing, typography, shadows)
- `site.css` - Component styles and utilities
- `animations.css` - Animation definitions

### Color Palette
- Primary Green: #1b9d57
- Dark Green: #0d5130
- Accent Red: #c83a46
- Neutral: Various grays (#0f1e12 to #f9faf9)

### Typography
- Font Family: Inter (sans-serif)
- Font Weights: 400, 500, 600, 700, 800
- Responsive scales with clamp() for fluid sizing

## How to Use

### For Designers:
1. Open `kardit-complete-website.html` in your browser (double-click it)
2. Navigate through all pages using the header menu
3. View responsive layout at different breakpoints
4. Refer to CSS files for current styling and spacing

### For Developers:
1. Review CSS files to understand the design system
2. Use component patterns as reference for React implementation
3. Maintain the established design tokens when making changes

## Key Components

### Navigation
- Sticky header with scroll effects
- Mobile-responsive menu
- Logo as home link
- CTA buttons (Sign In, Start Enrollment)

### Forms
- Login form with password visibility toggle
- Multi-step enrollment forms
- Customer management forms
- Input validation and error states

### Dashboard
- KPI cards with metrics
- Date range selector
- Refresh/loading states
- Transaction tables
- Action buttons

## Responsive Design
All pages are fully responsive with breakpoints at:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Accessibility
- Semantic HTML structure
- ARIA labels on interactive elements
- Focus states on buttons and links
- Keyboard navigation support

## For Questions
Contact the development team for specific implementation details or design system questions.

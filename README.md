# Bazaar Ecommerce Frontend

A production-oriented ecommerce frontend built with React and TypeScript, focused on real shopping flows (browse, cart, checkout, orders, wishlist) with responsive UX and reusable architecture.

## What We Built

### 1) Customer-facing ecommerce flow
- Landing page with sales-first merchandising sections.
- Catalog page with:
  - category filtering
  - sort options
  - mobile filter/sort sheets
  - infinite scrolling behavior with controlled skeleton loading
- Product details page with related/suggested/recently viewed rails.
- Cart page with quantity controls, summary, and checkout entry.
- Checkout + OTP verification flow.
- Demo checkout OTP included for testing (`123456`).
- Order placed confirmation.
- My Orders experience backed by local store data (plus remote data handling where available).
- Wishlist feature:
  - toggle from product cards and product details
  - dedicated wishlist listing page
  - wishlist count in navigation

### 2) Auth and protected action flow
- Global auth modal available from anywhere (without route-jump side effects).
- Protected-intent workflow: when a user triggers protected actions (for example My Orders / checkout), auth opens and flow resumes after successful login.
- Mock OTP auth flow for demo UX continuity.

### 3) Responsive and interaction improvements
- Mobile bottom navigation bar for key routes.
- Improved cart card layout on small screens.
- Scroll reset behavior on route change.
- Unified transition/motion layer with reduced-motion support.
- Search modal polish:
  - fixed scroll-jump issue on open
  - focus handling with `preventScroll`
  - body scroll lock while modal is open

### 4) Theming and UI consistency
- Tokenized global theme in `src/assets/style/global.css`.
- Updated color palette + home-only top gradient treatment.
- Reusable shared primitives (`Button`, `Input`, `Select`, `Modal`, etc.) used across pages.

## Key Technical Decisions

### Zustand for app state
Used Zustand slices for focused state domains (`auth`, `cart`, `orders`, `wishlist`, `ui`), with persistence where continuity matters (cart/wishlist/session UX).  
Why: lightweight, predictable, fast to iterate, and simpler than larger state frameworks for this scope.

### Route configuration + layout composition
Routes are centralized and wrapped with layout and private-route handling.  
Why: keeps navigation behavior and access control consistent and reduces per-page wiring.

### Mock-assisted checkout/order flow
Checkout completion and OTP verification are modeled with local/mock service paths.  
Why: enables full end-to-end frontend behavior even when backend endpoints are incomplete or read-only.

### Shared UI primitives over per-page duplication
Core interactive UI elements are standardized in `src/shared/ui`.  
Why: enforces consistency and makes global style/behavior updates much cheaper.

### CSS token system for maintainability
Design tokens (colors, spacing behavior, motion timings) are centralized.  
Why: lets us tune look-and-feel (palette, gradients, contrast, motion) quickly without refactoring component logic.

## What We Would Do Differently With More Time

1. Add stronger test coverage:
   - unit tests for store logic and utility functions
   - integration tests for protected flows, cart/wishlist, and checkout transitions
   - E2E tests for mobile navigation and filter flows

2. Introduce stricter API contract safety:
   - schema validation for server responses
   - normalized error handling layer per endpoint

3. Performance hardening:
   - code splitting for larger bundles
   - prefetch strategy for product details and major list routes
   - image optimization pipeline

4. Accessibility and UX audits:
   - deeper keyboard navigation checks
   - color contrast and focus-state audits
   - screen-reader flow verification for modals/sheets

5. Design system maturity:
   - formal component documentation
   - more variant coverage and visual regression checks

## Project Structure

```text
src/
  app/                          # app entry shell
  assets/style/                 # global tokens + theme + utilities
  components/
    auth/                       # auth modal flow
    error/                      # global error modal
    layout/                     # header/footer/chip bar/mobile nav/search modal
    products/                   # reusable product cards, rails, skeletons
  layout/base-layout/           # shared route layout
  mocks/services/               # mock services for checkout/order/catalog behavior
  pages/
    home/                       # landing page and merchandising sections
    catalog/                    # product list, sort/filter, infinite load
    product/                    # product details
    cart/                       # cart management
    checkout/                   # checkout and OTP step
    orders/                     # order listing/details/placed
    wishlist/                   # wishlist listing page
    not-found/
  routes/                       # route URLs, route list, guards, scroll reset
  shared/
    api/                        # API methods + request wrappers
    config/                     # env config
    constants/                  # app constants
    hooks/                      # reusable hooks
    lib/                        # utilities/format helpers
    store/                      # Zustand stores
    types/                      # TypeScript contracts
    ui/                         # shared primitives
    validation/                 # form schemas
```

## Tech Stack

- React 19
- TypeScript (strict)
- Zustand
- React Router DOM
- Tailwind CSS v4
- Lucide Icons
- ESLint + Prettier

## Run Locally

```bash
npm install
npm run dev
```

## Demo OTP (Checkout)

For demo/testing of the payment verification step, use:

```text
123456
```

Where to use it:
- Go to checkout.
- Choose a non-COD payment method.
- Continue to payment OTP screen.
- Enter `123456` and submit.

## Quality Checks

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
```

## Environment

Optional `.env` values:

```bash
VITE_BASE_API_URL=https://fakestoreapiserver.reactbd.org/api
VITE_API_TIMEOUT_MS=15000
```

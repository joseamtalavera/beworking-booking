*** End Patch
Reply with result of ApplyPatch tool. This tool can only create new files and apply diffs to existing files. It cannot create a directory for a new file. Create any directories needed before calling this tool.***
## Beworking Booking — Initial Architecture Notes

### 1. Purpose
- Public-facing booking experience for visitors and authenticated tenants.
- Showcase meeting rooms on a map with quick “mini cards” that lead to detailed room pages.
- Support two flows: authenticated user sign-in and guest (visitor) checkout with Stripe-backed payments.

### 2. Tech Stack Direction
- React + Vite (aligns with existing dashboard tooling; easy to share components).
- React Router for multipage flow (`/`, `/rooms/:slug`, `/checkout`, `/login`).
- Material UI 7.x to reuse design tokens/components; Tailwind optional later.
- Map rendering via Mapbox GL JS (vector tiles + custom markers) or Google Maps JS SDK (choose based on licensing; Mapbox suggested for custom styling).
- State management: Zustand or Redux Toolkit Query for API state + cached lookups.
- Stripe.js + Payment Element for direct card capture; support Payment Links fallback for admin-created bookings.

### 3. High-Level Features
1. **Home / Discovery**
   - Full-bleed map with location markers for each centro/producto.
   - Sidebar list of mini cards (thumbnail, price from, capacity, availability indicator).
   - Filters: city/centro, capacity, amenities, price range, availability date.
2. **Room Detail**
   - Gallery, description, amenities, capacity, pricing table (hourly/daily/monthly).
   - Availability calendar + time selector (talks to backend availability endpoint).
   - CTA: `Book Now` leading to booking flow (prefill selected slot).
3. **Booking Flow**
   - Stepper: `Details → Extras → Payment`.
   - Option to sign in (redirect to existing auth) or continue as visitor.
   - Visitor flow collects contact + billing info (matches `contact_profile` schema).
   - Payment step uses Stripe: either immediate PaymentIntent (user) or Payment Link (admin-assisted bookings).
4. **Account Area (phase 2)**
   - Lightweight dashboard for authenticated users to view upcoming bookings, manage payment methods.

### 4. API Requirements (backend coordination)
- `GET /catalog/rooms` – list metadata for map/cards (with geo coords, capacity, amenities, pricing).
- `GET /rooms/{id}/availability?from=&to=` – returns time slots/blocks, including per-hour availability.
- `POST /rooms/{id}/quote` – returns pricing summary for selected schedule + attendee count.
- `POST /reservations` – creates reservation in `blocked` state and triggers payment flow. Payload includes `createdBy` (`user` or `visitor`) and billing/contact data.
- `POST /reservations/{id}/confirm` – invoked after Stripe webhook success to mark as confirmed.
- `POST /reservations/{id}/cancel` – triggered when payment fails/timeout.
- `POST /reservations/{id}/payment-link` – generates/refreshes Stripe Payment Link (admin flow or monthly rebill).
- Authentication endpoints reused from existing backend for login flow.

### 5. Frontend Repo Structure (draft)
```
beworking-booking/
├── public/
├── src/
│   ├── api/          # REST clients (fetch hooks, query clients)
│   ├── components/
│   │   ├── map/
│   │   ├── cards/
│   │   ├── checkout/
│   │   └── layout/
│   ├── pages/        # route-level components
│   ├── store/        # Zustand slices / auth & booking state
│   ├── utils/
│   ├── hooks/
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

### 6. Integration Considerations
- Share TypeScript interfaces with backend via `beworking-types` package (future improvement).
- Use environment variables (`VITE_API_BASE_URL`, `VITE_STRIPE_PUBLISHABLE_KEY`, `VITE_MAPBOX_TOKEN`).
- Reuse existing `contact_profile` logic: visitor booking posts the same payload as admin-created contacts; backend can auto-create contact if email not found.
- Authentication: reuse existing OAuth/JWT endpoints; store tokens in `localStorage`/cookies as in other apps.

### 7. Immediate Next Actions
1. Finalize backend data contract for map/catalog endpoints and reservation creation.
2. Implement shared API client + auth context.
3. Build static versions of Home (map + cards) and Room Detail pages using mocked data.
4. Hook booking stepper to backend endpoints once available.
5. Integrate Stripe payment capture (user flow first) and webhook-driven confirmation.

### 8. Getting Started
```bash
npm install
npm run dev
```

Environment variables: copy `.env.example` to `.env` and populate `VITE_API_BASE_URL`, `VITE_STRIPE_PUBLISHABLE_KEY`, and `VITE_MAPBOX_TOKEN`.

---
This document will evolve as we flesh out backend capabilities and detailed UX flows.

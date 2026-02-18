# BeWorking Booking

Public-facing booking widget for visitors and authenticated tenants. Room discovery, availability checking, and Stripe-powered payments.

## Tech Stack

- Next.js 15 (Pages Router), React 19
- Zustand (state management), React Query
- Stripe.js + Payment Element
- Mapbox GL JS (location maps)
- Cloudflare Turnstile (bot protection)

## Development

```bash
npm install
npm run dev
```

Or via docker-compose (runs on port 4173):

```bash
cd ../beworking-orchestration
docker-compose up beworking-booking
```

Copy `.env.example` to `.env.local` and configure variables.

## Key Features

- Room catalog with map view and mini cards
- Availability calendar with time slot selection
- Multi-step booking flow (Details > Extras > Payment)
- Authenticated user flow (JWT) and guest checkout
- Free booking eligibility check (monthly limits per tenant type)
- Stripe payment capture with webhook confirmation

## API Dependencies

Requires the backend API and stripe service to be running:

- Backend: room catalog, availability, booking creation, contact lookup
- Stripe service: payment intents, customer management

## Build

```bash
npm run build
npm start
```

## Deployment

AWS ECS Fargate. See `../beworking-orchestration/docs/deployment/ops-runbook.md`.

# CLAUDE.md — BeWorking Booking

Instructions for AI sessions (Claude Code / Cowork) working on this project.

## Project

BeWorking booking platform (Next.js + Stripe), operated by **Globaltechno OÜ**.
Market: **Málaga** (expansion planned: Sevilla, Tallinn).
Products: meeting rooms (salas de reunión), virtual office (oficina virtual / Oficina15), coworking, desks.

- Marketing site + first booking/signup: `be-working.com` (this repo, has GTM)
- Authenticated dashboard for existing customers: `app.be-working.com` (no marketing tag — intentional)

## Marketing project — strategy reference

The marketing strategy is documented across 4 pillars in `/marketing/`. Read the
relevant file before working on anything marketing-related:

- `marketing/01_email_marketing.md` — retention, lead nurture, abandonment recovery
- `marketing/02_seo.md` — local SEO (Google Business Profile), on-page, content
- `marketing/03_paid_ads.md` — Google/Meta/YouTube/TikTok/LinkedIn (Google Ads implemented)
- `marketing/04_social_media.md` — brand, community, content reuse

## ⭐ Core business principles (do not violate)

These two principles were learned from real BeWorking data and override generic best practices:

1. **Hybrid funnel, not pure self-service.** B2B customers here ask before booking
   (≈100% for rooms, slightly less for OV). Cold ad traffic must land on
   inquiry/tour CTAs ("Solicitar información", "Reservar visita"), NOT direct
   self-service checkout. Self-service is for warm/existing users. (Aligns with
   WeWork/Regus/Spaces "Book a tour" pattern.) Pure self-service broke the funnel
   once: 1 month, 0 conversions.

2. **Intent hierarchy: Call > Email > WhatsApp.** Reflected in Google Ads
   conversion values (call €25 > OV €180 LTV > email €15 ≈ inquiry €15 >
   whatsapp €7 > booking_initiated €3). Optimize with **Maximize Conversion
   Value**, never plain Maximize Conversions (which would chase cheap WhatsApp clicks).

## Tracking architecture (single source of truth)

- ALL client-side dataLayer pushes go through `src/utils/analytics.js`. Never call
  `window.dataLayer.push()` anywhere else — a grep for `dataLayer.push` outside
  that file must return zero results.
- Events: inquiry_submitted, whatsapp_clicked, call_clicked, email_clicked,
  register_initiated, booking_initiated, booking_completed, purchase_completed.
- Enhanced Conversions: `email_hash` (SHA-256) included on purchase_completed and
  booking_completed; consumed by a GTM User-Provided Data tag (priority 100).
- GTM container: `GTM-T5BD4L36`. Google Ads conversion ID: `AW-18059296882`.
- url_passthrough: true; Conversion Linker on All Pages; Cookiebot ↔ Consent Mode v2.

## Google Ads operational rules

- Learning phase 7-14 days after any bid-strategy change → do NOT touch budget,
  values, or bid during that window.
- Scale budget on proven ROAS, not on the "Limited by budget" flag.
- Switch Search to Maximize Conversion Value only once each campaign has 15+ conversions.
- Ignore Google recommendations pushing broad match / premature Smart Bidding.
  Optimization Score is a vanity metric.

## Stack notes

- Next.js Pages Router, MUI, Zustand (useBookingFlow, useBookingVisitor), Stripe
  (Elements/PaymentIntent for rooms, SetupIntent for OV subscriptions).
- Cookiebot loaded in `pages/_document.js` with Google Consent Mode v2 default-denied.

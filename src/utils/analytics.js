/**                                                       
   * Analytics — single source of truth for marketing dataLayer pushes.
   *                                                                                                                                                 
   * Every call site uses the typed helpers below. Never call
   * window.dataLayer.push() directly elsewhere — a grep for "dataLayer.push"                                                                        
   * outside this file should return zero results.                                                                                                   
   *                                                                                                                                                 
   * Path:                                                                                                                                           
   *   1. helper() builds payload                                                                                                                    
   *   2. internal track() pushes to window.dataLayer (consumed by GTM)                                                                              
   *   3. internal track() optionally posts to /api/v1/events (Phase 2 backend                                                                       
   *      log; today gated off by NEXT_PUBLIC_MARKETING_BACKEND_LOG)                                                                                 
   *                                                                                                                                                 
   * Conversion mapping (configured in Google Ads → Conversions):                                                                                    
   *   inquiry_submitted    → Lead     — contact form                                                                                                
   *   whatsapp_clicked     → Contact  (Primary)            
   *   call_clicked         → Contact                                                                                                                
   *   email_clicked        → Contact  (Secondary)
   *   register_initiated   → Lead     — OV signup intent BEFORE Stripe                                                                              
   *   booking_initiated    → Lead     — room / desk booking intent BEFORE pay                                                                       
   *   booking_completed    → Purchase — booking paid (PaymentStep)
   *   purchase_completed   → Purchase — OV signup paid (SignUp)                                                                                     
   *                                                        
   * Symmetry: every paid flow has a matching Lead event that fires on intent                                                                        
   * (BEFORE the user is asked for payment). Pairs:                                                                                                  
   *   register_initiated  ↔ purchase_completed   (OV signup)
   *   booking_initiated   ↔ booking_completed    (rooms + desks)                                                                                    
   */                                                       
                                                                                                                                                     
  // ─── Event names registry ──────────────────────────────────────────────────                                                                     
  export const EVENTS = Object.freeze({
    INQUIRY_SUBMITTED:  'inquiry_submitted',                                                                                                         
    WHATSAPP_CLICKED:   'whatsapp_clicked',                                                                                                          
    CALL_CLICKED:       'call_clicked',                                                                                                              
    EMAIL_CLICKED:      'email_clicked',                                                                                                             
    REGISTER_INITIATED: 'register_initiated',                                                                                                        
    BOOKING_INITIATED:  'booking_initiated',                                                                                                         
    BOOKING_COMPLETED:  'booking_completed',
    PURCHASE_COMPLETED: 'purchase_completed',                                                                                                        
  });                                                                                                                                                
   
  // ─── Phase 2 backend-log hook (no-op until env flag is flipped) ───────────                                                                      
  const BACKEND_LOG_ENABLED =                               
    process.env.NEXT_PUBLIC_MARKETING_BACKEND_LOG === 'true';                                                                                        
  const BACKEND_LOG_URL = process.env.NEXT_PUBLIC_MARKETING_API_URL || '';
                                                                                                                                                     
  function maybeBackendLog(payload) {                                                                                                                
    if (!BACKEND_LOG_ENABLED || !BACKEND_LOG_URL) return;                                                                                            
    if (typeof navigator === 'undefined' || !navigator.sendBeacon) return;                                                                           
    try {                                                                                                                                            
      const body = new Blob(
        [JSON.stringify({ ...payload, client_ts: Date.now() })],                                                                                     
        { type: 'application/json' }                                                                                                                 
      );                                                                                                                                             
      navigator.sendBeacon(`${BACKEND_LOG_URL}/api/v1/events`, body);                                                                                
    } catch {                                                                                                                                        
      /* swallow — never break UX for telemetry */
    }                                                                                                                                                
  }                                                         
                                                                                                                                                     
  // ─── Internal: every event flows through here ─────────────────────────────                                                                      
  function track(event, params = {}) {
    if (typeof window === 'undefined') return;                                                                                                       
    const payload = { event, ...params };                                                                                                            
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);                                                                                                                  
    maybeBackendLog(payload);                                                                                                                        
  }
                                                                                                                                                     
  // ─── Util: SHA-256 hex digest (browser Web Crypto) ────────────────────────                                                                      
  async function sha256Hex(input) {
    if (!input || typeof window === 'undefined' || !window.crypto?.subtle) return '';                                                                
    const buf = new TextEncoder().encode(String(input).trim().toLowerCase());                                                                        
    const hash = await window.crypto.subtle.digest('SHA-256', buf);                                                                                  
    return Array.from(new Uint8Array(hash))                                                                                                          
      .map((b) => b.toString(16).padStart(2, '0'))                                                                                                   
      .join('');                                            
  }

  // ─── Typed helpers ────────────────────────────────────────────────────────                                                                      
   
  /** Form submission to /api/leads succeeded. */                                                                                                    
  export function trackInquirySubmitted({ subject, source = 'contact-form' } = {}) {
    track(EVENTS.INQUIRY_SUBMITTED, { subject: subject || 'unspecified', source });                                                                  
  }                                                                                                                                                  
                                                                                                                                                     
  /** User clicked a WhatsApp CTA. */                                                                                                                
  export function trackWhatsappClicked({ source = 'unspecified', ...rest } = {}) {
    track(EVENTS.WHATSAPP_CLICKED, { source, ...rest });                                                                                             
  }                                                                                                                                                  
                                                                                                                                                     
  /** User clicked a phone number link (tel:). */                                                                                                    
  export function trackCallClicked({ source = 'unspecified' } = {}) {
    track(EVENTS.CALL_CLICKED, { source });                                                                                                          
  }
                                                                                                                                                     
  /** User clicked an email link (mailto:). */                                                                                                       
  export function trackEmailClicked({ source = 'unspecified' } = {}) {
    track(EVENTS.EMAIL_CLICKED, { source });                                                                                                         
  }                                                         

  /**                                                                                                                                                
   * User clicked Register on the OV signup form.
   * Fires BEFORE Stripe so we still capture lead intent if the card fails.                                                                          
   * Email is SHA-256 hashed (Google Enhanced Conversions format) — never raw PII.                                                                   
   */                                                                                                                                                
  export async function trackRegisterInitiated({                                                                                                     
    plan,                                                                                                                                            
    email,                                                  
    location,                                                                                                                                        
    source = 'oficina-virtual-signup',                      
  } = {}) {                                                                                                                                          
    const emailHash = await sha256Hex(email);
    track(EVENTS.REGISTER_INITIATED, {                                                                                                               
      plan: plan || 'unspecified',                                                                                                                   
      user_data: { sha256_email_address: emailHash },
      location: location || '',                                                                                                                      
      source,                                               
    });
  }

  /** User clicked "Empezar reserva" on a room or desk detail. */                                                                                    
  export function trackBookingInitiated({ roomId, isDesk = false } = {}) {
    track(EVENTS.BOOKING_INITIATED, { roomId: roomId || 'unknown', isDesk: !!isDesk });                                                              
  }                                                                                                                                                  
                                                                                                                                                     
  /** Booking payment succeeded (PaymentStep). Hashes email for Enhanced Conversions. */
  export async function trackBookingCompleted({
    transactionId,
    valueCents,
    isSubscription = false,
    email,
  } = {}) {
    const emailHash = email ? await sha256Hex(email) : '';
    track(EVENTS.BOOKING_COMPLETED, {
      transactionId: transactionId || '',
      value: valueCents ? valueCents / 100 : 0,
      currency: 'EUR',
      isSubscription: !!isSubscription,
      user_data: { sha256_email_address: emailHash },
    });
  }

  /** OV signup payment succeeded (SignUp). Hashes email for Enhanced Conversions. */
  export async function trackPurchaseCompleted({
    transactionId,
    value,
    currency = 'EUR',
    plan,
    email,
  } = {}) {
    const emailHash = email ? await sha256Hex(email) : '';
    track(EVENTS.PURCHASE_COMPLETED, {
      transactionId: transactionId || '',
      value: value || 0,
      currency,
      plan: plan || 'unspecified',
      user_data: { sha256_email_address: emailHash },
    });
  }                                                                                                                                               
                                                            
  /** Generic raw push (escape hatch). Prefer typed helpers above. */                                                                                
  export function trackEvent(eventName, params = {}) {
    track(eventName, params);                                                                                                                        
  }    
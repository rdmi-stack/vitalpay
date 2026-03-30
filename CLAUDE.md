# PatientPay (VitalPay)

## Project Overview
Healthcare patient payment platform built with Next.js 15 (App Router), React 19, TypeScript, and Tailwind CSS. Branded as **PayVital**.

## Tech Stack
- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** FastAPI (Python) — separate service
- **Database:** MongoDB Atlas (Motor async driver)
- **Authentication:** JWT (JSON Web Tokens) — custom FastAPI implementation
- **Payments:** TBD (Stripe planned)
- **SMS:** Twilio (text-to-pay + voice telephony)
- **Email:** Mailgun (branded payment statements + reminders)
- **AI Voice Agent:** ElevenLabs (STT + TTS) + OpenAI GPT-4o (LLM) + Twilio Voice (telephony)

## Architecture Decisions
- **Separated frontend/backend** — Next.js (port 3000) + FastAPI (port 8000)
- MongoDB Atlas for database — use Motor (async) for Python
- JWT for auth — access tokens (15min) + refresh tokens (7 days)
- Three user roles: Patient, Provider, Admin
- FastAPI auto-generates OpenAPI docs at `/api/docs`
- Pydantic for request/response validation
- CORS configured for frontend ↔ backend communication

## Project Structure
```
app/                  → Next.js pages (App Router)
  login/              → Login pages (patient, admin, provider)
  pay/                → Patient payment pages
  dashboard/          → Provider dashboard pages
  admin/              → Admin dashboard pages
components/           → React components (marketing site sections)
public/               → Static assets (hero-bg.mp4, etc.)

backend/              → FastAPI Python backend
  app/
    main.py           → FastAPI app entry point
    core/
      config.py       → Settings (env vars, Pydantic)
      database.py     → MongoDB connection (Motor)
      security.py     → JWT + password hashing
      deps.py         → Auth dependencies (get_current_user, role checks)
    routers/
      auth.py         → /api/auth/* (register, login, refresh, me)
      bills.py        → /api/bills/* (CRUD + payment links)
      payments.py     → /api/payments/* (create, list, plans)
      patients.py     → /api/patients/* (CRUD + DOB verify)
      dashboard.py    → /api/dashboard/stats
    schemas/          → Pydantic request/response models
    services/         → Business logic (Stripe, Twilio, etc.)
  requirements.txt
  .env
```

## Key URLs
- GitHub: https://github.com/rdmi-stack/vitalpay
- Production domain: https://www.payvital.com (planned)

## Environment Variables Needed
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
SENDGRID_API_KEY=...
```

## Commands

### Frontend (Next.js)
- `npm run dev` — Start frontend dev server (port 3000)
- `npm run build` — Production build
- `npm run start` — Start production server

### Backend (FastAPI)
- `cd backend && source .venv/bin/activate` — Activate Python venv
- `uvicorn app.main:app --reload --port 8000` — Start backend dev server
- `http://localhost:8000/api/docs` — Swagger API docs
- `http://localhost:8000/api/health` — Health check endpoint

---

## Business Domain: How Healthcare Payment Platforms Work

### The Problem (Traditional Healthcare Billing)
1. Patient visits doctor
2. Insurance processes claim (takes 2-6 weeks)
3. Patient gets a paper statement in the mail (confusing, jargon-heavy)
4. Patient ignores it or doesn't understand it
5. Provider sends 2nd, 3rd statement (costs ~$0.50 each)
6. Patient maybe calls, waits on hold, pays by phone
7. Staff manually posts payment to the EMR
8. After 90-120 days unpaid → sent to collections (provider gets ~10-20 cents on the dollar)

**Result:** 50-60% collection rate, high admin costs, bad patient experience.

### Core Payment Workflow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  1. EMR/EHR  │────▶│  2. PayVital  │────▶│  3. Patient   │
│  sends bill  │     │  processes &  │     │  gets SMS/    │
│  data via    │     │  creates      │     │  email with   │
│  integration │     │  payment link │     │  secure link  │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                                  ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  6. Auto-    │◀────│  5. Payment   │◀────│  4. Patient   │
│  posted back │     │  processed    │     │  views bill & │
│  to EMR      │     │  (Stripe)     │     │  pays (2 min) │
└──────────────┘     └──────────────┘     └──────────────┘
```

### Step-by-Step Workflow

**Step 1: Bill Data Comes In (EMR Integration)**
- Provider's EMR (Epic, Cerner, etc.) sends patient balance data to PayVital via HL7/FHIR/API
- Includes: patient name, contact info, balance, service details, insurance adjustments

**Step 2: PayVital Processes & Personalizes**
- AI determines best channel (SMS vs email vs both)
- AI determines best time to send
- AI determines if patient qualifies for payment plan
- Creates a unique, secure payment link

**Step 3: Patient Gets Notified (Multi-Channel)**
- SMS: "Hi Sarah, you have a $245 bill from Valley Health. Tap to pay: pay.payvital.com/x7k"
- Email: Branded email with bill summary + pay button
- Paper: If digital fails, auto-generate and mail a statement
- Automated reminders: 3, 7, 14, 30 days if unpaid

**Step 4: Patient Pays (Under 2 Minutes)**
- Tap link → verify DOB → see bill → choose payment method → done
- Options: pay in full, payment plan (3/6/12 months), saved card, Apple Pay, HSA
- No app download, no account creation, no portal login

**Step 5: Payment Processed**
- Stripe handles the transaction
- PCI-compliant — PayVital never stores card numbers
- Instant confirmation to patient via SMS/email

**Step 6: Auto-Posted to EMR**
- Payment automatically reconciled in the provider's EMR
- Zero manual data entry by staff
- Real-time dashboard shows collections

---

## ROI & Revenue Impact

### Collection Rate Improvement

| Metric | Before PayVital | After PayVital |
|--------|----------------|----------------|
| Collection rate | 50-60% | 80-90% |
| Days to collect | 45-90 days | 7-15 days |
| Patient self-service | 10-20% | 70-85% |

### Example ROI (1,000 bills/month × $125 avg = $125K billable)
- Before: 50% collected = **$62,500**
- After: 85% collected = **$106,250**
- **+$43,750/month additional revenue**

### Cost Savings

| Cost Saved | How |
|------------|-----|
| Paper statements | $0.50/statement × 1,000 = $500/month eliminated |
| Staff hours | 3.4 min/bill manual processing → automated = ~56 hrs/month saved |
| Phone calls | Patients self-serve instead of calling billing dept |
| Collections agency | Less bad debt = less sent to collections (agencies take 25-50%) |

### Additional Benefits
- **Faster cash flow:** Money comes in days instead of months
- **Better patient retention:** 72% of patients say billing experience affects whether they return
- **Less bad debt:** Fewer accounts sent to collections

---

## Revenue Model (How PayVital Makes Money)

| Model | How It Works |
|-------|-------------|
| Per-transaction fee | 2.5-3.5% per payment processed |
| Monthly SaaS fee | $500-$5,000/month based on provider size |
| Per-statement fee | $0.25-$0.75 per digital statement sent |
| Setup/integration fee | $1,000-$10,000 one-time |
| Revenue share | % of additional revenue collected above baseline |

---

## Smart Features That Increase Collection Rates

1. **AI-optimized send times** — Send SMS at 10am Tuesday, not 2am Sunday
2. **Escalation sequences** — SMS → Email → Paper → Phone (automated)
3. **Propensity-to-pay scoring** — Predict who will pay, who needs a plan, who needs help
4. **Pre-visit estimates** — Tell patients cost before the appointment
5. **Payment plans auto-enrollment** — Don't let $2,000 bills scare people, offer $167/month
6. **Saved payment methods** — One-tap repeat payments across providers
7. **Real-time eligibility** — Check insurance before/during visit to reduce surprise bills

---

## Competitors

Key competitors and what they do:
- **Cedar** — AI-powered patient financial engagement, white-label experience
- **Waystar** — Full RCM platform with patient payments module
- **Collectly** — Patient billing & collections automation, strong in SMB
- **Inbox Health** — Patient billing communications & payments
- **RevSpring** — Multi-channel patient engagement & payments
- **VisitPay (R1 Entri)** — Patient payment & financing platform
- **InstaMed (J.P. Morgan)** — Healthcare payments network

### What Competitors Have That We Need
- HIPAA, SOC 2, PCI DSS, HITRUST compliance badges on the site
- "Book a Demo" form with fields: name, email, phone, org, EHR system
- Dedicated pages per vertical (Health Systems, Medical Groups, Specialty, etc.)
- Case studies with real metrics
- Security/Trust dedicated page
- Blog/Resources section for SEO
- Developer/API documentation

---

## Pending Work (Priority Order)

### Marketing Site Gaps
1. Contact/Demo booking form (lead capture)
2. Compliance & trust badges (HIPAA, SOC 2, PCI DSS)
3. "Who We Serve" dedicated sections per vertical
4. Real customer logos (replace placeholders)
5. 404 error page
6. Blog/Resources section
7. Security/Trust page
8. About page (full page, not just section)
9. Use Next.js `<Image>` instead of raw `<img>` tags
10. Google verification code in layout.tsx

### Backend (Not Started)
1. MongoDB Atlas connection (`/lib/mongodb.ts`)
2. Mongoose models — User, Patient, Provider, Bill, Payment, PaymentPlan
3. JWT auth — login, register, middleware, refresh tokens
4. API routes — `/api/auth/*`, `/api/bills/*`, `/api/payments/*`
5. Stripe integration for payment processing
6. Twilio integration for SMS (text-to-pay)
7. SendGrid integration for email statements
8. Patient portal — view bills, make payments, payment history
9. Provider dashboard — analytics, collections tracking, patient management
10. Admin dashboard — system analytics, user management, settings

### Database Models Needed
- **User** — email, password (hashed), role (patient/provider/admin), profile
- **Patient** — name, DOB, phone, email, linked providers, payment methods
- **Provider** — org name, NPI, EHR system, settings, branding
- **Bill** — patient, provider, amount, service details, insurance adj, status, due date
- **Payment** — bill, patient, amount, method, stripe ID, status, timestamp
- **PaymentPlan** — bill, patient, total, installments, frequency, status, next due
- **Statement** — bill, channel (sms/email/mail), sent at, opened, clicked, paid
- **AuditLog** — action, user, timestamp, details

### API Routes Needed
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
GET    /api/auth/me

GET    /api/bills              (provider: list bills, patient: my bills)
POST   /api/bills              (provider: create bill)
GET    /api/bills/:id
PATCH  /api/bills/:id

POST   /api/payments           (patient: make payment)
GET    /api/payments            (provider: list payments)
GET    /api/payments/:id

POST   /api/payment-plans      (patient: enroll in plan)
GET    /api/payment-plans/:id
PATCH  /api/payment-plans/:id

POST   /api/statements/send    (provider: send statement to patient)
GET    /api/statements          (provider: list sent statements)

GET    /api/dashboard/stats    (provider/admin: analytics)

POST   /api/webhooks/stripe    (Stripe payment webhooks)

POST   /api/voice/inbound      (Vapi/Retell webhook for inbound calls)
POST   /api/voice/outbound     (trigger outbound AI call to patient)
GET    /api/voice/calls         (list call history)
GET    /api/voice/calls/:id    (call details + transcript)
POST   /api/voice/campaigns    (create outbound reminder campaign)
```

---

## AI Voice Agent

### Overview
AI-powered voice agent that handles inbound patient billing calls and makes outbound payment reminder calls. Integrates with the payment platform to check balances, explain bills, take payments, and set up payment plans — all via phone.

### Two Types of Calls

**Inbound (Patient Calls Us)**
- Patient calls about a bill → AI answers instantly (zero hold time)
- Explains charges, insurance adjustments, what they owe and why
- Takes payment on the spot (PCI-compliant via DTMF/tokenization)
- Sets up payment plans within pre-configured rules
- Screens for financial assistance/charity care programs
- Handles disputes, escalates to human only when needed
- Available 24/7 — patients can call at 11pm or weekends

**Outbound (We Call the Patient)**
- Payment reminders at 3, 7, 14, 30, 60, 90 days before going to collections
- Pre-visit cost estimates before scheduled appointments
- Post-visit follow-up — "Did you receive your bill? Need help?"
- Payment plan check-ins for missed installments
- Can make thousands of calls/day vs 50-80 for a human agent

### Why It Increases Collections

| Factor | Impact |
|--------|--------|
| 24/7 availability | Captures payments from patients who can't call 9-5 |
| Zero hold time | Reduces 30% call abandonment rate |
| Massive outreach | 1000s of outbound calls/day vs 50-80 human calls |
| Consistent follow-up | AI never forgets the 60-day reminder call |
| Instant payment capture | Patient says "I'll pay" → processes on the spot |
| No judgment | Patients prefer discussing finances with AI (less embarrassment) |
| Multilingual | Spanish, Mandarin, etc. without bilingual staff |
| Payment plan offers | AI consistently offers plans — humans sometimes forget |

### ROI Metrics (Industry Benchmarks)

| Metric | Improvement |
|--------|-------------|
| Collection rate increase | +15-35% |
| Cost per call | $0.50-2 (AI) vs $5-12 (human) |
| Routine calls handled by AI | 60-85% |
| Days in A/R reduction | 5-15 days faster |
| Bad debt reduction | 10-25% |
| Staff reallocation | 20-40% of billing staff freed up |
| Payback period | 3-6 months |
| Patient satisfaction | Maintained or improved (+5-10 pts) |

### How It Helps Patients
1. No more hold times — instant answer
2. Bill explained clearly — AI walks through every line item patiently
3. Pay anytime — 11pm on a Sunday, no problem
4. No embarrassment — discussing inability to pay feels easier with AI
5. Multilingual — served in their preferred language
6. Immediate resolution — no "someone will call you back"
7. Financial assistance — AI screens for charity care/hardship programs automatically
8. SMS handoff — mid-call: "I just texted you a secure payment link if you prefer"

### Tech Architecture

```
Patient Phone Call
  → Telephony (Twilio Voice / SIP)
  → Voice AI Orchestrator (Vapi / Retell AI)
  → Speech-to-Text (Deepgram — sub-300ms latency)
  → LLM + RAG (Claude / GPT-4o + billing knowledge base from MongoDB)
  → Text-to-Speech (ElevenLabs — natural voice)
  → Action Layer (Stripe payment, MongoDB bill lookup, Twilio SMS link)
  → Back to Patient

Target round-trip latency: under 800ms for natural conversation
```

### Voice Agent Use Cases for PayVital

| Agent | What It Does |
|-------|-------------|
| Bill Inquiry Agent | "What do I owe?" → pulls from MongoDB, explains charges |
| Payment Agent | Takes card payment or sets up plan mid-call |
| Reminder Agent | Outbound calls at 3, 7, 14, 30 days for unpaid bills |
| Pre-visit Agent | Calls before appointment with cost estimate, collects deposit |
| Payment Plan Agent | Missed a payment? AI calls to reschedule |
| Financial Aid Agent | Screens patients for hardship/charity care programs |
| SMS Handoff Agent | Sends secure payment link via SMS during the call |

### Voice Agent Environment Variables
```
VAPI_API_KEY=...              (or RETELL_API_KEY)
DEEPGRAM_API_KEY=...
ELEVENLABS_API_KEY=...
OPENAI_API_KEY=...            (for GPT-4o, or use Claude)
TWILIO_VOICE_PHONE_NUMBER=... (dedicated voice number)
```

### Voice Agent Database Models

- **VoiceCall** — callId, patientId, direction (inbound/outbound), duration, transcript, outcome (paid/plan_setup/escalated/no_answer), paymentId, createdAt
- **VoiceCampaign** — name, type (reminder/previsit/followup), filters (days_overdue, amount_range), status (active/paused/completed), schedule, stats (total/completed/paid)
- **CallEscalation** — callId, reason, assignedTo, status, notes

### Voice Agent API Routes
```
POST   /api/voice/inbound       → Vapi/Retell webhook (handles incoming calls)
POST   /api/voice/outbound      → Trigger AI call to specific patient
GET    /api/voice/calls          → List call history with filters
GET    /api/voice/calls/:id     → Call details + full transcript
POST   /api/voice/campaigns     → Create outbound reminder campaign
GET    /api/voice/campaigns     → List campaigns with stats
PATCH  /api/voice/campaigns/:id → Pause/resume/cancel campaign
GET    /api/voice/analytics     → Call volume, outcomes, conversion rates
```

### Integration Points
- **MongoDB** — Agent queries patient bills, balances, payment history in real-time during calls
- **Stripe** — Agent processes payments via secure tokenization (DTMF capture, never stores card data)
- **Twilio** — Telephony backbone + SMS handoff for payment links mid-call
- **EMR** — Auto-posts payments back after voice-collected payments (same flow as digital)

### Compliance Requirements
- HIPAA BAA with all voice AI vendors (Vapi/Retell, Deepgram, ElevenLabs)
- PCI DSS — audio stream bifurcated during card capture, AI never hears/stores card numbers
- Call recording consent — two-party consent states require notification in greeting
- Full audit logging — every call transcribed and stored for compliance
- PHI encryption in transit and at rest

---

## ClaimPilot — AI Denial Recovery Engine (Future Add-on)

### Overview
ClaimPilot is an AI-powered claim denial recovery system that can be integrated into PayVital. Instead of just collecting patient payments, PayVital becomes a **full AI Revenue Cycle Engine** — recovering denied insurance claims AND accelerating patient payments.

### Positioning
NOT "AI tool" or "billing automation" — sell as:
**"We increase your collections by 20-40% using AI-powered revenue automation"**

### The Problem
- ~11-12% of all healthcare claims are denied initially
- 41% of providers report ≥10% denial rate
- Billing teams make tens of millions of insurance calls weekly, averaging 25 min each
- Practices lose ~8.4% of revenue to denials annually
- A mid-size hospital can lose $500K+ annually due to denials

### Three-Engine Architecture

**Engine 1: Recovery (ClaimPilot Core)**
- AI detects denied/delayed claims
- AI decides next action (refile, appeal, call payer)
- AI agent makes follow-up calls to payers
- AI drafts appeal packets
- AI queues exceptions for humans only when needed

**Engine 2: Acceleration (PayVital Core)**
- Patient payment reminders (SMS, email, voice)
- Fast payment UX (2-min pay flow)
- Payment plans auto-enrollment
- Multi-channel outreach

**Engine 3: Prevention (Intelligence Layer)**
- Predict denial risk before submission
- Suggest coding/documentation fixes
- Revenue leakage dashboard
- Real-time eligibility checks

### Market Size (2026-27)

| Segment | Total Count | Need This | % Using AI Today |
|---------|------------|-----------|-----------------|
| Mid-large clinics | 40-50K | ~90% | ~14% |
| Billing companies | ~10K | ~95% | ~14% |
| Hospitals | ~6K | ~100% | ~14% |
| **Total high-value prospects** | **~50-70K** | | **86% NOT using AI** |

**Denial management market:** $5.1B (2024) → $8.9B by 2030

### Competitive Landscape

**Existing players (old generation — dashboards/tools):**
- Waystar — appeals + partial automation
- Experian Health — predictive denial tools
- Rivet Health — AI denial analysis
- Cofactor AI — appeal automation

**New AI startups (YC-backed):**
- LunaBill — billing/insurance call automation
- Aegis — workflow automation
- Taxo — coding automation
- Intelliga Health — insurance workflows

**Our differentiation:** Existing tools analyze/categorize denials but don't autonomously chase them. We go from "tool" → "autonomous agent system" that replaces 70% of manual claim follow-ups.

### Revenue Model (for $12M ARR target)

**Pricing structure:**
- Base: $3K-$5K/month
- + 10-20% of recovered revenue
- Example: Recover $500K/year → earn $50K-$100K from one client

**Target mix for $12M ARR:**

| Segment | Avg Monthly | Clients Needed | Monthly Revenue |
|---------|------------|----------------|----------------|
| Billing companies | $15K | 20 | $300K |
| Clinics (mid-large) | $5K | 50 | $250K |
| Hospitals | $25K | 10 | $250K |
| **Total** | | **80** | **$800K → ~$10M ARR** |

Add performance fees → $12M+ ARR achievable

---

## Customer Acquisition Plan

### Core Offer (High Conversion)
**Entry hook:** "Free audit of your denied claims (last 90 days)"
- Show $ lost and % recoverable
- Convert to paid engagement

### Acquisition Channels

**1. Cold Email (Primary Scale Engine)**
- Target: US healthcare practices, billing companies, MSOs
- Volume: 500-2,000 emails/day
- Angle: "We found revenue you're losing"
- Expected: 2-5% reply rate, 1-2% calls booked
- At 1,000/day = 10-20 calls/day

**2. Google Search Ads (High Intent)**
- Keywords: "denied claims help", "medical billing denial management", "insurance claim appeal service"
- Target: USA only
- CPC: $5-$25
- Expected: 5-10 quality leads/day

**3. LinkedIn Outreach**
- Target: Revenue Cycle Managers, Practice Owners, CFOs
- Message: "We help recover denied insurance claims using AI — typically 20-30% recovery uplift"

**4. Partners (Most Powerful)**
- Partner with billing companies, RCM consultants
- Revenue share: 20-30%
- 1 partner = 10-50 clients (multiplication effect)

**5. Case Study Loop (Critical after first 5 clients)**
- Build proof: "Recovered $120K in 60 days"
- Use for all channels — this alone closes $20K/month deals

### Sales Funnel
1. Cold outreach → free audit
2. ROI projection showing $ lost
3. Proposal with base + performance pricing
4. Close

### Yearly Projection (Aggressive)

| Period | New Clients/Month | Cumulative |
|--------|------------------|-----------|
| Month 1-2 | 10-20 | 20-40 |
| Month 3-6 | 30-50 | 110-240 |
| Month 6-12 | 50-100 | 410-840 |

### Sales Strategy
- Do NOT demo product → instead ask: monthly billing volume, denial rate, then show "You're losing $X/month"
- Do NOT sell AI → sell revenue recovery outcomes
- Do NOT target small clinics → focus on entities handling large claim volume

### Focus Strategy (Critical)

**Phase 1 (Month 1-3):** 1 specialty + 1 denial type + 1 payer cluster
**Phase 2 (Month 3-6):** Expand to multi-specialty, add payment acceleration
**Phase 3 (Month 6-12):** Full AI RCM platform

### Geographic Strategy
- **USA = Primary** (high ticket, high pain, high willingness to pay)
- **India = Secondary/experimental** (problem exists but monetization is weaker for small clinics; target hospitals, TPAs, and HealthTech platforms if entering)

### MVP Scope (2-4 weeks)
- Focus on one payer workflow, one specialty, one denial class
- Automate: call prep, note capture, appeal draft generation
- Before full autonomy: human-in-the-loop for QA

---

## Development Plan — 6 Phases (16 Weeks)

### Current State (as of March 2026)

| Area | Status | % Done |
|------|--------|--------|
| Marketing site (15 components) | Complete | 90% |
| Login pages (UI only) | No auth logic | 20% |
| Database (MongoDB) | Not started | 0% |
| Authentication (JWT) | Not started | 0% |
| API routes | Not started | 0% |
| Patient portal | Not started | 0% |
| Provider dashboard | Not started | 0% |
| Admin dashboard | Not started | 0% |
| Stripe payments | Not started | 0% |
| SMS/Email (Twilio/SendGrid) | Not started | 0% |
| AI Voice Agent | Not started | 0% |
| ClaimPilot (denial recovery) | Not started | 0% |
| SEO/Sitemap/Robots | Done | 100% |

**Overall: ~15% complete**

### Phase 1: Foundation — DB + Auth (Week 1-2)

**Goal:** MongoDB connection, Mongoose models, JWT auth, working login

**Files to create:**
- `lib/mongodb.ts` — MongoDB Atlas connection with caching
- `lib/auth.ts` — JWT sign, verify, refresh, cookie helpers
- `middleware.ts` — Route protection middleware
- `models/User.ts` — email, passwordHash, role, profile
- `models/Patient.ts` — name, DOB, phone, email, linkedProviders
- `models/Provider.ts` — orgName, NPI, ehrSystem, settings, branding
- `models/Bill.ts` — patient, provider, amount, serviceDetails, insuranceAdj, status, dueDate
- `models/Payment.ts` — bill, patient, amount, method, stripeId, status
- `models/PaymentPlan.ts` — bill, patient, total, installments, frequency, status
- `models/Statement.ts` — bill, channel, sentAt, opened, clicked, paid
- `models/AuditLog.ts` — action, user, timestamp, details
- `app/api/auth/register/route.ts`
- `app/api/auth/login/route.ts`
- `app/api/auth/refresh/route.ts`
- `app/api/auth/me/route.ts`
- `.env.example`

**Packages:** `mongoose`, `bcryptjs`, `jsonwebtoken`, `@types/jsonwebtoken`, `@types/bcryptjs`

**Cleanup:** Delete legacy `js/main.js`, `css/styles.css`, `index.html`

### Phase 2: Patient Payment Flow — MVP (Week 3-4)

**Goal:** The core product — patient receives link, verifies DOB, sees bill, pays with Stripe

**Files to create:**
- `lib/stripe.ts` — Stripe client, payment intent, webhook helpers
- `app/api/bills/route.ts` — List/create bills
- `app/api/bills/[id]/route.ts` — Get/update bill
- `app/api/payments/route.ts` — Create/list payments
- `app/api/payments/[id]/route.ts` — Get payment
- `app/api/payment-plans/route.ts` — Create/list plans
- `app/api/payment-plans/[id]/route.ts` — Get/update plan
- `app/api/webhooks/stripe/route.ts` — Stripe webhook handler
- `app/pay/[code]/page.tsx` — Magic payment link page (DOB verify → bill view → pay)

**Packages:** `stripe`

**After Phase 2:** Working MVP — can demo to prospects and start onboarding

### Phase 3: Provider Dashboard (Week 5-6)

**Goal:** Providers manage bills, send statements, track collections

**Files to create:**
- `app/dashboard/layout.tsx` — Dashboard shell (sidebar + header)
- `app/dashboard/page.tsx` — Stats overview (collections, revenue, trends)
- `app/dashboard/bills/page.tsx` — Bills management (list, create, edit)
- `app/dashboard/payments/page.tsx` — Payment tracking
- `app/dashboard/patients/page.tsx` — Patient list
- `app/dashboard/statements/page.tsx` — Statement tracking
- `app/dashboard/plans/page.tsx` — Payment plan management
- `app/api/dashboard/stats/route.ts` — Analytics API
- `app/api/statements/send/route.ts` — Send SMS/email statements
- `lib/twilio.ts` — Twilio SMS client
- `lib/sendgrid.ts` — SendGrid email client

**Packages:** `twilio`, `@sendgrid/mail`

### Phase 4: Admin Dashboard + Marketing Gaps (Week 7-8)

**Goal:** Admin controls + complete marketing site

**Files to create:**
- `app/admin/page.tsx` — System-wide analytics
- `app/admin/users/page.tsx` — User management
- `app/admin/providers/page.tsx` — Provider management
- `app/admin/settings/page.tsx` — System settings
- `app/admin/audit/page.tsx` — Audit log viewer
- `app/not-found.tsx` — 404 page
- `app/security/page.tsx` — Security/Trust page
- `app/about/page.tsx` — Full about page

**Marketing updates:**
- Contact/Demo booking form (real form submission + API)
- Compliance badges (HIPAA, SOC 2, PCI DSS) in Hero/Footer
- Replace `<img>` with Next.js `<Image>` across all components
- Google verification code in layout.tsx

### Phase 5: AI Voice Agent (Week 9-11)

**Goal:** Inbound + outbound AI voice calls for billing

**Files to create:**
- `models/VoiceCall.ts` — callId, patientId, direction, duration, transcript, outcome
- `models/VoiceCampaign.ts` — name, type, filters, status, schedule, stats
- `models/CallEscalation.ts` — callId, reason, assignedTo, status
- `lib/voice-ai.ts` — Vapi/Retell orchestration + LLM integration
- `app/api/voice/inbound/route.ts` — Vapi/Retell webhook
- `app/api/voice/outbound/route.ts` — Trigger AI call
- `app/api/voice/calls/route.ts` — Call history
- `app/api/voice/calls/[id]/route.ts` — Call details + transcript
- `app/api/voice/campaigns/route.ts` — Campaign CRUD
- `app/api/voice/campaigns/[id]/route.ts` — Update campaign
- `app/api/voice/analytics/route.ts` — Call analytics
- `app/dashboard/voice/page.tsx` — Voice dashboard UI
- `app/dashboard/voice/campaigns/page.tsx` — Campaign management UI

**Packages:** `@vapi-ai/server-sdk` (or `retell-sdk`), `@deepgram/sdk`

### Phase 6: ClaimPilot + Production (Week 12-16)

**Goal:** Denial recovery engine + production hardening

**Files to create:**
- `models/Claim.ts` — claimId, payer, amount, status, denialReason, filedAt
- `models/Denial.ts` — claimId, reason, category, actionTaken, recoveredAmount
- `models/Appeal.ts` — denialId, content, submittedAt, outcome
- `lib/claimpilot/denial-detector.ts` — AI denial detection agent
- `lib/claimpilot/appeal-generator.ts` — AI appeal letter generator (LLM)
- `lib/claimpilot/payer-caller.ts` — AI outbound calls to payers
- `app/api/claims/route.ts` — Claim status tracking
- `app/api/claims/analytics/route.ts` — Denial analytics
- `app/dashboard/claims/page.tsx` — Recovery dashboard UI
- `app/error.tsx` — Error boundary
- `app/global-error.tsx` — Global error boundary
- `lib/rate-limit.ts` — API rate limiting
- `.github/workflows/deploy.yml` — CI/CD pipeline
- `vercel.json` — Deployment config

**Packages:** `zod` (validation), `@sentry/nextjs` (monitoring), `jest`, `@playwright/test`

### Timeline Summary

```
Week 1-2    ██████████  Phase 1: DB + Auth + Models
Week 3-4    ██████████  Phase 2: Patient Payment Flow (MVP!)
Week 5-6    ██████████  Phase 3: Provider Dashboard
Week 7-8    ██████████  Phase 4: Admin + Marketing Gaps
Week 9-11   ██████████  Phase 5: AI Voice Agent
Week 12-16  ██████████  Phase 6: ClaimPilot + Production
```

**Milestones:**
- After Week 4: Working MVP — can demo to prospects
- After Week 6: Can onboard real providers
- After Week 11: Full AI-powered platform
- After Week 16: Complete revenue cycle engine ready for scale

---

## Competitor Benchmarks — Healthcare Payment Platforms

### Public Companies (Verified Revenue)

| Company | Revenue | Clients | Valuation | Key Metric |
|---------|---------|---------|-----------|------------|
| **Waystar** | **$1.1B** (FY2025), guiding $1.27-1.29B for 2026 | **30,000** clients, 1M+ providers | Public (NYSE: WAY) | 7.5B transactions/year, $2.4T in claims |
| **Phreesia** | **$481M** (FY2026) | **4,658** avg clients | Public (NYSE: PHR) | $4B+ patient payments processed, $27K rev/client |
| **Flywire** | **$158M** Q4 2025 alone (34% growth) | **4,000+** clients globally | Public (NASDAQ: FLYW) | 750 new wins in 2025, <1% churn |

### Private Companies (Estimated)

| Company | Funding Raised | Clients | Valuation | Key Metric |
|---------|---------------|---------|-----------|------------|
| **Cedar** | **$622M** total | Serves **50M patients** | **$3.2B** (2021 Series D) | 828 employees, AI voice agent "Kora" |
| **InstaMed** (J.P. Morgan) | Acquired for **$500M+** (2019) | **50%+ of US providers** | Part of JPM | $94B+ payments processed |
| **RevSpring** | **$967M** raised, acquired by Frazier Healthcare (2024) | Undisclosed | PE-backed | 1.5B communications, $8B payment volume/year |
| **Collectly** | **$34M** (Series A) | **3,000+ facilities** | Undisclosed | 35% increase in collections, Y Combinator backed |
| **Inbox Health** | **$55M** total | **3,500+ practices**, 2.8M patients/year | Undisclosed | 230% revenue growth in 3 years, 60% faster collections |
| **PayZen** | **$220M equity + $200M debt** | Largest in category | **$200M+** valuation | Best in KLAS 2026, 3x revenue growth 3 years running |

### Revenue Per Client Benchmarks

| Company | Clients | Revenue | Rev/Client |
|---------|---------|---------|------------|
| Phreesia | 4,658 | $481M | **$103K/year** |
| Waystar | 30,000 | $1.1B | **$37K/year** |
| Collectly | 3,000 | Est. ~$15-20M | **$5-8K/year** |
| Inbox Health | 3,500 | $12M (confirmed 2024) | **$3-4K/year** |

---

## ARR Projections — PayVital

### ARR at 100 Clients

**Revenue Streams:**

| Stream | Calculation | Annual |
|--------|------------|--------|
| SaaS fees | 100 clients × ~$2,500/mo avg | $3,000,000 |
| Transaction fees (3%) | ~$146M processed × 3% | $4,392,000 |
| Statement fees ($0.50) | ~2.2M statements/year | $1,326,000 |
| **Total ARR** | | **$8,718,000** |

**Client Mix (100 clients):**

| Segment | Clients | Monthly Fee | Monthly Rev |
|---------|---------|-------------|-------------|
| Small clinics (<500 bills/mo) | 40 | $500 | $20,000 |
| Mid-size practices (1K-5K bills/mo) | 40 | $2,000 | $80,000 |
| Large practices / hospitals | 15 | $5,000 | $75,000 |
| Billing companies | 5 | $15,000 | $75,000 |
| **Total** | **100** | | **$250,000/mo** |

**With Add-ons (Voice Agent + ClaimPilot):**

| Scenario | ARR |
|----------|-----|
| Core platform only | **$8.7M** |
| Core + add-ons | **$11.2M** |
| Aggressive (more enterprise clients) | **$15M+** |

### ARR at 1,000 Clients

| Stream | Annual |
|--------|--------|
| SaaS fees (1,000 × ~$2,500/mo avg) | $30,000,000 |
| Transaction fees (3%) | $44,000,000 |
| Statement fees | $13,000,000 |
| **Total ARR** | **$87,000,000** |

With Voice Agent + ClaimPilot add-ons: **$100-110M ARR**

**Clients needed for $1B ARR:**

| Segment | Clients | Avg Annual Rev | Total |
|---------|---------|----------------|-------|
| Small clinics | 3,000 | $50K | $150M |
| Mid practices | 4,000 | $100K | $400M |
| Large / hospitals | 500 | $300K | $150M |
| Billing companies | 200 | $500K | $100M |
| ClaimPilot add-on | 2,000 | $100K | $200M |
| **Total** | **~10,000** | | **$1B** |

US has 50,000-70,000 high-value healthcare prospects — $1B ARR = ~15-20% market share.

---

## Founder Payout Analysis — Competitors

### Typical Founder Dilution After Funding

| Stage | Dilution | Founder Ownership After |
|-------|----------|------------------------|
| Start | 0% | 100% (split among co-founders) |
| Seed / YC | 15-20% | ~80% |
| Series A | 20-25% | ~60% |
| Series B | 15-20% | ~48% |
| ESOP (employee pool) | 10-15% | ~38-42% |

### Collectly — Founders: Levon Brutyan & Max Mizotin

| Metric | Value |
|--------|-------|
| Total raised | $34M (Seed + Series A) |
| Clients | 3,000+ facilities |
| Revenue | Est. ~$15-20M ARR |
| Estimated valuation | **$150-200M** (8-10x revenue) |
| Founders combined stake (est.) | ~35-45% |
| **Founder payout (combined)** | **$52M - $90M** |
| **Per founder (2 co-founders)** | **$26M - $45M each** |

### Inbox Health — Founders: Blake Walker, Erroin Martin, Chris Walker, Simon Kaluza

| Metric | Value |
|--------|-------|
| Total raised | $55M (equity + debt) |
| Clients | 3,500+ practices |
| Revenue | **$12M ARR** (confirmed 2024) |
| Estimated valuation | **$100-200M** (8-12x revenue, 230% growth) |
| Founders combined stake (est.) | ~25-35% (4 founders) |
| **Founder payout (combined)** | **$25M - $52M** |
| **Per founder (4 co-founders)** | **$6M - $18M each** |

### PayZen — Founders: Itzik Cohen, Ariel Rosenthal, Tobias Mezger

| Metric | Value |
|--------|-------|
| Total raised | **$220M equity + $200M+ debt** |
| Valuation | **$300-500M** (3x annual growth) |
| Revenue | Est. ~$30-50M ARR |
| Founders combined stake (est.) | ~20-30% (Series B) |
| **Founder payout (combined)** | **$60M - $150M** |
| **Per founder (3 co-founders)** | **$20M - $50M each** |

---

## PayVital Founder Payout Projections (Sole Founder)

### At 100 Clients (~$8.7M ARR)

| Scenario | Ownership | Valuation | Payout |
|----------|-----------|-----------|--------|
| Bootstrapped | 100% | $70M | **$70M (₹595 Cr)** |
| Seed only | ~75% | $80M | **$60M (₹510 Cr)** |
| Seed + Series A | ~55% | $100M | **$55M (₹468 Cr)** |

### At 1,000 Clients (~$87M ARR)

| Scenario | Ownership | Valuation | Payout | In INR |
|----------|-----------|-----------|--------|--------|
| Bootstrapped | 100% | $700M | **$700M** | **₹5,950 Cr** |
| Seed only | ~75% | $800M | **$600M** | **₹5,100 Cr** |
| Seed + Series A | ~55% | $1B | **$550M** | **₹4,675 Cr** |
| Seed + A + B | ~40% | $1.2B | **$480M** | **₹4,080 Cr** |
| Seed + A + B + C | ~30% | $1.3B | **$390M** | **₹3,315 Cr** |

### At $1B ARR (~10,000 Clients) — 50% Ownership After Funding

| Multiple | Valuation | 50% Stake | After Tax (20% LTCG) | In INR |
|----------|-----------|-----------|----------------------|--------|
| 10x | $10B | $5B | **$4B** | **₹34,000 Cr** |
| 15x | $15B | $7.5B | **$6B** | **₹51,000 Cr** |
| 20x | $20B | $10B | **$8B** | **₹68,000 Cr** |

**At $1B ARR with 50% ownership — founder payout: ₹34,000 - 68,000 Crore ($4B-$8B)**

Comparable Indian founders at this level:
- Shiv Nadar (HCL): ~₹85,000 Cr
- Nithin Kamath (Zerodha): ~₹25,000 Cr
- Girish Mathrubootham (Freshworks): ~₹8,500 Cr
- Bhavish Aggarwal (Ola): ~₹10,000 Cr

---

## Key Market Insights

- **Total addressable market:** $5.1B (2024) → $8.9B by 2030 (denial management alone)
- **86% of healthcare orgs NOT using AI** for billing/collections — massive greenfield
- **Phreesia benchmark:** 4,658 clients = $481M revenue = $103K/client/year
- **Waystar benchmark:** 30,000 clients = $1.1B revenue, 42% EBITDA margin
- **Closest comps (Collectly/Inbox Health):** 3,000-3,500 clients, $34-55M raised
- **PayVital differentiator:** AI Voice Agent + ClaimPilot denial recovery — Cedar just launched "Kora" (AI voice), proving market demand
- **Revenue per client sweet spot:** $50K-$100K/year for mid-to-large clients
- **Path to $1B ARR:** ~10,000 clients = ~15-20% of US market

---

## PayVital — Plan to Dominate Healthcare Payments

### The Core Philosophy

**Product First** = Build something so good that providers HAVE to tell other providers about it.
**ROI First** = Every feature, every conversation, every metric leads with dollars recovered.

---

### PHASE 1: THE WEDGE (Month 1-3) — Pick One Fight and Win It

#### The #1 Mistake Startups Make
They try to be everything for everyone. Cedar has 828 employees and has penetrated only **1% of the market**. You don't need to beat Cedar — you need to **own one slice** they're ignoring.

#### Your Wedge: AI Voice + SMS Collections for Mid-Size Practices (50-200 providers)

Why this wedge:
- Cedar/Waystar focus on **large health systems** (500+ beds)
- Collectly/Inbox Health focus on **small practices** (1-20 providers)
- **Mid-size practices (50-200 providers)** are underserved — too big for simple tools, too small for Cedar's $100K+ contracts
- They have **real pain**: $500K-$2M/year in uncollected patient balances
- AI voice agents market is growing at **37.85% CAGR** — valued at $650M in 2026, projected $11.7B by 2035
- **80% of healthcare providers** will invest in conversational AI by 2026 (Gartner)
- Nobody is combining **AI Voice + SMS + Payment Link** in one product for this segment

#### Product: Build 3 Things Only

```
┌─────────────────────────────────────────────────┐
│           PayVital MVP (3 Features)              │
│                                                  │
│  1. TEXT-TO-PAY                                  │
│     Patient gets SMS → taps link → pays in 2min │
│     (This is your foot in the door)              │
│                                                  │
│  2. AI VOICE REMINDER                            │
│     Automated outbound calls at 3/7/14/30 days  │
│     "Hi Sarah, you have a $245 balance..."      │
│     Takes payment on the spot or sends SMS link  │
│     (This is your differentiator)                │
│                                                  │
│  3. ROI DASHBOARD                                │
│     Real-time: $ collected, days-to-pay,         │
│     collection rate, before/after comparison     │
│     (This is what makes them stay & tell others) │
└─────────────────────────────────────────────────┘
```

#### Why NOT build everything:
- Collectly built 20+ EHR integrations to reach 3,000 clients — took **7 years**
- Inbox Health built full billing suite to reach 3,500 — took **7 years** and **$55M**
- You can reach **100 clients in 6 months** with just the wedge

---

### PHASE 2: THE FREE TOOL (Month 1-2) — Product-Led Lead Generation

#### The Trojan Horse: Free Collections Health Check

Build a **free, no-login tool** on payvital.com that any practice can use:

```
┌─────────────────────────────────────────────┐
│     FREE COLLECTIONS HEALTH CHECK            │
│                                              │
│  Enter your numbers:                         │
│  ┌──────────────────────────────────────┐   │
│  │ Monthly patient bills:    [1,000   ] │   │
│  │ Average bill amount:      [$125    ] │   │
│  │ Current collection rate:  [55%     ] │   │
│  │ Avg days to collect:      [65 days ] │   │
│  │ Staff handling billing:   [3       ] │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  YOUR RESULTS:                               │
│  ┌──────────────────────────────────────┐   │
│  │ Revenue you're LOSING: $56,250/mo    │   │
│  │ Staff cost on billing:  $12,500/mo   │   │
│  │ With PayVital:                        │   │
│  │   → Collection rate: 85%             │   │
│  │   → Additional revenue: $37,500/mo   │   │
│  │   → Staff hours saved: 120hrs/mo     │   │
│  │                                       │   │
│  │ GET FULL REPORT (enter email)         │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  [Book Free Demo →]                          │
└─────────────────────────────────────────────┘
```

**Enhance existing Calculator.tsx to:**
1. Generate a **downloadable PDF report** with their practice name
2. **Gate the full report** behind email capture
3. Auto-trigger a **personalized follow-up email** showing their specific $ lost
4. Include a **"Share with your CFO"** button (PDF with ROI projections)

This is how CERTIFY Health and Accuity convert — free audit → show the bleeding → close the deal.

#### Additional Free Tools (build over time):
- **Denial Rate Benchmarker** — "How does your denial rate compare to practices your size?"
- **Text-to-Pay Demo** — Let them send a test payment link to themselves
- **AI Voice Demo** — Let them hear a sample collection call with AI

---

### PHASE 3: DISTRIBUTION CHANNELS (Month 2-6) — Get to 100 Clients

#### Channel 1: EHR Marketplace Listings (THE MULTIPLIER)

This is how Collectly reached 3,000 facilities. They listed on **20+ EHR marketplaces**.

**Priority EHR marketplaces to list on:**

| EHR | Market | Why |
|-----|--------|-----|
| **athenahealth Marketplace** | 160K+ providers | Open API, **800+ endpoints**, easy to list, mid-market focus |
| **Epic App Market** | 700+ hospitals, 300M+ patients | Hardest to get into but highest value per client |
| **ModMed (Modernizing Medicine)** | Specialty practices | Less competition, specialty-focused |
| **eClinicalWorks** | 150K+ physicians | Large SMB base |
| **DrChrono** | 30K+ providers | API-friendly, easy integration |
| **Greenway Health** | 100K+ providers | Already lists InstaMed as partner |

**Why this works:**
- athenahealth Marketplace gives you **co-branded collateral + marketing templates + targeted distribution**
- Epic App Market listing = **de facto endorsement** that closes enterprise deals
- Each listing = free distribution to thousands of practices already looking for billing solutions

#### Channel 2: Billing Company Partnerships (THE MULTIPLIER x10)

**1 billing company = 50-200 practices**

| Target | Reach | Approach |
|--------|-------|----------|
| Top 50 RCM companies | 10,000+ practices | Revenue share (20-30%) — they white-label PayVital |
| Regional billing companies | 1,000-5,000 practices | Co-selling — they recommend, you close |
| Medical billing consultants | 100-500 practices | Referral fee ($500-$1,000 per client) |

**How Collectly did it:** They just acquired **Pledge Health** (March 2026) to accelerate AI automation — proving that partnerships and acquisitions are key growth levers.

#### Channel 3: Cold Outreach (THE GRIND)

| Channel | Volume | Expected |
|---------|--------|----------|
| Cold email | 500-1,000/day | 2-5% reply, 1-2% book calls |
| LinkedIn outreach | 50-100/day | Target: Revenue Cycle Managers, Practice Admins, CFOs |
| Google Ads | $50-$100/day | Keywords: "patient billing software", "text to pay healthcare" |

**The email that converts:**

> Subject: You're leaving $[X]/month on the table
>
> Hi [Name],
>
> I ran a quick analysis on practices your size ([specialty], [X] providers).
>
> The average practice like yours collects 55% of patient balances and takes 65+ days.
>
> We helped [similar practice] go from 55% → 87% collection rate in 30 days using AI-powered text-to-pay + voice reminders.
>
> That's an extra $[X]/month in revenue you're currently writing off.
>
> Want me to run a free 5-minute audit on your numbers?
>
> — [Your name], PayVital

#### Channel 4: The "No-Risk Pilot" (CONVERSION KILLER)

Stolen from **Accuity's playbook** — every provider who did their 60-day pilot continued as a paying customer (100% conversion).

```
┌─────────────────────────────────────────────────┐
│          30-DAY FREE PILOT PROGRAM               │
│                                                  │
│  ✓ We send AI text-to-pay links to 500 of       │
│    your patients with outstanding balances        │
│                                                  │
│  ✓ AI voice agent makes outbound reminder calls  │
│                                                  │
│  ✓ You pay $0 until you see results              │
│                                                  │
│  ✓ If we don't increase your collections by      │
│    at least 20%, you walk away — no charge        │
│                                                  │
│  WHAT WE NEED:                                   │
│  → Patient list (name, phone, balance, DOB)       │
│  → 30 minutes for setup                           │
│  → That's it                                      │
│                                                  │
│  [Start Free Pilot →]                             │
└─────────────────────────────────────────────────┘
```

**Why this works:**
- Zero risk for the practice
- You prove ROI before they pay
- After 30 days they've collected $20K-$50K extra — now they CAN'T leave
- **ENTER health** reports full ROI in under 2 days — aim for that

---

### PHASE 4: PRODUCT MOAT (Month 3-9) — Make Switching Impossible

#### Moat 1: Data Network Effect

Every payment processed makes your AI smarter:
- **Best time to send SMS** per patient demographic
- **Best voice script** per balance range and age
- **Propensity-to-pay scoring** — predict who pays, who needs a plan, who to skip
- After 10,000 patients, no competitor can match your conversion data

#### Moat 2: EHR Integration Depth

| Level | What | Switching Cost |
|-------|------|----------------|
| Level 1 | CSV upload (day 1) | Low — anyone can do this |
| Level 2 | API integration with 5 EHRs | Medium — takes weeks to replicate |
| Level 3 | Real-time bi-directional sync (auto-post payments back) | **High — takes months to replicate** |
| Level 4 | Listed in EHR marketplaces | **Very high — competitors need 6-12 months** |

#### Moat 3: AI Voice Agent Quality

- Train on **10,000+ real billing conversations**
- Build specialty-specific scripts (orthopedics ≠ dermatology ≠ cardiology)
- Sub-800ms response latency (better than human)
- **Multilingual** — Spanish, Mandarin, Hindi (instant market expansion)
- This is your **#1 differentiator** — Cedar just launched "Kora" proving demand

#### Moat 4: Compliance Certifications

| Certification | What | Timeline |
|---------------|------|----------|
| **HIPAA** | Required for healthcare data | Month 1 (day 1 priority) |
| **PCI DSS** | Required for payment processing | Month 2-3 (via Stripe) |
| **SOC 2 Type II** | Trust signal for enterprise | Month 6-9 |
| **HITRUST** | Gold standard in healthcare | Month 12+ |

Every certification = a **barrier to entry** for new competitors.

---

### PHASE 5: EXPANSION (Month 6-12) — Win, Expand, Extend

This follows the proven **Vertical SaaS playbook** used by Epic, Toast, and Procore.

```
WIN (Month 1-6)
  → Text-to-Pay + AI Voice for mid-size practices
  → 100 clients, $8.7M ARR

EXPAND (Month 6-12)
  → Add ClaimPilot (denial recovery) — upsell to existing clients
  → Add Provider Dashboard analytics
  → Enter large health systems (500+ beds)
  → 500 clients, $40M ARR

EXTEND (Month 12-24)
  → Full AI RCM platform (billing + collections + denials + voice)
  → EHR integration marketplace (become infrastructure)
  → White-label for billing companies
  → 2,000+ clients, $150M+ ARR
```

#### Expansion Revenue Per Client

| Year | Products | Rev/Client | Clients | ARR |
|------|----------|------------|---------|-----|
| Year 1 | Text-to-Pay + Voice | $87K | 100 | $8.7M |
| Year 2 | + ClaimPilot + Dashboard | $140K | 500 | $70M |
| Year 3 | + Full RCM + White-label | $200K | 2,000 | $400M |
| Year 5 | Full platform | $150K avg | 5,000 | $750M |
| Year 7 | Market leader | $120K avg | 10,000 | $1.2B |

---

### PHASE 6: DOMINATION MOVES (Month 12+)

#### Move 1: Acquire Competitors
- Buy smaller players (like Collectly acquired Pledge Health in March 2026)
- Target: Companies with 500-2,000 clients but weak AI/voice capabilities
- Cost: $20-50M per acquisition = instant client base

#### Move 2: Become the Infrastructure
- Open **PayVital API** for other healthcare apps to process payments through you
- Like Stripe is to e-commerce, PayVital becomes to healthcare payments
- Every transaction = revenue even from competitors' clients

#### Move 3: International Expansion
- **UK (NHS)** — single-payer but growing private pay market
- **India** — massive hospital chains (Apollo, Fortis, Max) need modern billing
- **Middle East (UAE/Saudi)** — healthcare spending boom, greenfield market

#### Move 4: Adjacent Products
- **Pre-visit cost estimator** — tell patients what they'll owe before the visit
- **Patient financing** (compete with PayZen) — "Care now, pay later"
- **AI coding assistant** — prevent denials before claims are submitted

---

### EXECUTION TIMELINE

```
Month 1    ████  Ship MVP (Text-to-Pay + AI Voice + Dashboard)
Month 2    ████  Launch free ROI tool, start cold outreach
Month 3    ████  First 10 paying clients, apply to athenahealth Marketplace
Month 4    ████  30-day pilot program live, first case study
Month 5    ████  First billing company partnership (1 partner = 50 clients)
Month 6    ████  100 clients, $8.7M ARR run rate
Month 7    ████  Launch ClaimPilot, upsell existing clients
Month 9    ████  Listed on 5+ EHR marketplaces
Month 12   ████  500 clients, $40M+ ARR, raise Series A
Month 18   ████  2,000 clients, SOC 2 certified
Month 24   ████  5,000 clients, $400M+ ARR, market leader
```

---

### THE 5 RULES

1. **Never sell AI — sell dollars recovered.** "We added $43K/month to practices like yours"
2. **Never demo product — demo ROI.** Show them their bleeding, then show the bandage
3. **Never compete on features — compete on outcomes.** Collectly has 20 EHR integrations. You have 85% collection rates
4. **Never chase large hospitals first — dominate mid-market, then move up.** Epic started with large IDNs. You start where they're NOT
5. **Never build what you can integrate.** Use Stripe for payments, Twilio for SMS, ElevenLabs for voice. Build the **intelligence layer** on top

---

## PayVital — Full Partnership Map

### Layer 1: EHR/EMR Platforms (Distribution Channel — List Your App)

These are the **#1 distribution channels**. Getting listed = instant access to their provider base.

| Partner | Reach | Integration Type | Priority |
|---------|-------|-------------------|----------|
| **athenahealth Marketplace** | 160K+ providers | Open API, 800+ endpoints, co-branded marketing | **P0 — Start here** |
| **Epic App Market** | 700+ hospitals, 300M patients, 36% hospital market share | FHIR API, requires technical review | **P0 — Highest value** |
| **Oracle Cerner (now Oracle Health)** | 1,880 installations, 26.4% market share | HL7/FHIR | **P1** |
| **NextGen Healthcare Marketplace** | Mid-size practices + RCM | API marketplace | **P1** |
| **eClinicalWorks** | 150K+ physicians | API integration | **P1** |
| **ModMod (Modernizing Medicine)** | Specialty practices (derm, ortho, ophth) | API | **P2** |
| **DrChrono** | 30K+ providers | Open API, dev-friendly | **P2** |
| **Greenway Health** | 100K+ providers | Already partners with InstaMed | **P2** |
| **AdvancedMD** | Mid-size multi-specialty | API | **P2** |
| **Veradigm (formerly Allscripts)** | API marketplace | FHIR/HL7 | **P2** |

**Action:** Apply to athenahealth + Epic first. Each listing = free distribution to thousands of practices actively looking for billing tools.

---

### Layer 2: EHR Integration Middleware (Connect to ALL EHRs with 1 API)

Instead of building 10 separate EHR integrations, use middleware to connect to **all of them at once**.

| Partner | What They Do | EHR Coverage | Cost Model |
|---------|-------------|--------------|------------|
| **Redox** | Healthcare API middleware, translates HL7/FHIR/CDA → unified JSON API | **12,000+ connected orgs, 95+ EHRs** | Per-transaction / enterprise |
| **NexHealth** | Universal EHR API, single integration → 20+ systems | Strong in dental + ambulatory | Per-provider/month |
| **Health Gorilla** | Full HIE toolkit, clinical data + TEFCA network | Broad, TEFCA-ready | Enterprise |
| **Particle Health** | Patient data API, pulls records from national networks | Clinical + claims data | Per-query |

**Recommendation:** Start with **Redox** — it's the industry standard. One Redox integration = access to 95+ EHRs instantly. This is how Collectly reached 20+ EHR integrations without building each one.

---

### Layer 3: RCM Companies (White-Label Partners — 1 Partner = 50-200 Clients)

#### Tier 1: National RCM Companies (white-label PayVital)

| Partner | Reach | Why Partner | Deal Structure |
|---------|-------|-------------|----------------|
| **R1 RCM** | Largest US RCM, hospitals + health systems | They acquired VisitPay — shows demand for patient payments | Revenue share 20-30% |
| **Athenahealth RCM Services** | Integrated with their EHR, huge mid-market base | Already has billing, lacks AI voice | White-label / co-sell |
| **Change Healthcare (Optum)** | Claims processing giant | Needs patient-side payment tool | Revenue share |
| **Conifer Health (Tenet)** | Hospital RCM outsourcing | Serves 100+ hospitals | White-label |
| **nThrive (now Waystar)** | Merged into Waystar | Potential acquisition target intel | Partnership / compete |

#### Tier 2: Mid-Size RCM Companies (co-sell — they recommend, you close)

| Partner | Focus | Practices Served |
|---------|-------|------------------|
| **CureMD** | Mid-size multi-specialty groups | Enterprise-level at SMB pricing |
| **Kareo (Tebra)** | Small-to-mid practices, popular in ambulatory | Thousands of practices |
| **MediBill MD** | 45+ specialties, 98% clean claims | Mid-size practices |
| **Transcure** | Mixed-specialty, mid-size groups | Flexible engagement |
| **CareCloud** | Cloud-based RCM + practice management | Mid-market focus |
| **Greenway Revenue Services** | Tied to Greenway EHR | 100K+ providers |
| **PracticeSuite** | All-in-one billing platform | SMB practices |

#### Tier 3: Regional Billing Companies (referral fee — $500-$1,000 per client)

| Region | Companies to Target |
|--------|-------------------|
| **Northeast** | Pollux Systems, Medical Billing Wholesalers |
| **Southeast** | Swift MDS, BillingParadise |
| **Midwest** | Praxis EMR partners, regional MSOs |
| **West Coast** | AnnexMed, Credex Healthcare |
| **Texas** | RCM Matter, local MSOs |
| **National (outsourced)** | Human Medical Billing, BillMate |

**36% of medical groups plan to outsource RCM in 2025** (MGMA) — these billing companies need a patient payment tool to offer.

---

### Layer 4: AI Voice Stack (Technology Partners)

| Layer | Partner | What They Do | Why Choose | Cost |
|-------|---------|-------------|------------|------|
| **Orchestration** | **Vapi** | Connects STT + LLM + TTS, modular, 14+ TTS providers | Most flexible, swap any component | Platform fee + usage |
| **Orchestration (alt)** | **Retell AI** | Enterprise voice AI, 40M+ calls/month | Better for regulated industries (HIPAA), monitoring built-in | Per-minute |
| **Orchestration (alt)** | **ElevenLabs Conversational AI** | Full stack — owns STT + TTS + agent logic | Sub-500ms latency, simplest setup, no middleware | Per-minute |
| **Speech-to-Text** | **Deepgram** | Industry-leading STT, sub-300ms | Best accuracy + speed, offers BAA for HIPAA | $0.0043/min |
| **Text-to-Speech** | **ElevenLabs** | Most natural-sounding voices | Best voice quality, multilingual | $0.024/min |
| **LLM (Brain)** | **Anthropic Claude** | Powers the conversation logic | Best for complex reasoning, billing explanations | Per-token |
| **LLM (alt)** | **OpenAI GPT-4o** | Alternative conversation engine | Fastest, good for simple flows | Per-token |
| **Telephony** | **Twilio Voice** | Inbound/outbound calls, SIP | Industry standard, HIPAA BAA available | Per-minute |

#### Recommended Voice Stack Options

```
Option A (Modular — Maximum Control):
  Twilio (telephony) → Vapi (orchestration) → Deepgram (STT) → Claude (LLM) → ElevenLabs (TTS)
  Cost: ~$0.05-0.08/minute
  Pros: Swap any component, full control

Option B (Unified — Fastest to Ship):
  Twilio (telephony) → ElevenLabs Conversational AI (STT + LLM + TTS all-in-one)
  Cost: ~$0.06-0.10/minute
  Pros: Sub-500ms latency, simplest integration, ship in days

Option C (Enterprise Compliance):
  Twilio (telephony) → Retell AI (full stack with compliance monitoring)
  Cost: ~$0.07-0.12/minute
  Pros: Built for healthcare, 40M+ calls/month proven scale
```

---

### Layer 5: Payment Processing (HIPAA-Compliant)

| Partner | HIPAA Compliant | BAA | HSA/FSA | Why |
|---------|----------------|-----|---------|-----|
| **Stripe** | Partial — **does NOT sign BAA** | No | Yes | Best developer experience, but don't pass PHI through Stripe |
| **Square** | **Yes** | Yes | Yes (FSA/HSA debit) | Full HIPAA compliance, integrates with DrChrono, EZDERM |
| **InstaMed (Chase/JPM)** | **Yes** | Yes | Yes | Gold standard in healthcare payments, 50%+ of US providers |
| **TrustCommerce** | **Yes** | Yes | Yes | Healthcare-focused, tokenization |
| **PaymentCloud** | **Yes** | Yes | Yes | 98% approval rate, high-risk friendly |
| **Elavon** | **Yes** | Yes | Yes | Enterprise healthcare payments |

**Recommendation:** Use **Stripe for processing** (best UX/API) but **don't pass PHI through it**. Keep patient data in MongoDB, only send payment amounts + tokens to Stripe. For full HIPAA-compliant processing, consider **InstaMed** or **Square**.

---

### Layer 6: Messaging & Communications (HIPAA-Compliant)

| Partner | Type | HIPAA/BAA | Best For | Cost |
|---------|------|-----------|----------|------|
| **Twilio** | SMS + Voice API | **Yes (BAA available)** | Custom SMS flows, text-to-pay links, programmable | Per-message |
| **OhMD** | Two-way patient texting | **Yes** | Secure provider-patient messaging | Per-user/month |
| **Klara** | Patient texting + video | **Yes** | Two-way SMS, no patient app needed | Per-user/month |
| **TXTImpact** | Mass texting | **Yes** | Bulk payment reminders, from $29/mo | Per-message |
| **Paubox** | Email + SMS encrypted | **Yes** | Encrypted email statements | Per-user/month |
| **TigerConnect** | Enterprise secure messaging | **Yes** | Large health systems | Enterprise |

**Recommendation:** **Twilio** for SMS API (most flexible). Add **Paubox** for encrypted email statements.

---

### Layer 7: Cloud Infrastructure (HIPAA-Compliant Hosting)

| Provider | BAA | Healthcare Services | Best For |
|----------|-----|-------------------|----------|
| **AWS** | Yes (130+ HIPAA-eligible services) | HealthLake, HealthScribe (AI), HealthImaging | Most healthcare startups use AWS |
| **Google Cloud** | Yes | Cloud Healthcare API (FHIR/HL7/DICOM), Vertex AI | If using Google AI / BigQuery |
| **Microsoft Azure** | Yes (default in Product Terms) | Azure Health Data Services, Azure AI | If enterprise/.NET focused |

**Recommendation:** **AWS** — most healthcare startups use it, largest HIPAA-eligible service list (130+), best for MongoDB Atlas + FastAPI deployment.

---

### Layer 8: AI / LLM Partners (ClaimPilot + Intelligence)

| Partner | Use Case | Why |
|---------|----------|-----|
| **Anthropic (Claude)** | Voice agent brain, denial analysis, appeal letter generation | Best reasoning, handles complex billing logic |
| **OpenAI (GPT-4o)** | Voice agent (faster), simpler conversation flows | Fastest response, good for routine calls |
| **Google (Gemini)** | Document analysis, claim processing | Good at structured data extraction |
| **Cohere** | RAG for billing knowledge base | Specialized in retrieval-augmented generation |

---

### Layer 9: Compliance & Security Partners

| Partner | What | Why You Need It |
|---------|------|-----------------|
| **Vanta** | SOC 2 automation | Automates SOC 2 Type II certification (required for enterprise sales) |
| **Drata** | Compliance automation | Alternative to Vanta, SOC 2 + HIPAA + HITRUST |
| **Compliancy Group** | HIPAA compliance | HIPAA seal of compliance for your website |
| **Sentry** | Error monitoring | Real-time crash/error tracking in production |
| **Datadog** | Infrastructure monitoring | Healthcare-grade observability |

---

### Partnership Priority Roadmap

#### Month 1-2 (Ship & Connect)

| Priority | Partner | Action |
|----------|---------|--------|
| **P0** | Twilio | SMS text-to-pay + voice telephony |
| **P0** | Stripe | Payment processing |
| **P0** | ElevenLabs or Vapi | AI voice agent |
| **P0** | Claude (Anthropic) | Voice agent LLM brain |
| **P0** | AWS | HIPAA-compliant hosting |
| **P0** | MongoDB Atlas | Already using — ensure BAA signed |

#### Month 2-4 (Distribute)

| Priority | Partner | Action |
|----------|---------|--------|
| **P1** | athenahealth Marketplace | Apply for listing |
| **P1** | Redox | One API → 95+ EHRs |
| **P1** | 3-5 regional billing companies | Revenue share deals |
| **P1** | Compliancy Group | HIPAA certification |
| **P1** | Vanta | Start SOC 2 process |

#### Month 4-6 (Scale)

| Priority | Partner | Action |
|----------|---------|--------|
| **P2** | Epic App Market | Apply for listing |
| **P2** | 2-3 national RCM companies | White-label discussions |
| **P2** | eClinicalWorks, NextGen, ModMod | EHR marketplace listings |
| **P2** | Paubox | Encrypted email statements |
| **P2** | Square or InstaMed | HIPAA-compliant payment alternative |

#### Month 6-12 (Dominate)

| Priority | Partner | Action |
|----------|---------|--------|
| **P3** | R1 RCM, Conifer, Change Healthcare | Enterprise white-label |
| **P3** | Drata | HITRUST certification |
| **P3** | All remaining EHR marketplaces | Full coverage |
| **P3** | International telephony partners | UK, India, UAE expansion |

---

### The Math: How Partnerships Get You to 1,000 Clients

| Channel | Partners | Clients per Partner | Total Clients |
|---------|----------|-------------------|---------------|
| EHR Marketplaces (5 listings) | 5 | 30-50 each | 150-250 |
| National RCM white-label | 3 | 100-200 each | 300-600 |
| Regional billing companies | 10 | 20-50 each | 200-500 |
| Direct sales (cold outreach) | — | — | 100-200 |
| **Total** | **18** | | **750-1,550** |

**18 partnerships + direct sales = 1,000+ clients within 12-18 months.**

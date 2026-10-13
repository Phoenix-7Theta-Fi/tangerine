# Tangerine — Feature List

Development order is phased so that each phase ships a usable product on its own and later phases build on earlier foundations. No feature in a later phase should be started before its dependencies in earlier phases are stable.

---

## Phase 0 — Foundations (must exist before any user-facing feature)

- Account creation and authentication
- Age gating and jurisdiction detection
- Role selection (member, practitioner, manufacturer, organization admin, platform admin)
- Terms of service, privacy policy, and health-data consent flows
- Onboarding health profile (goals, allergies, medications/supplements, conditions as optional)
- Risk screening at intake with routing to emergency/crisis resources
- Identity and licensure verification workflow for practitioners (license number, region, expiry, re-verification)
- Practitioner credential and profile management
- Content and profile moderation infrastructure (report, block, takedown)
- Audit logging for all sensitive actions
- Crisis/self-harm safety resources and help routing
- Consent recording for telehealth, data use, and product/affiliate disclosures

## Phase 1 — Core Social & Connection (MVP value: "find and talk to a practitioner")

- Practitioner directory with specialty, modality, language, timezone, price, and region filters
- Practitioner profiles (bio, specialties, modalities, availability, pricing, reviews)
- Matching/quiz-based discovery
- Verified badges and trust signals
- Connection requests with states (pending, accepted, blocked)
- Referral-based warm introductions
- Direct 1:1 chat (text, voice notes, file/image sharing)
- Group chat for small communities
- Chat safety features (report, block, keyword screening, crisis prompts)
- Structured message types (check-ins, result shares, product referrals with disclosures)
- Response-time expectations and SLA display
- Follow/practitioner circle (non-performative, optional hidden counts)

## Phase 2 — Scheduling & Personal Programs (MVP value: "work with someone")

- Bookable session types (initial consult, follow-up, coaching, therapy, class)
- Calendar, availability, reschedule/cancel policies, waitlists
- Video/telehealth sessions (in-app or secure link)
- Intake forms and pre-visit questionnaires
- Standardized assessments (e.g., PHQ-9, GAD-7) with licensing compliance
- Telehealth and data consents per session
- Session notes (private practitioner notes) and shared plan summary
- Shared goals and milestones
- Homework/exercise prescription with completion tracking
- Multi-practitioner care team view
- Session recording with consent

## Phase 3 — Biomarker Tracking (MVP value: "see what's happening")

- Curated biomarker catalog with reference ranges, units, and demographic norms
- Manual biomarker entry
- Photo/PDF lab result import (OCR-assisted)
- Lab/health device integrations (wearables, CGMs, smart scales, Apple Health/Health Connect)
- Trend charts, baselines, targets, percent change, rolling averages
- Provenance tracking (who entered, lab method, date, fasting status)
- Patient-controlled visibility and scoped practitioner access
- Exportable health reports (PDF/CSV) with audit
- Out-of-range alerting with "discuss with your clinician" routing
- Lab recheck reminders based on protocols

## Phase 4 — Protocol Tracking, Adherence & Progress (MVP value: "stay on plan")

- Protocol builder (meds, supplements, diet, training, sleep, stress practices, therapy skills)
- Dosing schedules, tapering, on/off cycles
- Drug-supplement interaction flags (rule-based, with disclaimers)
- Versioned protocols with member acknowledgment of changes
- Adherence logging (taken/missed/skipped with reasons)
- Streaks and compliance scores (supportive, non-shaming framing)
- Symptom and outcome diaries linked to protocols
- Care plan as shared source of truth across member and practitioners
- Pause/hold/discontinue flows with reason capture
- Unified progress dashboard (biomarkers, adherence, protocol timeline, milestones, PROMs)
- Before/after comparisons and progress reports

## Phase 5 — Content, Community & Programs (MVP value: "learn together")

- Feed of practitioner education content (posts, explainers, Q&A)
- Groups and communities by condition/goal, moderated
- Events, workshops, classes, and cohort programs with capacity
- Long-form content and newsletters (free/paid)
- Paywalled masterclasses and clinics
- Structured cohort programs (schedule, assignments, group chat, completion)
- Content moderation queue and misinformation handling
- De-identified case-study-style content guidelines

## Phase 6 — Marketplace (MVP value: "buy the things your plan needs")

- Product catalog (supplements, devices, at-home tests, equipment, books)
- Practitioner storefronts and recommendation lists with conflict-of-interest disclosures
- Product-protocol linkage (one-click add to cart from a protocol)
- Orders, fulfillment tracking, and returns
- Subscriptions and autoship
- Bundles and protocol starter kits
- Verified-purchase reviews and ratings
- Product claims moderation (no disease-cure claims) and regulatory disclaimers
- Restricted/controlled category policies
- Seller KYC and provenance verification

## Phase 7 — Payments & Commerce (needed as soon as sessions/products are charged)

- Per-session and package billing
- Practitioner membership/subscription billing
- Marketplace payments and escrow
- Invoicing, receipts, and multi-country tax handling
- Refunds and dispute handling
- Practitioner payouts, KYC, and tax documentation
- Superbill/export documentation for reimbursement

## Phase 8 — Organizations & Scale (needed when selling to clinics, employers, schools)

- Organization admin (roster management, groups, reporting)
- Single sign-on
- Employer/school/clinic program management
- Group programs at scale
- Data-sharing agreements and consent management

## Phase 9 — Advanced Analytics, AI & Interoperability (only after legal sign-off)

- Population/cohort benchmarking (opt-in, anonymized)
- Practitioner performance dashboards (response time, adherence outcomes)
- Platform analytics with privacy budgets
- AI-assisted biomarker interpretation (clinician-in-the-loop, opt-in, disclaimed)
- Insurance billing integrations
- Lab partner ordering (where legally permissible)
- EHR export (FHIR-lite)
- Notifications and smart nudges (missed doses, recheck prompts, weekly summaries)
- Practitioner digest (no-response cases, low-adherence members)
- Localization, i18n, RTL, and regional lab reference ranges
- Feature flags and safe experimentation

## Phase 10 — Governance & Continuous Hardening (always-on track, not a one-off)

- Practitioner credential re-verification and expiry handling
- Scope-of-practice enforcement by jurisdiction
- Privacy: data residency, export, delete-account, retention
- Enhanced moderation (harassment, predatory behavior, misconduct reporting)
- Minors and caregiver flows with mandatory-reporter logic for clinicians
- Offline-first mobile logging support
- Annual compliance re-audit and incident response drills

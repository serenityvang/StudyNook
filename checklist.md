# 📋 StudySpot — Project Checklist

Track your progress phase by phase. Check off items as you go.

---

## 🗂️ Phase 1 — Project Setup
*Get your tools and repo ready*

- [X] Create GitHub repository
- [X] Initialise Vite project with vanilla JS — `npm create vite@latest`
- [X] Set up folder structure (`pages/`, `components/`, `styles/`, `src/`)
- [X] Create `.env` and `.env.example` files — never commit `.env` to GitHub
- [X] Add `.gitignore` — include `.env` and `node_modules`
- [ ] Connect repo to Vercel
- [ ] Add environment variables in Vercel settings — `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SHEERID_PROGRAM_ID`, `ADMIN_PASSWORD`

---

## 🗄️ Phase 2 — Supabase & Database
*Set up your backend and schema*

- [ ] Create Supabase project
- [ ] Create `campuses` table — `id, name, slug, created_at`
- [ ] Create `spots` table — `id, campus_id, name, location_description, type, noise_level, wifi, outlets, hours, description, photo_url, status, submitted_by, created_at`
- [ ] Create `reviews` table — `id, spot_id, user_id, stars, comment, is_verified_student, status, flagged, created_at`
- [ ] Add check constraint on `reviews.stars` — `stars >= 1 AND stars <= 5`
- [ ] Create Supabase Storage bucket: `spot-photos` — public read, restrict uploads via RLS
- [ ] Set Row Level Security (RLS) policies — public can read approved spots; only correct roles can insert/update
- [ ] Manually seed initial campus (your university)
- [ ] Manually seed 5–10 known study spots
- [ ] Install and configure Supabase JS client — `npm install @supabase/supabase-js`

---

## 🎨 Phase 3 — Frontend: Static UI
*Build and style pages with hardcoded data first*

- [ ] Build landing page — university search/select UI
- [ ] Build campus page — spot cards grid/list layout
- [ ] Build filter bar — type, noise level, wifi, outlets
- [ ] Build spot card with photo area — show photo if available, fallback to colored banner by spot type
- [ ] Build spot detail page — full info section layout
- [ ] Build star rating component — display and interactive
- [ ] Build comments section — show Verified Student badge vs unverified label
- [ ] Build comment form — optional verify prompt above input box, dismissable, never a hard gate
- [ ] Build suggest-a-spot multi-step form — Step 1: basic info / Step 2: attributes / Step 3: description + photo upload / Step 4: confirm with "subject to review" notice
- [ ] Handle empty and loading states — what shows while data loads or if no spots exist yet
- [ ] Make layout responsive — mobile friendly

---

## 🔌 Phase 4 — Wire Up Supabase
*Replace hardcoded data with real database calls*

- [ ] Fetch campuses on landing page from Supabase
- [ ] Pass campus slug through URL parameter — e.g. `/campus?school=umn`
- [ ] Fetch approved spots for selected campus
- [ ] Wire up filters to query Supabase with parameters
- [ ] Fetch single spot details on spot detail page
- [ ] Fetch and display approved reviews for a spot — star-only and verified comments show immediately; unverified written comments show only if `status = approved`
- [ ] Calculate and display average star rating with count — e.g. `4.2 ★ (47 ratings)`
- [ ] Submit star-only rating → insert with `status: approved`
- [ ] Submit unverified written comment → insert with `status: pending`
- [ ] Submit suggest-a-spot form → insert spot with `status: pending`
- [ ] Handle optional photo upload in suggest form → upload to Supabase Storage, store path in `spots.photo_url`
- [ ] Validate photo uploads — file type (`jpg/png/webp`) and max size (5MB)
- [ ] Display spot photo on cards and detail page using Supabase Storage public URL — fall back to colored banner if no photo

---

## 🎓 Phase 5 — SheerID Verification
*Optional student verification flow*

- [ ] Create SheerID account and set up a program — choose student enrollment verification
- [ ] Add SheerID program ID to `.env`
- [ ] Build `verify.html` page with SheerID widget embedded
- [ ] On successful verification, store `is_verified_student = true` in Supabase — use SheerID callback/webhook to confirm
- [ ] Verified comments post immediately with Verified Student badge
- [ ] Show optional verify prompt above comment form for unverified users — dismissable, never a hard gate

---

## 🔒 Phase 6 — Security
*Protect against spam and abuse*

- [ ] Add honeypot hidden field to all forms — silently discard submissions where the hidden field is filled
- [ ] Validate all form inputs on the frontend — required fields, character limits, star rating is 1–5
- [ ] Render all user-submitted content as `textContent` not `innerHTML` — prevents XSS
- [ ] Add client-side submission cooldown — disable submit button for 30s after submission
- [ ] Confirm RLS policies are active and tested — try calling Supabase directly from browser devtools to verify unauthorised writes are blocked
- [ ] Confirm service role key is never in frontend code

---

## 🛡️ Phase 7 — Admin Panel
*Review queue and content moderation*

- [ ] Build password-protected admin page — separate file, never linked publicly
- [ ] Display pending spot submissions in queue — show submitted photo alongside spot details
- [ ] Approve / reject spot submissions with a button
- [ ] Allow admin to upload or replace a spot photo when creating spots manually
- [ ] Display pending unverified written comments in queue
- [ ] Display flagged comments in queue
- [ ] Approve or delete comments from admin queue

---

## 🚀 Phase 8 — Polish & Launch
*Final touches before sharing with other students*

- [ ] Test all flows end-to-end — browse, filter, suggest, comment, verify, admin
- [ ] Test RLS by attempting unauthorised writes in browser devtools
- [ ] Test honeypot by manually filling the hidden field
- [ ] Set custom Vercel domain (optional)
- [ ] Share with students at your university 🎉

---

## Contribution Rules (quick reference)

| Action | Unverified | Verified Student |
|---|---|---|
| Browse spots | ✅ Instant | ✅ Instant |
| Star rating only | ✅ Instant | ✅ Instant |
| Written comment | ⏳ Review queue | ✅ Instant + badge |
| Suggest a spot | ⏳ Review queue | ⏳ Review queue |
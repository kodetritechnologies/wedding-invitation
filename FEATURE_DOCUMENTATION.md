# VivahVaani — Complete Feature Documentation & Page-by-Page Inventory

> **Document Type:** Comprehensive Feature Specification & Route-Level Functional Audit  
> **Platform Version:** 0.1.0 | **Author:** Senior Architect, Product Manager & UI/UX Analyst  
> **Workspace Root:** `e:\Amantran` | **App Root:** `wedding-invitation`  

---

## 1. Feature Status Summary Table

| ID | Feature Name | Primary Persona | Implementation Files | Status | Remarks & Verification Evidence |
|---|---|---|---|---|---|
| **F-01** | **Client Registration** | Couples & Planners | `app/register/page.tsx`<br/>`app/api/auth/register/route.ts`<br/>`app/api/auth/admin/register/route.ts` | **Fully Implemented** | Hashes password with bcryptjs (salt 10), initializes `Admin` with free plan (quota: 1), sets JWT cookies & localStorage. |
| **F-02** | **Client / Vendor Login** | Couples & Planners | `app/login/page.tsx`<br/>`app/api/auth/login/route.ts`<br/>`app/api/auth/admin/login/route.ts` | **Fully Implemented** | Validates email/password against `admins` collection, issues 7-day JWT, sets `admin_token` & `auth_token` cookies. |
| **F-03** | **Super Admin Dedicated Login** | Platform Owner | `app/admin/page.tsx`<br/>`app/api/auth/super-admin/login/route.ts` | **Fully Implemented** | Dedicated login querying strictly the `superadmins` collection. Sets isolated `super_admin_token` cookie. Includes quick-fill demo button. |
| **F-04** | **Super Admin Session Guard & Logout** | Platform Owner | `lib/api-guard.ts`<br/>`app/admin/(dashboard)/layout.tsx`<br/>`app/api/auth/super-admin/logout/route.ts` | **Fully Implemented** | Middleware function `requireSuperAdmin` checks token role. Invalid or expired token forces redirect to `/admin`. |
| **F-05** | **Client Session Verification & Logout** | Couples & Planners | `lib/api-guard.ts`<br/>`app/dashboard/layout.tsx`<br/>`app/api/auth/logout/route.ts` | **Fully Implemented** | Validates token via `/api/auth/me`, handles sign out, clears cookies & localStorage. |
| **F-06** | **Wedding Project Creation** | Couples & Planners | `app/dashboard/weddings/page.tsx`<br/>`app/api/admin/weddings/route.ts` | **Fully Implemented** | Modal form: bride, groom, date, venue, city, slug, client, package tier. Generates unique collision-free slug. |
| **F-07** | **Subscription Wedding Quota Enforcement** | Couples & Planners | `app/api/admin/weddings/route.ts` | **Fully Implemented** | Checks active wedding count against `admin.subscription.activeWeddingLimit`. Returns 403 Forbidden if exceeded. |
| **F-08** | **Wedding Project Editing & Status Toggle** | Couples & Planners | `app/dashboard/weddings/[id]/page.tsx`<br/>`app/api/admin/weddings/[id]/route.ts` | **Fully Implemented** | Allows updating wedding fields and toggling status between `draft` and `published` with 1 click. |
| **F-09** | **Wedding Archiving (Soft Deletion)** | Couples & Planners | `app/api/admin/weddings/[id]/route.ts` | **Fully Implemented** | Sets `status = "archived"`. Preserves relational guest records without destroying historical data. |
| **F-10** | **Ceremony / Event Itinerary CRUD** | Couples & Planners | `app/dashboard/weddings/[id]/page.tsx`<br/>`app/api/admin/weddings/[id]/events/route.ts`<br/>`app/api/admin/weddings/[id]/events/[eventId]/route.ts` | **Fully Implemented** | Full creation, listing, updating, and deletion of multi-day wedding ceremonies (Haldi, Mehendi, Sangeet, Vivah, Reception). |
| **F-11** | **Google Maps GPS Navigation Links** | Guests & Hosts | `app/dashboard/weddings/[id]/page.tsx`<br/>`app/w/[slug]/page.tsx` | **Fully Implemented** | Allows input of Google Maps URLs on ceremonies. Renders direct 1-click external map navigation buttons on the public card. |
| **F-12** | **VIP Guest List Management** | Couples & Planners | `app/dashboard/weddings/[id]/page.tsx`<br/>`app/api/admin/weddings/[id]/guests/route.ts`<br/>`app/api/admin/weddings/[id]/guests/[guestId]/route.ts` | **Fully Implemented** | Add guest with name, phone, email, initial headcount. Auto-generates unique 8-character hex `inviteCode`. |
| **F-13** | **1-Click WhatsApp Personalized Share** | Couples & Planners | `app/dashboard/weddings/[id]/page.tsx` | **Fully Implemented** | Generates tailored link `?guest=<code>` and copies to clipboard with pre-formatted invite copy. |
| **F-14** | **Real-Time RSVP Catering Analytics** | Couples & Planners | `app/dashboard/weddings/[id]/page.tsx`<br/>`app/api/admin/weddings/[id]/route.ts` | **Fully Implemented** | KPI cards compute Total Guests, Confirmed Attending, Expected Headcount, Pending RSVP, and Declined in real time. |
| **F-15** | **Accountless Public Digital Patrika View** | Wedding Guests | `app/w/[slug]/page.tsx`<br/>`app/api/public/wedding/[slug]/route.ts` | **Fully Implemented** | Beautiful responsive royal card. Recognizes `?guest=<code>` for personalized guest name header. |
| **F-16** | **Public RSVP Submission** | Wedding Guests | `app/w/[slug]/page.tsx`<br/>`app/api/public/wedding/[slug]/rsvp/route.ts` | **Fully Implemented** | Dual flow: Updates existing guest if code present, or creates new guest if public RSVP enabled in wedding settings. |
| **F-17** | **End-Client Management (Agencies)** | Planners & Designers | `app/dashboard/clients/page.tsx`<br/>`app/api/admin/clients/route.ts`<br/>`app/api/admin/clients/[id]/route.ts` | **Partially Implemented (Unlinked UI)** | Complete CRUD backend and full UI page exist, but link was omitted from `/dashboard/layout.tsx` sidebar navigation! |
| **F-18** | **Super Admin Platform Overview** | Platform Owner | `app/admin/(dashboard)/dashboard/page.tsx`<br/>`app/api/super-admin/overview/route.ts` | **Fully Implemented** | Aggregates counts of Admins, Weddings, Clients, Guests. Lists recent 50 registered clients and weddings. |
| **F-19** | **Super Admin Client Directory & Filter** | Platform Owner | `app/admin/(dashboard)/clients/page.tsx`<br/>`app/api/super-admin/overview/route.ts` | **Partially Implemented** | Displays clients and filters by plan/search in memory, but pulls only from the 50 recent records in overview endpoint. |
| **F-20** | **Super Admin Global Wedding Directory** | Platform Owner | `app/admin/(dashboard)/weddings/page.tsx`<br/>`app/api/super-admin/overview/route.ts` | **Partially Implemented** | Displays and searches weddings from the 50 recent overview records; lacks direct pagination or edit controls. |
| **F-21** | **Site Settings Dynamic CMS** | Platform Owner | `app/admin/(dashboard)/settings/website/page.tsx`<br/>`app/api/super-admin/settings/route.ts`<br/>`app/api/public/settings/route.ts` | **Fully Implemented** | Full form modifying siteName, tagline, logoUrl, contact, address, announcementBar. Instantly reflects on public Header/Footer. |
| **F-22** | **Testimonials Management & Slider** | Platform Owner & Public | `app/admin/(dashboard)/testimonials/page.tsx`<br/>`app/api/super-admin/testimonials/route.ts`<br/>`app/api/public/testimonials/route.ts`<br/>`app/page.tsx` | **Fully Implemented** | Full CRUD on testimonials in admin. Public landing page renders automated auto-sliding testimonial card. |
| **F-23** | **Catering Food Waste Savings Calculator** | Public Visitors | `app/features/page.tsx` | **Fully Implemented** | Interactive client-side sliders calculating unconfirmed plate wastage and rupee savings based on guest count and plate cost. |
| **F-24** | **Wedding Template Catalog & Filter** | Public Visitors | `app/templates/page.tsx` | **UI Only / Partial** | Filter by cultural theme works in state, but all demo buttons link to `aarav-diya` rather than applying a template schema engine. |
| **F-25** | **Contact Form & Concierge Desk** | Public Visitors | `app/contact/page.tsx` | **UI Only / Mock** | Form submission uses a client-side `setTimeout(700ms)` simulation. No data is sent to an API or database. |
| **F-26** | **Payment Gateway Integration** | Couples & Planners | `app/pricing/page.tsx` | **Not Implemented** | Plan CTA buttons simply redirect to `/register`. No Razorpay, Stripe, or Cashfree checkout exists. |
| **F-27** | **Image / Media File Uploads** | Couples & Planners | `models/Wedding.ts` | **Not Implemented** | `coverPhoto` and avatar fields accept text URLs only. No file picker, S3, or Cloudinary integration exists. |
| **F-28** | **Terms & Privacy Pages** | Public Visitors | `components/public/Footer.tsx` | **Broken / 404** | Footer links to `/terms` and `/privacy`, but neither page exists in the `app/` directory. |

---

## 2. Complete Page-by-Page Inventory

### PAGE 01: Landing Page (Public Homepage)
- **Route / URL:** `/`
- **Source File:** `wedding-invitation/app/page.tsx`
- **Route Type:** Public
- **Purpose:** Primary digital storefront, value proposition presentation, social proof, and user onboarding trigger.
- **UI Sections:**
  1. Cultural Announcement Strip (Top bar).
  2. Hero Section: Regional cultural badge (*Designed in Indore, MP*), relatable punchy headline, subheadline, CTAs ("See Live Sample Patrika" -> `/w/aarav-diya`, "Create Free Workspace" -> `/register`), WhatsApp delivery bullet points.
  3. Interactive iPhone 3D Luxury Mockup: Dynamic island notch with animated indicator, monogram badge, couple names, interactive ceremony tabs (Haldi, Sangeet, Vivah, Reception) that dynamically swap ceremony cards, GPS navigation button preview, live RSVP bar preview.
  4. Real Wedding Pain Points (Problem vs Solution cards):
     - Pareshani #01: Address & Navigation (*"Papa ji lawn ka rasta kaunsa hai?"* vs Google Maps GPS).
     - Pareshani #02: Catering & Headcount (*"Catering wale ko kitni plate ka order dein?"* vs Live RSVP Tracker).
     - Pareshani #03: Events & Timings (*"Chat mein PDF kho gaya!"* vs All-in-One Timeline).
     - Pareshani #04: Heavy Printing Cost (*"₹25,000+ aur 3 hafte nikal gaye"* vs 15-Minute Live Delivery).
  5. Royal & Modern Themes Showcase: 3 preview cards (Mughal & Rajputi Heritage, Contemporary Garden, Sacred Vedic Traditions).
  6. Verified Testimonials Slider: Dynamic customer reviews loaded from `/api/public/testimonials`, 5-star ratings, city tags, auto-advance every 5 seconds with pause on hover, manual Prev/Next buttons, slide indicators.
  7. Final Regal Call-to-Action banner with "Create Digital Patrika Free" button.
- **Available Actions & Buttons:**
  - `See Live Sample Patrika` (Opens `/w/aarav-diya` in new tab).
  - `Create Free Workspace` / `Create Digital Patrika Free` (Links to `/register`).
  - Interactive ceremony switcher tabs (`Haldi`, `Sangeet`, `Vivah`, `Reception`).
  - Testimonial slider navigation buttons (Prev, Next, dot pagination).
  - `View All 50+ Templates` (Links to `/templates`).
- **Forms & Inputs:** None (Read-only presentation with interactive state tabs and slider).
- **API Integrations:** `GET /api/public/testimonials`, `GET /api/public/settings`.
- **Functional Status:** **Fully Functional**.

---

### PAGE 02: Designs & Patrika Templates
- **Route / URL:** `/templates`
- **Source File:** `wedding-invitation/app/templates/page.tsx`
- **Route Type:** Public
- **Purpose:** Template catalog showcase for Indian cultural and modern wedding design aesthetics.
- **UI Sections:**
  1. Auspicious Header with Devanagari Sanskrit typography (*Exclusive Patrika Gallery*).
  2. Category Filter Bar:
     - Sabhi Designs (All)
     - 👑 Rajwada & Royal Palace
     - 🌸 Floral & Pastel Lawn
     - 🕉️ Vedic & Shubh Vivah
     - ✨ Contemporary Minimal
     - 🪔 South Indian Kalyanam
  3. Live Search Input (filter by title, regional theme, couple name).
  4. 6 Interactive Template Cards:
     - *Rajwada Darbar* (Jaipur & Udaipur Heritage)
     - *Gulab & Chandan Blush* (Romantic Pastel Lawn)
     - *Kashi Shubh Vivah* (Sacred Vedic & Temple Sanskriti)
     - *Champagne Elegance* (Destination & Contemporary Luxury)
     - *Nawabi Emerald & Pearl* (Opulent Sangeet & Reception)
     - *Thirumangalyam Gopuram* (Traditional South Indian Kalyanam)
  5. Template Card UI: Color swatches, feature pills, category badge, couple name calligraphy, preview button, and "Select Design" button.
  6. Custom Design Concierge Assistance banner.
- **Available Actions & Buttons:**
  - Search input typing with dynamic client-side filtering.
  - Category pill selection buttons.
  - `Live Preview` button on each card (opens `/w/aarav-diya`).
  - `Use This Design` button (links to `/register`).
  - WhatsApp designer helpline link.
- **Forms & Inputs:** Search text input.
- **API Integrations:** `GET /api/public/settings`.
- **Functional Status:** **Partially Implemented**. Category filter and search work in client state, but all cards point to the same demo slug (`aarav-diya`) because multiple dynamic CSS themes are not yet linked to database templates.

---

### PAGE 03: Features & Comparison
- **Route / URL:** `/features`
- **Source File:** `wedding-invitation/app/features/page.tsx`
- **Route Type:** Public
- **Purpose:** Deep dive into product capabilities and interactive catering savings calculation.
- **UI Sections:**
  1. Hero Header (*Khandani Shaan • Modern Technology*).
  2. Interactive Catering Waste Savings Calculator:
     - Expected Guest Count Slider (50 to 2,000 guests).
     - Food Plate Cost Slider (₹500 to ₹4,000 per plate).
     - Calculated Potential Rupee Savings display (calculated based on an average 22% unconfirmed guest no-show rate).
  3. Head-to-Head Comparison Table:
     - Comparing **Printed Physical Cards** vs. **WhatsApp PDFs** vs. **VivahVaani Smart Patrika** across 7 dimensions (Total Cost, Catering Tracking, Google Maps, Multi-Day Timings, Last-Minute Updates, Personalization, App Requirement).
  4. Core Feature Detail Cards with icons (Instant Maps, Live RSVP, Multi-Ceremony Itinerary, Personal Guest Link).
- **Available Actions & Buttons:**
  - Guest count range slider (`50` to `2000`).
  - Plate cost range slider (`₹500` to `₹4000`).
  - "Get Started Free" button (links to `/register`).
- **Forms & Inputs:** HTML5 range sliders (`input[type="range"]`).
- **API Integrations:** `GET /api/public/settings`.
- **Functional Status:** **Fully Functional**.

---

### PAGE 04: How It Works
- **Route / URL:** `/how-it-works`
- **Source File:** `wedding-invitation/app/how-it-works/page.tsx`
- **Route Type:** Public
- **Purpose:** 4-step walkthrough demonstrating how hosts set up their patrika and how guests experience it.
- **UI Sections:**
  1. Hero Header (*Sirf 4 Aasaan Kadam*).
  2. 4 Host Steps with accent badges and feature lists:
     - Kadam 01: 5 Minute Me Shubh Details Bhariye.
     - Kadam 02: Royal Rajwada Ya Floral Theme Chuniye.
     - Kadam 03: Haldi, Sangeet & Vivah Ke Function Jodein.
     - Kadam 04: WhatsApp Par 1-Click Bhejiye & RSVP Dekhiye.
  3. The Guest Experience Breakdown (What relatives see when opening WhatsApp link).
  4. Call to Action banner.
- **Available Actions & Buttons:**
  - `Create Free Workspace` CTA button.
  - `See Live Demo` button.
- **Forms & Inputs:** None.
- **API Integrations:** `GET /api/public/settings`.
- **Functional Status:** **Fully Functional**.

---

### PAGE 05: Pricing & Packages
- **Route / URL:** `/pricing`
- **Source File:** `wedding-invitation/app/pricing/page.tsx`
- **Route Type:** Public
- **Purpose:** Transparent pricing tiers, feature breakdown, and FAQs.
- **UI Sections:**
  1. Hero Header (*Ek Physical Card Ka Kharcha ₹250, Poori Shaadi Ka Unlimited Card Sirf ₹599 Me*).
  2. 3 Pricing Cards:
     - **Shubh Aarambh (Essential)** — **₹299** (Up to 3 ceremonies, Google Maps, 3 months hosting).
     - **Rajwada Royal (Most Popular)** — **₹599** (Unlimited ceremonies, live RSVP headcount, personalized guest links, custom URL slug, 1 year hosting).
     - **Maharaja Bespoke (Luxury VIP)** — **₹999** (Dedicated designer support, physical card digital replica, background music/shehnai embed, 2 years hosting).
  3. Feature checklists with inclusions and exclusions.
  4. Cultural FAQ accordion list (Muhurat changes, Grandfather test, Payments, Privacy).
  5. Tatkal Urgent Desk Banner (2-hour express delivery via WhatsApp).
- **Available Actions & Buttons:**
  - `Shubh Aarambh Chunein` (Links to `/register`).
  - `Rajwada Royal Chunein` (Links to `/register`).
  - `Maharaja Bespoke Chunein` (Links to `/register`).
  - `WhatsApp Tatkal Helpline` (Opens WhatsApp `wa.me` chat).
- **Forms & Inputs:** None.
- **API Integrations:** `GET /api/public/settings`.
- **Functional Status:** **Partially Implemented (UI & Informational Only)**. No real payment checkout; package buttons redirect to user registration.

---

### PAGE 06: About Us & Story
- **Route / URL:** `/about`
- **Source File:** `wedding-invitation/app/about/page.tsx`
- **Route Type:** Public
- **Purpose:** Company background, Indore origins, cultural mission, and core values.
- **UI Sections:**
  1. Hero Header (*Bhartiya Shaadiyon Ki Shaan, Digital Yug Ki Aasani Ke Sath*).
  2. "Hamari Kahani" narrative (Origin story based on real experiences in Indore and Malwa mandaps).
  3. 4 Core Pillars:
     - Parampara & Sanskriti Ka Aadar (Ganesha Vandana, Vedic shlokas).
     - Paryavaran & Bachat (Zero paper waste, saving thousands of trees and ₹30k–₹50k).
     - 100% Private & Pavitra Guest Data (Zero spam, zero advertisements).
     - Local Wedding Planners Ka Saath (Platform for local event planners).
  4. Kodetri Technologies engineering commitment.
- **Available Actions & Buttons:**
  - CTA links to `/register` and `/templates`.
- **Forms & Inputs:** None.
- **API Integrations:** `GET /api/public/settings`.
- **Functional Status:** **Fully Functional**.

---

### PAGE 07: Contact & Support
- **Route / URL:** `/contact`
- **Source File:** `wedding-invitation/app/contact/page.tsx`
- **Route Type:** Public
- **Purpose:** Helpdesk, customer inquiries, and Indore design desk contact info.
- **UI Sections:**
  1. Hero Header (*Hamari Team Se Seedhi Baat Karein*).
  2. WhatsApp Quick Card (Direct WhatsApp link).
  3. Indore Design Studio Address & Phone Numbers.
  4. Contact Inquiry Form:
     - Aapka Shubh Naam (Full Name).
     - Mobile Number (with WhatsApp).
     - Shahar / City.
     - Role Selector (Dulha/Dulhan, Parivaar, Wedding Planner, Studio/Vendor).
     - Tentative Wedding Date.
     - Message / Requirements Textarea.
- **Available Actions & Buttons:**
  - `Chat on WhatsApp` button.
  - `Send Inquiry` form submit button.
- **Forms & Inputs:** Text inputs, tel input, date input, select dropdown, textarea.
- **API Integrations:** None.
- **Functional Status:** **UI Only (Mock Form)**. Form submission uses `setTimeout(700ms)` and shows success UI without transmitting data to any API or database.

---

### PAGE 08: Client Sign In
- **Route / URL:** `/login`
- **Source File:** `wedding-invitation/app/login/page.tsx`
- **Route Type:** Public (Authentication)
- **Purpose:** Authentication for couples, wedding planners, and vendor accounts.
- **UI Sections:**
  1. Brand Card with Heart icon.
  2. Login form: Email address, Password.
  3. Submit Button (*Sign In To Workspace*).
  4. Helper Links: "Register Free Admin Workspace" (`/register`), "Super Admin Login" (`/admin`).
- **Available Actions & Buttons:**
  - Form submission with error handling.
  - Navigation links to register and super admin.
- **Forms & Inputs:** Email input, password input.
- **API Integrations:** `POST /api/auth/login`.
- **Functional Status:** **Fully Functional**. Sets HTTP-only cookies and redirects to `/dashboard`. Note: Branding string says "VivahVaani".

---

### PAGE 09: Client Registration
- **Route / URL:** `/register`
- **Source File:** `wedding-invitation/app/register/page.tsx`
- **Route Type:** Public (Registration)
- **Purpose:** Onboarding new wedding hosts or vendors.
- **UI Sections:**
  1. Auspicious Header (*Shubh Aarambh • Create Invitation*).
  2. Registration form:
     - Aapka Shubh Naam (Full Name).
     - Mobile Number.
     - Email Address.
     - Password (minimum 6 characters).
  3. Submit button (*Create Free Wedding Workspace*).
  4. Link to login page (`/login`).
- **Available Actions & Buttons:**
  - Form submission.
  - Navigation link to login.
- **Forms & Inputs:** Name, phone, email, password.
- **API Integrations:** `POST /api/auth/register`.
- **Functional Status:** **Fully Functional**. Creates new `Admin` record and redirects to `/dashboard`. Note: Branding string says "VivahVaani".

---

### PAGE 10: Public Digital Wedding Patrika (The Core Product)
- **Route / URL:** `/w/[slug]` (e.g. `/w/aarav-diya` or `/w/aarav-diya?guest=SHARMA2026`)
- **Source File:** `wedding-invitation/app/w/[slug]/page.tsx`
- **Route Type:** Public (Dynamic)
- **Purpose:** The wedding invitation card viewed and interacted with by guests.
- **UI Sections:**
  1. Auspicious Vedic Cover Header:
     - Heart crest, *Together with their families* caption.
     - Bride & Groom names in large serif calligraphy (*Diya & Aarav*).
     - Wedding date and venue city.
     - Personalized Guest Badge: Displays *"Honoured Guest: {guest.name}"* when accessed via `?guest=<code>`.
  2. Family Message Card (*A Warm Invitation*).
  3. Multi-Ceremony Itinerary Cards:
     - Ceremony badge (Haldi, Mehendi, Sangeet, Vivah, Reception).
     - Event title, date, start time, end time.
     - Venue name, venue address.
     - Dress code badge (e.g., *Haldi Peela / Yellow Ethnic*).
     - `View Location Map` button with direct Google Maps link.
  4. Interactive RSVP Section (*Will You Attend?*):
     - Joyfully Accept / Regretfully Decline radio cards.
     - Full Name input (pre-filled if personal link).
     - Attending headcount selector (1 to 15 guests).
     - Mobile number input.
     - Blessings & Wishes textarea.
     - `Submit My RSVP` button with loading state.
     - Confirmation state with option to change/update response.
  5. Emergency Venue & Travel Assistance contact cards with direct `tel:` dialing buttons.
  6. Footer (*Created with VivahVaani • Powered by Kodetri Technologies*).
- **Available Actions & Buttons:**
  - Google Maps external navigation button on each ceremony.
  - RSVP Joyfully Accept / Regretfully Decline selection.
  - Headcount increment/decrement.
  - RSVP submission.
  - Direct telephone dialing buttons (`tel:+91...`).
- **Forms & Inputs:** RSVP form (status buttons, name, headcount, phone, message).
- **API Integrations:**
  - `GET /api/public/wedding/[slug]?guest=<code>`
  - `POST /api/public/wedding/[slug]/rsvp`
- **Functional Status:** **Fully Functional**.

---

### PAGE 11: Client Workspace Overview
- **Route / URL:** `/dashboard`
- **Source File:** `wedding-invitation/app/dashboard/page.tsx`
- **Layout File:** `wedding-invitation/app/dashboard/layout.tsx`
- **Route Type:** Authenticated Private (Client / Vendor)
- **Purpose:** High-level metrics and navigation for couples and planners.
- **UI Sections:**
  1. Welcome Header and subtitle.
  2. Quick Action Button: "Create Wedding Card" (links to `/dashboard/weddings`).
  3. KPI Metric Cards:
     - Total Wedding Cards count.
     - Published Active Cards count.
     - Total End Clients count (fetched from `/api/admin/clients`).
  4. Active Wedding Cards List:
     - Cards showing couple names, date, venue, city, status badge (`published` / `draft`), slug link.
     - "Manage Card & RSVPs" link pointing to `/dashboard/weddings/[id]`.
- **Available Actions & Buttons:**
  - Create Wedding Card button.
  - Link to specific wedding workspace.
  - Link to open public card.
  - Sidebar navigation links.
- **Forms & Inputs:** None.
- **API Integrations:** `GET /api/auth/me`, `GET /api/admin/weddings`, `GET /api/admin/clients`.
- **Functional Status:** **Fully Functional**.

---

### PAGE 12: Client Weddings Directory & Creation
- **Route / URL:** `/dashboard/weddings`
- **Source File:** `wedding-invitation/app/dashboard/weddings/page.tsx`
- **Route Type:** Authenticated Private (Client / Vendor)
- **Purpose:** Full directory of weddings managed by the user with creation modal.
- **UI Sections:**
  1. Header with "Create New Wedding Card" button.
  2. Grid of Wedding Cards:
     - Couple names, status badge, wedding date, venue, city, package tier pill.
     - Associated client name (if linked).
     - Direct public invitation link.
     - `Manage Events & RSVPs` button (links to `/dashboard/weddings/[id]`).
  3. Modal Dialog: Create Wedding Project:
     - Bride Name, Groom Name.
     - Wedding Date picker.
     - Main Venue, City.
     - Custom URL Slug input.
     - Associate Client dropdown (populated from `/api/admin/clients`).
     - Package Tier selector (`basic`, `premium`, `royal`, `subscription`).
- **Available Actions & Buttons:**
  - Open/close Create Wedding modal.
  - Form submission.
  - Navigation into wedding management.
- **Forms & Inputs:** Bride name, groom name, date, venue, city, slug, client select, tier select.
- **API Integrations:** `GET /api/admin/weddings`, `GET /api/admin/clients`, `POST /api/admin/weddings`.
- **Functional Status:** **Fully Functional**. Enforces plan quota checks.

---

### PAGE 13: Wedding Detail, Itinerary & Live RSVP Center
- **Route / URL:** `/dashboard/weddings/[id]`
- **Source File:** `wedding-invitation/app/dashboard/weddings/[id]/page.tsx`
- **Route Type:** Authenticated Private (Client / Vendor)
- **Purpose:** Deep management of a single wedding: ceremonies, guest list, and live RSVP catering tracker.
- **UI Sections:**
  1. Wedding Header Card:
     - Couple names, date, venue, city.
     - Status toggle badge: click to switch between `published` and `draft`.
     - `Copy Public URL` button with copy feedback.
     - `View Live Invitation` external link.
  2. Live RSVP Tracker Banner:
     - Total Guests invited.
     - Confirmed Attending count.
     - Expected Headcount (sum of all attendee counts for confirmed guests).
     - Pending RSVP count.
     - Declined count.
  3. Workspace Tabs:
     - **Tab 1: Itinerary & Functions ({count})**
     - **Tab 2: Guest List & RSVPs ({count})**
  4. Itinerary Tab Content:
     - Grid of Ceremony Cards (Haldi, Mehendi, Sangeet, Vivah, Reception) with timings, venue, dress code, maps URL.
     - Delete ceremony button.
     - `Add Function` modal (Event type, title, date, start time, venue name, Google Maps URL, dress code).
  5. Guest List Tab Content:
     - Guest Table: Guest Name, Phone, RSVP Status badge, Attending Headcount, Personal Link button, Delete action.
     - Guest blessing wish quote display under name.
     - `Copy WhatsApp Invite` button: copies formatted invitation text including `?guest=<code>`.
     - `Add Guest` modal (Guest name, phone, email, headcount).
- **Available Actions & Buttons:**
  - Status toggle (`draft` <-> `published`).
  - Copy public URL.
  - Tab switching (Itinerary vs Guests).
  - Open/close Add Event modal; submit event; delete event.
  - Open/close Add Guest modal; submit guest; delete guest.
  - Copy personalized WhatsApp invitation link.
- **Forms & Inputs:** Add Event form, Add Guest form.
- **API Integrations:**
  - `GET /api/admin/weddings/[id]`
  - `PUT /api/admin/weddings/[id]`
  - `POST /api/admin/weddings/[id]/events`
  - `DELETE /api/admin/weddings/[id]/events/[eventId]`
  - `GET /api/admin/weddings/[id]/guests`
  - `POST /api/admin/weddings/[id]/guests`
  - `DELETE /api/admin/weddings/[id]/guests/[guestId]`
- **Functional Status:** **Fully Functional**.

---

### PAGE 14: Client Directory (Agencies & Planners)
- **Route / URL:** `/dashboard/clients`
- **Source File:** `wedding-invitation/app/dashboard/clients/page.tsx`
- **Route Type:** Authenticated Private (Client / Vendor)
- **Purpose:** Manage customer families (brides/grooms) under an agency account.
- **UI Sections:**
  1. Header with search bar and "Add New Client" button.
  2. Client Cards Grid:
     - Client name, email, phone, address, notes, creation date.
     - Status badge (`active` / `archived`).
     - Archive action button.
  3. Modal Dialog: Add New Client:
     - Client Name (e.g. *Sunil & Sunita Sharma*).
     - Email, Phone, Address, Notes.
- **Available Actions & Buttons:**
  - Search with debounced 300ms live filtering.
  - Open/close Add Client modal; submit client form.
  - Archive client.
- **Forms & Inputs:** Client creation form (name, email, phone, address, notes).
- **API Integrations:** `GET /api/admin/clients`, `POST /api/admin/clients`, `DELETE /api/admin/clients/[id]`.
- **Functional Status:** **Fully Implemented in Code, but Unlinked in Navigation**. Note: The link `/dashboard/clients` is missing from the sidebar in `app/dashboard/layout.tsx`. Users can only access it by typing the URL directly.

---

### PAGE 15: Super Admin Login
- **Route / URL:** `/admin`
- **Source File:** `wedding-invitation/app/admin/page.tsx`
- **Route Type:** Public Admin
- **Purpose:** Dedicated login portal for platform owners and operations.
- **UI Sections:**
  1. Dark-mode zinc card with Shield icon.
  2. Quick Fill Demo Button (*"Quick Fill Demo Super Admin Credentials"*).
  3. Email & Password inputs with password reveal toggle.
  4. Submit Button (*Authenticate As Super Admin*).
- **Available Actions & Buttons:**
  - Quick fill demo credentials.
  - Password visibility toggle.
  - Form submission.
- **Forms & Inputs:** Email, password.
- **API Integrations:** `POST /api/auth/super-admin/login`, `GET /api/auth/super-admin/me`.
- **Functional Status:** **Fully Functional**. Sets isolated `super_admin_token` cookie and redirects to `/admin/dashboard`.

---

### PAGE 16: Super Admin Platform Dashboard Overview
- **Route / URL:** `/admin/dashboard`
- **Source File:** `wedding-invitation/app/admin/(dashboard)/dashboard/page.tsx`
- **Layout File:** `wedding-invitation/app/admin/(dashboard)/layout.tsx`
- **Route Type:** Authenticated Super Admin
- **Purpose:** Platform-wide metrics, system health, and recent client activity.
- **UI Sections:**
  1. Platform Overview Header with manual Refresh button.
  2. 4 Stat KPI Cards:
     - Total Registered Clients (`totalAdmins`).
     - Total Wedding Cards (`totalWeddings`).
     - End Client Records (`totalClients`).
     - Total Guest RSVPs (`totalGuests`).
  3. Recent Registered Clients Table:
     - Name, email, business name, subscription plan badge, status, registration date.
- **Available Actions & Buttons:**
  - Refresh button.
  - Sidebar navigation links.
- **Forms & Inputs:** None.
- **API Integrations:** `GET /api/auth/super-admin/me`, `GET /api/super-admin/overview`.
- **Functional Status:** **Fully Functional**.

---

### PAGE 17: Super Admin Clients Directory
- **Route / URL:** `/admin/clients`
- **Source File:** `wedding-invitation/app/admin/(dashboard)/clients/page.tsx`
- **Route Type:** Authenticated Super Admin
- **Purpose:** Inspect registered wedding planners, agencies, and vendors.
- **UI Sections:**
  1. Search input (name, email, business name).
  2. Plan filter dropdown (`All Plans`, `Free`, `Starter`, `Professional`, `Agency`).
  3. Registered Clients Table:
     - Client Name & Email, Business Name, Subscription Plan badge, Active Wedding Limit, Status, Joined Date.
- **Available Actions & Buttons:**
  - Search input typing.
  - Plan dropdown selection.
- **Forms & Inputs:** Search input, filter select.
- **API Integrations:** `GET /api/super-admin/overview`.
- **Functional Status:** **Partially Implemented**. Pulls from the recent 50 records returned by `/api/super-admin/overview` rather than a dedicated paginated clients API.

---

### PAGE 18: Super Admin Weddings Directory
- **Route / URL:** `/admin/weddings`
- **Source File:** `wedding-invitation/app/admin/(dashboard)/weddings/page.tsx`
- **Route Type:** Authenticated Super Admin
- **Purpose:** Global oversight of all wedding cards created on the platform.
- **UI Sections:**
  1. Search input (couple, city, slug).
  2. Weddings Table:
     - Couple & Title, City & Date, Package Tier badge, Status badge (`published`, `draft`, `archived`), Slug link to open public patrika.
- **Available Actions & Buttons:**
  - Search input.
  - External link to view public invitation.
- **Forms & Inputs:** Search input.
- **API Integrations:** `GET /api/super-admin/overview`.
- **Functional Status:** **Partially Implemented**. Similar to clients, pulls from the 50 recent records in `/api/super-admin/overview`.

---

### PAGE 19: Super Admin Website Settings CMS
- **Route / URL:** `/admin/settings/website`
- **Source File:** `wedding-invitation/app/admin/(dashboard)/settings/website/page.tsx`
- **Route Type:** Authenticated Super Admin
- **Purpose:** Full CMS for platform branding, contact details, announcement bar, and social links.
- **UI Sections:**
  1. Header with `Save All Settings` button and `View Live Public Website` link.
  2. Quick Fill Helpers: "Fill Indore HQ defaults", "Transparent Logo presets".
  3. General Branding Section: Site Name, Tagline, Logo URL, Logo Text, Favicon URL.
  4. Top Announcement Bar Section: Enabled toggle switch, Banner text input (supports Devanagari Hindi text).
  5. Contact & Support Section: Official Email, Phone, WhatsApp number, Working hours.
  6. Physical Address Section: Formatted Address, City, State, Pincode, Country.
  7. Social Media Links Section: Instagram, Facebook, YouTube, Twitter.
  8. Footer & Legal Section: Copyright text, Footer tagline.
- **Available Actions & Buttons:**
  - Preset fill buttons.
  - Toggle switches.
  - Save button with success banner.
- **Forms & Inputs:** 16 text inputs, 1 toggle switch.
- **API Integrations:** `GET /api/super-admin/settings`, `PUT /api/super-admin/settings`.
- **Functional Status:** **Fully Functional**. Changes persist to MongoDB `sitesettings` collection and immediately update public Header and Footer.

---

### PAGE 20: Super Admin Testimonials CMS
- **Route / URL:** `/admin/testimonials`
- **Source File:** `wedding-invitation/app/admin/(dashboard)/testimonials/page.tsx`
- **Route Type:** Authenticated Super Admin
- **Purpose:** Complete CRUD manager for customer reviews displayed on the public landing page.
- **UI Sections:**
  1. Header with `Add Testimonial` button.
  2. Testimonials Table:
     - Client Name & Role, Location/City, Rating (rendered as 5 star icons), Content quote preview, Status toggle (`active` / `inactive`), Display Order, Edit and Delete actions.
  3. Add / Edit Testimonial Modal:
     - Name, Role (e.g. *Happy Couple*, *Wedding Planner*), City, Rating (1 to 5), Content textarea, Status, Display Order.
- **Available Actions & Buttons:**
  - Open Add modal; open Edit modal; submit testimonial.
  - Toggle active status.
  - Delete testimonial with confirmation.
- **Forms & Inputs:** Name, role, city, rating select, content textarea, status select, order number.
- **API Integrations:**
  - `GET /api/super-admin/testimonials`
  - `POST /api/super-admin/testimonials`
  - `PUT /api/super-admin/testimonials/[id]`
  - `DELETE /api/super-admin/testimonials/[id]`
- **Functional Status:** **Fully Functional**.

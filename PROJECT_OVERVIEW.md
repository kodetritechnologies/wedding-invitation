# VivahVaani (Wedding Invitation SaaS) — Project Overview & Product Discovery

> **Document Type:** Product Discovery, Functional Architecture & Executive Overview  
> **Brand Identity:** **VivahVaani** (विवाहवाणी) — *Powered by Kodetri Technologies* (Historically referenced as *VivahVaani* / *Amantran*)  
> **Author / Role:** Senior Software Architect, Product Manager & Technical Documentation Lead  
> **Date:** November 2026  
> **Repository Directory:** `wedding-invitation` | **Workspace Root:** `e:\Amantran`  
> **Technology Foundation:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4, MongoDB, Mongoose 9, JWT & Bcryptjs  

---

## 1. Executive Summary

**VivahVaani** is a specialized, production-ready full-stack Multi-Tenant SaaS platform engineered specifically for the Indian wedding ecosystem. It modernizes the centuries-old cultural tradition of the *Lagan Patrika* (लग्न पत्रिका — auspicious Indian wedding invitation) by transforming physical paper cards and clumsy static WhatsApp PDF files into interactive, regal, mobile-first **Digital Wedding Patrikas**.

The platform is anchored in Indore, Madhya Pradesh (the heart of the Malwa cultural region), designed with cultural reverence, Sanskrit Vedic hymns (*Ganesha Vandana*, *Mangalacharan*), auspicious regional motifs, and regional wedding customs. Simultaneously, it delivers cutting-edge software architecture: sub-second responsive pages, 1-click Google Maps turn-by-turn GPS navigation to wedding venues, interactive RSVP headcount and catering tracking, and 1-click personalized WhatsApp invitation dispatch.

```
       ┌─────────────────────────────────────────────────────────────┐
       │                        VivahVaani                           │
       │    "Har Shaadi Ki Shuruaat, Ek Khoobsurat Nimantran"        │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            ▼                         ▼                         ▼
   ┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
   │  Public Portal   │      │ Client Workspace │      │   Super Admin    │
   │  & Guest Patrika │      │  (Agency/Couple) │      │ Platform Console │
   │   (/, /w/[slug]) │      │   (/dashboard)   │      │     (/admin)     │
   └──────────────────┘      └──────────────────┘      └──────────────────┘
```

---

## 2. Problem Statement & Real-World Pain Points

In contemporary Indian weddings, invitations present four major structural, financial, and logistical bottlenecks:

### Problem 1: Excessive Printing Cost & Environmental Paper Waste
- **Traditional Reality:** Printing 300 to 800 physical wedding invitation boxes with gold foil, dry-fruit inserts, and personalized ribbons costs between **₹35,000 and ₹1,50,000**.
- **Logistical Friction:** Courier delays, in-person delivery journeys across cities, and printing press turnaround times of 3 to 4 weeks.
- **Waste Factor:** More than 90% of expensive printed cards are discarded into wastebins within 24 hours of the wedding.

### Problem 2: Confusing WhatsApp PDFs & Cluttered Media
- **Traditional Reality:** Families frequently resort to creating static PDF documents or 20MB video files and blasting them over WhatsApp chats.
- **Friction:** Guests lose the file in cluttered chat histories; elderly relatives struggle to download heavy PDFs; micro-text is illegible without continuous zooming.
- **Lack of Agility:** If a venue lawn changes or a *muhurat* timing shifts by 1 hour due to astrological calculations, re-printing or re-exporting video files creates mass confusion.

### Problem 3: Venue Highway Confusion & "Papa Ji Ko Call" Burden
- **Traditional Reality:** On the wedding day, the fathers and uncles of the bride and groom receive 40 to 80 phone calls asking: *"Bhaiya, bypass se kaunsa turn lena hai? Lawn ka landmark kya hai?"*
- **Friction:** Key family hosts spend their auspicious celebration hours acting as telephone navigators instead of attending ceremonies.

### Problem 4: Catering Headcount Guesswork & Massive Food Wastage
- **Traditional Reality:** 500 guests are invited, but without an RSVP mechanism, caterers cook for 600 plates to be safe.
- **Financial Loss:** At ₹1,200 to ₹2,500 per plate, unconfirmed attendance leads to **₹50,000 to ₹1,50,000 in wasted catering expenses** or stressful food shortages.

---

## 3. VivahVaani’s Core Purpose & Solution

VivahVaani directly solves every one of these problems through a unified web platform:

1. **Sub-15-Minute Digital Delivery:** Create a live royal wedding patrika URL (e.g., `vivahvaani.kodetri.com/w/aarav-diya`) in 15 minutes at a fraction of printing costs (packages starting from ₹299).
2. **Zero App Download / Instant Browser Access:** Guests tap a single WhatsApp link and instantly access the card on any modern iOS or Android mobile browser without registering, entering passwords, or installing apps.
3. **1-Click Turn-by-Turn GPS Navigation:** Every function (Haldi, Mehendi, Sangeet, Shubh Vivah, Reception) embeds verified Google Maps GPS links taking guests straight to the venue's entry gate.
4. **Live RSVP Headcount Tracker:** Guests submit attendance status (Attending / Declined), guest counts (e.g., 3 members), and dietary preferences (e.g., Jain meals) in 2 seconds. The client's dashboard updates in real time with exact plate counts.
5. **Personalized Respect (*Mehmaan Samman*):** Generate unique invite codes where guests see their own family name prominently on the phone screen (e.g., *"Honoured Guest: Mr. Rajesh Sharma & Family"*).

---

## 4. Target User Personas

| Persona | Description | Needs & Motivations | Typical Actions |
|---|---|---|---|
| **Bride, Groom & Families (B2C Hosts)** | Couples or family elders organizing a wedding. | Cost savings, high cultural elegance, peace of mind on wedding day. | Register account, input wedding details, add ceremonies, copy WhatsApp links, track RSVP plates. |
| **Wedding Planners & Studios (B2B Clients)** | Event planners, photographers, invitation designers, and printers. | Client management, offering value-add digital invitations, recurring margin. | Manage multiple client weddings under one workspace, customize itineraries, advise hosts on catering headcount. |
| **Wedding Guests & Relatives (End Users)** | Family relatives, out-of-town guests, elderly friends. | Easy access, clear muhurat schedules, instant GPS directions, quick RSVP without login. | Open WhatsApp link, view itinerary, tap Google Maps button, submit headcount and warm blessings. |
| **Platform Administrator (Super Admin)** | Kodetri Technologies platform operations and governance team. | System visibility, business metrics, customer testimonials, site-wide CMS management. | Monitor platform analytics, manage client accounts, update branding, announcement banner, contact info, and customer reviews. |

---

## 5. Application Architecture & Paradigm

VivahVaani is structured as a **Multi-Tenant Full-Stack Web Application** built on modern Next.js 16 App Router principles:

```mermaid
graph TD
    subgraph "Clients & Guests"
        Guest[Wedding Guests & Relatives]
        Host[Wedding Host / Couple]
        Planner[Wedding Planner / Designer]
    end

    subgraph "Application Presentation Layer (Next.js 16)"
        PublicWeb["Public Marketing Portal<br/>(/, /about, /features, /pricing, /templates)"]
        PublicPatrika["Public Digital Patrika<br/>(/w/[slug]?guest=CODE)"]
        ClientDash["Client/Admin Dashboard<br/>(/dashboard, /dashboard/weddings)"]
        SuperAdminDash["Super Admin Portal<br/>(/admin, /admin/dashboard)"]
    end

    subgraph "API & Security Layer (Next.js Route Handlers)"
        AuthAPI["/api/auth/*<br/>JWT Auth, Bcrypt, Separate Cookies"]
        AdminAPI["/api/admin/*<br/>Weddings, Events, Guests, Clients"]
        PublicAPI["/api/public/*<br/>Wedding Slug, Open RSVP, Settings, Testimonials"]
        SuperAdminAPI["/api/super-admin/*<br/>Overview, Site Settings, Testimonials CRUD"]
        APIGuard["API Guard Middleware<br/>requireAdmin, requireSuperAdmin"]
    end

    subgraph "Database Layer (MongoDB Atlas)"
        M_SuperAdmin[(superadmins)]
        M_Admin[(admins)]
        M_Client[(clients)]
        M_Wedding[(weddings)]
        M_Event[(weddingevents)]
        M_Guest[(guests)]
        M_Settings[(sitesettings)]
        M_Testimonials[(testimonials)]
    end

    Guest -->|View & RSVP| PublicPatrika
    Host -->|Manage Wedding| ClientDash
    Planner -->|Manage Clients & Weddings| ClientDash
    PublicWeb --> PublicAPI
    PublicPatrika --> PublicAPI
    ClientDash -->|JWT Cookie / Bearer| AdminAPI
    SuperAdminDash -->|JWT Cookie / Bearer| SuperAdminAPI

    AdminAPI --> APIGuard
    SuperAdminAPI --> APIGuard
    AuthAPI --> M_Admin
    AuthAPI --> M_SuperAdmin
    AdminAPI --> M_Wedding
    AdminAPI --> M_Event
    AdminAPI --> M_Guest
    AdminAPI --> M_Client
    PublicAPI --> M_Wedding
    PublicAPI --> M_Event
    PublicAPI --> M_Guest
    PublicAPI --> M_Settings
    PublicAPI --> M_Testimonials
    SuperAdminAPI --> M_Settings
    SuperAdminAPI --> M_Testimonials
    SuperAdminAPI --> M_Admin
    SuperAdminAPI --> M_Wedding
```

---

## 6. Main Modules Overview

The codebase is organized into eight functional modules:

### Module 1: Public Marketing & Lead Generation Portal
- **Routes:** `/`, `/about`, `/contact`, `/features`, `/how-it-works`, `/pricing`, `/templates`
- **Purpose:** Educates visitors, displays cultural ethos, showcases template designs, calculates catering cost savings, displays authentic customer testimonials, and converts visitors into registered users.
- **Features:** Dynamic announcement bar, real-time testimonials slider, catering savings slider calculator, template search and filter by cultural tags.

### Module 2: Accountless Public Digital Patrika (`/w/[slug]`)
- **Route:** `/w/[slug]` with optional `?guest=<code>` query parameter.
- **Purpose:** The core product consumed by thousands of wedding guests.
- **Features:**
  - Royal header with Sanskrit shlokas (*Shree Ganeshay Namah*), bride & groom typography, wedding date, venue.
  - Personalized guest greeting badge (*"Honoured Guest: Sharma Family"*).
  - Warm family message (*"A Warm Invitation"*).
  - Multi-ceremony itinerary cards (Haldi, Mehendi, Sangeet, Vivah, Reception) with dates, times, dress codes, and 1-click Google Maps buttons.
  - Interactive RSVP card: Joyful Accept / Regretful Decline, headcount selector, phone number, and blessing wishes textarea.
  - Emergency travel assistance telephone contact buttons.

### Module 3: Client & Vendor Authentication System
- **Routes:** `/login`, `/register`, `/api/auth/login`, `/api/auth/register`, `/api/auth/me`, `/api/auth/logout`
- **Purpose:** Secure tenant onboarding and session maintenance.
- **Mechanism:** Bcryptjs password hashing, JWT token generation (7-day validity), simultaneous `admin_token` and `auth_token` HTTP-only cookie dispatch, and `localStorage` backup token storage.

### Module 4: Client Wedding Management Engine
- **Routes:** `/dashboard`, `/dashboard/weddings`, `/dashboard/weddings/[id]`, `/dashboard/clients`
- **Purpose:** Self-service workspace for couples and wedding planners.
- **Features:**
  - Overview metrics (Total Weddings, Published Weddings, Total Clients).
  - Wedding creation modal (Bride name, Groom name, Date, Venue, City, custom URL slug, package tier).
  - Plan quota check (`activeWeddingLimit` enforced against Admin subscription).
  - Wedding status toggle (Draft / Published).
  - Copy public invitation link.

### Module 5: Ceremony & Multi-Day Itinerary Engine
- **API Routes:** `/api/admin/weddings/[id]/events`, `/api/admin/weddings/[id]/events/[eventId]`
- **Purpose:** Build out multi-event timelines for Indian wedding traditions.
- **Features:** Create, read, update, and delete ceremonies (Haldi, Mehendi, Sangeet, Wedding, Reception, Engagement, Custom) with start/end timings, venue address, Google Maps URL, and dress codes.

### Module 6: Guest List & Live RSVP Tracking Engine
- **API Routes:** `/api/admin/weddings/[id]/guests`, `/api/admin/weddings/[id]/guests/[guestId]`, `/api/public/wedding/[slug]/rsvp`
- **Purpose:** Guest registry management and real-time catering analytics.
- **Features:**
  - Add VIP guest with headcount and contact details.
  - Generate unique 8-character hex invite code (`crypto.randomBytes(4).toString("hex").toUpperCase()`).
  - Pre-formatted WhatsApp invitation copy button.
  - Real-time RSVP calculation: Total Invited, Confirmed Attending, Expected Headcount, Pending, Declined.
  - Open public RSVP handling (when enabled in wedding settings).

### Module 7: Super Admin Platform Console
- **Routes:** `/admin`, `/admin/dashboard`, `/admin/clients`, `/admin/weddings`, `/admin/settings/website`, `/admin/testimonials`
- **Purpose:** Platform governance, site-wide configuration, and business analytics.
- **Security:** Completely isolated authentication stored in the `superadmins` collection, protected by `requireSuperAdmin` guard and `super_admin_token` cookie.
- **Features:**
  - High-level platform metrics (total clients, weddings, guests, end clients).
  - Client search and subscription plan filtering.
  - Global wedding inventory overview with direct links.
  - Full Website Settings CMS (site title, tagline, transparent logo presets, Indore HQ contact info, announcement banner toggle, social links, footer copyright).
  - Testimonial management (full CRUD with star ratings, city badges, active toggles, and display ordering).

### Module 8: Multi-Client Vendor Directory
- **Route:** `/dashboard/clients`
- **API Routes:** `/api/admin/clients`, `/api/admin/clients/[id]`
- **Purpose:** Enables agencies and planners to manage distinct customer families (e.g., Sharma Family, Verma Family) and link specific wedding projects to them.

---

## 7. Business Logic & Tenancy Hierarchy

The business model and data hierarchy follow a strict relational structure inside MongoDB:

```
                  ┌────────────────────────┐
                  │       SuperAdmin       │  (Platform Owner)
                  └────────────────────────┘
                              │ manages platform
                              ▼
                  ┌────────────────────────┐
                  │         Admin          │  (Planner / Agency / Couple)
                  │  Subscription Plan:    │
                  │  free | starter |      │
                  │  professional | agency │
                  └───────────┬────────────┘
                              │
            ┌─────────────────┴─────────────────┐
            ▼                                   ▼
┌────────────────────────┐         ┌────────────────────────┐
│         Client         │         │        Wedding         │
│  (Customer Family)     │◄────────┤  (slug: aarav-diya)    │
└────────────────────────┘         └───────────┬────────────┘
                                               │
                         ┌─────────────────────┴─────────────────────┐
                         ▼                                           ▼
             ┌────────────────────────┐                  ┌────────────────────────┐
             │      WeddingEvent      │                  │         Guest          │
             │ (Haldi, Sangeet, Vivah)│                  │(inviteCode: A1B2C3D4)  │
             └────────────────────────┘                  │(rsvpStatus: attending) │
                                                         └────────────────────────┘
```

### Key Business Rules:
1. **Multi-Tenant Data Isolation:** Every query on `Client`, `Wedding`, `WeddingEvent`, and `Guest` enforces `adminId: auth.userId`. Admins can never inspect or modify another admin's data.
2. **Quota Enforcement:** When creating a wedding, the system counts existing non-archived weddings for that admin. If `activeWeddingCount >= admin.subscription.activeWeddingLimit`, the creation is rejected with a `403 Forbidden` response prompting a subscription upgrade.
3. **Collision-Proof Slugs:** Slugs are sanitized and checked for uniqueness. If `aarav-diya` already exists in MongoDB, the system automatically appends `-1`, `-2`, etc.
4. **Soft Deletion:** Archiving a wedding updates `status = "archived"`, removing it from active lists without breaking historical guest database foreign keys.
5. **Dual RSVP Modes:**
   - **Personalized Mode:** Guest visits `/w/slug?guest=CODE`. The card recognizes their name, loads existing status, and updates that guest record.
   - **Open Public Mode:** Guest visits `/w/slug` without a code. If `wedding.settings.allowPublicRsvp` is enabled, a new guest record is automatically created with an auto-generated invite code.

---

## 8. Complete Technology Stack

| Layer | Technology | Version | Purpose & Architecture Role |
|---|---|---|---|
| **Framework** | Next.js (App Router) | `16.4.6` | Server-side rendering, React Server Components, API Route Handlers, Turbopack bundling |
| **UI Library** | React | `19.3.0` | Declarative UI, Client Components, modern hooks (`use()`, `usePathname`, `useSearchParams`, `Suspense`) |
| **Language** | TypeScript | `^5.0.0` | End-to-end static typing across models, API responses, and frontend state |
| **Styling** | Tailwind CSS | `4.3.3` | Utility-first styling via `@tailwindcss/turbopack`, custom theme variables, animations |
| **Database** | MongoDB | Atlas / v7+ | NoSQL document database storing multi-tenant collections |
| **ODM** | Mongoose | `^9.12.1` | Schemas, validations, virtuals, compound indexes, model caching |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) | `^9.0.3` | Stateless signed auth tokens with dual-role payload (`admin` vs `super_admin`) |
| **Cryptography** | `bcryptjs` | `^3.0.3` | Salted password hashing (salt rounds: 10) |
| **Icons** | `lucide-react` | `^1.73.0` | Vector iconography for dashboards and UI sections |
| **Typography** | `next/font/google` | Built-in | Variable web fonts: *Plus Jakarta Sans*, *Cormorant Garamond*, *Cinzel*, *Rozha One*, *Noto Serif Devanagari* |
| **Linter** | ESLint | `^9.0.0` | Code quality and Next.js recommended practices check |

---

## 9. Comprehensive User Journeys

### Journey 1: New Visitor Discovery & Self-Service Registration
```mermaid
sequenceDiagram
    autonumber
    actor Visitor as Couple / Family Host
    participant Web as Public Website (Next.js)
    participant Auth as Auth API (/api/auth)
    participant DB as MongoDB Atlas

    Visitor->>Web: Visits https://vivahvaani.kodetri.com/
    Web-->>Visitor: Displays Hero, Live Sample Patrika, Pain Points & Calculator
    Visitor->>Web: Clicks "See Live Sample Patrika" (/w/aarav-diya)
    Web-->>Visitor: Opens interactive card with real ceremonies & Google Maps
    Visitor->>Web: Clicks "Create Free Workspace" (/register)
    Visitor->>Web: Enters Name, Email, Password, Mobile Number
    Web->>Auth: POST /api/auth/register
    Auth->>DB: Check email duplicate & hash password with bcryptjs
    Auth->>DB: Insert new Admin record (role: "admin", plan: "free", limit: 1)
    Auth-->>Web: Returns JWT token & sets HTTP-only 'admin_token' cookie
    Web-->>Visitor: Stores token in localStorage & redirects to /dashboard
```

### Journey 2: Wedding Creation, Itinerary Setup & Guest Link Distribution
```mermaid
sequenceDiagram
    autonumber
    actor Host as Wedding Host (Admin)
    participant Dash as Dashboard (/dashboard)
    participant API as Admin API (/api/admin)
    participant DB as MongoDB Atlas

    Host->>Dash: Navigates to /dashboard/weddings
    Host->>Dash: Clicks "Create Wedding Card"
    Host->>Dash: Enters Bride, Groom, Date, Venue, City, Slug ("aarav-diya")
    Dash->>API: POST /api/admin/weddings
    API->>DB: Verify Admin subscription wedding quota limit
    API->>DB: Create Wedding record (status: "draft")
    API-->>Dash: Wedding created successfully

    Host->>Dash: Clicks "Manage Events & RSVPs" (/dashboard/weddings/[id])
    Host->>Dash: Adds Haldi, Sangeet, Vivah with Google Maps links
    Dash->>API: POST /api/admin/weddings/[id]/events
    API->>DB: Insert WeddingEvent records

    Host->>Dash: Switches to "Guest List & RSVPs" tab & adds VIP guest "Sharma Family"
    Dash->>API: POST /api/admin/weddings/[id]/guests
    API->>DB: Insert Guest with unique invite code (e.g. "SHARMA26")
    API-->>Dash: Guest added

    Host->>Dash: Clicks "Toggle Status" -> Published
    Dash->>API: PUT /api/admin/weddings/[id] { status: "published" }
    API->>DB: Update wedding status
    Host->>Dash: Clicks "Copy WhatsApp Invite"
    Dash-->>Host: Copies "https://vivahvaani.kodetri.com/w/aarav-diya?guest=SHARMA26"
```

### Journey 3: Wedding Guest Opening Patrika & Submitting RSVP
```mermaid
sequenceDiagram
    autonumber
    actor Guest as Wedding Guest (WhatsApp recipient)
    participant Browser as Mobile Browser
    participant API as Public API (/api/public)
    participant DB as MongoDB Atlas

    Guest->>Browser: Taps WhatsApp link (vivahvaani.kodetri.com/w/aarav-diya?guest=SHARMA26)
    Browser->>API: GET /api/public/wedding/aarav-diya?guest=SHARMA26
    API->>DB: Fetch published wedding, related events & guest by invite code
    API-->>Browser: Returns wedding details, itinerary, and guest personal info
    Browser-->>Guest: Renders Royal Patrika: "Honoured Guest: Mr. Rajesh Sharma & Family"
    
    Guest->>Browser: Taps "View Location Map" on Vivah function
    Browser-->>Guest: Opens Google Maps app navigated to venue GPS coordinates
    
    Guest->>Browser: Selects "Joyfully Accept", Headcount: 3, Message: "Badhaiyaan!"
    Browser->>API: POST /api/public/wedding/aarav-diya/rsvp
    API->>DB: Update Guest record (rsvpStatus: "attending", attendeeCount: 3)
    API-->>Browser: Returns confirmation message
    Browser-->>Guest: Displays "Thank You for Responding! (3 guests attending)"
```

### Journey 4: Super Admin Governance & Live Settings Update
```mermaid
sequenceDiagram
    autonumber
    actor Admin as Super Admin (Platform Owner)
    participant AdminUI as Super Admin Console (/admin)
    participant SAPI as Super Admin API (/api/super-admin)
    participant DB as MongoDB Atlas

    Admin->>AdminUI: Opens /admin & logs in with Super Admin credentials
    AdminUI->>SAPI: POST /api/auth/super-admin/login
    SAPI->>DB: Verify credentials in 'superadmins' collection
    SAPI-->>AdminUI: Returns JWT & sets 'super_admin_token' cookie
    AdminUI-->>Admin: Redirects to /admin/dashboard (shows platform metrics)

    Admin->>AdminUI: Navigates to /admin/settings/website
    Admin->>AdminUI: Updates Announcement Bar text & Indore HQ contact info
    AdminUI->>SAPI: PUT /api/super-admin/settings
    SAPI->>DB: Upsert SiteSettings document
    SAPI-->>AdminUI: Settings updated successfully
    
    Note over AdminUI,DB: Instantly reflects on public Header & Footer across all devices!
```

# VivahVaani Project Rules & Architecture Reference

## 1. Tech Stack & Directory Structure
- **Framework**: Next.js 16.4.6 (Turbopack, App Router, React 19.3.0)
- **Language**: TypeScript (`tsconfig.json`, strict checking)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/turbopack` 4.3.3) with `@import "tailwindcss";` in `app/globals.css`
- **Database & Auth**: MongoDB with Mongoose (`lib/mongodb.ts`, `models/`), bcryptjs, jsonwebtoken (JWT cookie auth)
- **Icons**: `lucide-react`
- **Root Project Path**: `wedding-invitation/`
  - `app/`: Next.js App Router
    - `app/(public)` or root routes: `/` (home), `/templates`, `/pricing`, `/about`, `/contact`, `/features`, `/how-it-works`
    - `app/w/[slug]/`: Public wedding patrika / live invitation route
    - `app/login/`, `app/register/`: User auth routes
    - `app/admin/`: Admin auth & dashboard (`/admin/dashboard`, `/admin/weddings`, `/admin/clients`, `/admin/settings/website`, `/admin/testimonials`)
    - `app/dashboard/`: Client user portal (`/dashboard/weddings`, `/dashboard/clients`)
    - `app/api/`: REST endpoints (`auth/`, `admin/`, `super-admin/`, `public/`)
  - `components/`: UI components (e.g. `components/public/Header.tsx`, `components/public/Footer.tsx`)
  - `lib/`: Utilities (`mongodb.ts`, auth tokens, helpers)
  - `models/`: Mongoose schemas (`User.ts`, `Wedding.ts`, `Settings.ts`, `Testimonial.ts`, etc.)

## 2. Typography & Theme Tokens
- **Font Strict Requirement**:
  - Always use `'Poppins', sans-serif` as the sole font family across all components and CSS files; never introduce other fonts.
- **Font Variables**:
  - `--font-poppins`: `Poppins` (weights 300, 400, 500, 600, 700; subsets `latin`, `devanagari`) configured via `next/font/google`.
  - All font aliases (`--font-body`, `--font-heading`, `--font-hindi`, `.font-body`, `.font-heading`, `.font-hindi`, etc.) map directly to `var(--font-poppins), sans-serif`.
  - All `body`, headings (`h1`-`h6`), `button`, `input`, `textarea`, and `select` strictly inherit and use `'Poppins', sans-serif`.
  - **Devanagari Rule**: Never add letter-spacing (`tracking-*`) to Devanagari text; it breaks the shirorekha (top line).
- **Core Color Palette**:
  - Backgrounds: `#FDFBF7` (warm royal ivory/cream), `stone-900`/`stone-950` (dark royal accents)
  - Royal Crimson/Maroon: `rose-700`, `rose-800`, `rose-900`, `rose-950`
  - Auspicious Gold/Amber: `amber-300`, `amber-400`, `amber-500`, `amber-600`, `amber-800`
  - Neutral Text: `stone-900`, `stone-800`, `stone-700`, `stone-600`, `stone-400`
  - Functional Accents: `emerald-600`/`emerald-700` (success/confirmed RSVP)

## 3. Strict Execution Rules
1. **Exclusive Font Rule**: Always use `'Poppins', sans-serif` as the sole font family across all components and CSS files; never introduce other fonts.
2. **Targeted Edits Only**: Edit only the exact files specified in the request. Never touch unrelated files.
3. **Preserve Logic & State**: Never alter existing state, API contracts, props, database models, or backend functionality unless explicitly commanded.
4. **No Unsolicited Refactoring**: Do not reformat or clean up code in surrounding files or components.
5. **Concise Diffs**: Apply code changes directly with pinpoint edits, avoiding verbose or unnecessary prose explanations.


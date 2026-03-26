# Cafe Roster PWA

A modern, role-based progressive web app built for cafe managers to easily schedule staff, and for staff to view their shifts. 

## Tech Stack

- **Framework:** Next.js 16 (App Router) / React 19
- **Database & Auth:** Supabase (PostgreSQL + Server-Side Auth)
- **Styling:** Tailwind CSS v4
- **Components:** Shadcn UI (Radix Primitives)
- **Language:** TypeScript strictly typed via Supabase Database Types

## Current Features

* **Secure Server-Side Authentication:** Utilises `@supabase/ssr` to handle secure session cookies exclusively on the server, completely hiding auth flow from the client.
* **Role-Based Access Control (RBAC):** Custom PostgreSQL database triggers automatically provision new users, defaulting them to `staff`. 
* **The "Traffic Cop" Proxy:** A Next.js `proxy.ts` (Next 16 middleware) actively intercepts route requests.
  * `manager` accounts are routed to the protected `/admin` portal.
  * `staff` accounts are routed to the protected `/dashboard` portal.
* **Row Level Security (RLS):** Database reads are strictly locked down using PostgreSQL policies, ensuring users can only access permitted data.

## Project Architecture

```text
CAFE-ROSTER-PWA/
├── app/
│   ├── admin/
│   │   ├── layout.tsx
│   │   └── page.tsx       # Protected Manager Portal
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   └── page.tsx       # Protected Staff Portal
│   ├── login/
│   │   ├── actions.ts     # Auth & Routing Server Actions
│   │   └── page.tsx       # Login UI
│   ├── globals.css
│   ├── layout.tsx         # Root Layout
│   └── page.tsx           # Auto-redirect to /login
├── components/
│   ├── shared/
│   │   └── Navbar.tsx     # Global Navigation & Logout
│   └── ui/                # Shadcn UI primitives (Button, Card, Input, etc.)
├── lib/
│   ├── supabase/
│   │   ├── client.ts      # Browser-side Supabase client
│   │   ├── middleware.ts  # Session refresher logic
│   │   ├── server.ts      # Server-side Supabase client
│   │   └── user.ts        # RBAC profile fetching utility
│   └── utils.ts
├── types/
│   └── database.types.ts  # Auto-generated Supabase types
├── proxy.ts               # Next.js 16 Edge Route Protection
├── next.config.ts
└── package.json
```

## Getting Started

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000 in your browser.
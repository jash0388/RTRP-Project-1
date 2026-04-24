# RoadSuraksha (SPHN)

Smart Traffic Violation Reporting & Analytics System — citizens report
traffic violations with photo/video evidence; police and admins review,
verify, and act on them via a dashboard.

## Stack

- **Frontend:** React 18 + Vite (in `client/`)
- **Backend:** Node.js + Express + Sequelize (in `server/`)
- **Database:** Replit PostgreSQL (via `DATABASE_URL`)
- **Auth (citizens):** Firebase Auth (Google sign-in) + backend JWT
- **Auth (police/admin):** Email/password (with optional Supabase JWT)

## How it runs on Replit

A single workflow, "Start application", runs `npm run dev` from the
repo root. That uses `concurrently` to start:

- The Express API on port `3001`
- The Vite dev server on `0.0.0.0:5000` (the public webview)

Vite proxies `/api/*` and `/uploads/*` to the backend on `3001`.

## Environment variables

Set in Replit Secrets / shared env:

- `DATABASE_URL`, `PG*` — auto-provisioned by Replit Postgres
- `PORT` — backend port (3001)
- `JWT_SECRET` — backend JWT signing key
- `FIREBASE_PROJECT_ID` — Firebase project for token verification
- `NODE_ENV` — development

Optional secrets (only if those auth methods are used):

- `GOOGLE_CLIENT_ID` — for Google ID token verification (server-side)
- `SUPABASE_JWT_SECRET` — for verifying Supabase-issued JWTs server-side

## Default seed accounts

The server seeds these on startup if they don't exist:

| Role    | Email              | Password           |
|---------|--------------------|--------------------|
| admin   | admin@sphn.com     | Admin@SPHN2024     |
| police  | police@sphn.com    | Police@SPHN2024    |
| citizen | citizen@sphn.com   | Citizen@SPHN2024   |

## Recent changes

- Migrated from Vercel/MySQL setup to run on Replit:
  - Removed bogus root `package.json` (had a Python `flask` dep)
  - Added a real root `package.json` that runs server+client together
  - Pointed `server/config/db.js` at `DATABASE_URL` (Replit Postgres)
  - Made Firebase Admin init non-fatal when a service account isn't
    present (falls back to `projectId`-only token verification)
  - Bound Vite to `0.0.0.0:5000` with `allowedHosts: true` and proxy to
    Express on `3001`

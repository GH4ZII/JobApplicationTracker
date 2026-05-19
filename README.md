# Job Application Tracker

A full-stack web app to manage job applications, interviews, deadlines, notes, and statuses.

> **Offline desktop (Windows):** On branch `feature/desktop-sqlite`, run a local SQLite + Tauri app with no Supabase. See [DESKTOP.md](./DESKTOP.md).

## Tech stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, Prisma
- **Database:** PostgreSQL (Supabase or local)

## Project structure

```
JobApplicationTracker/
  backend/     # REST API
  frontend/    # React UI
  desktop/     # Tauri Windows shell (desktop branch)
```

## Prerequisites

- Node.js 20+
- PostgreSQL database (e.g. [Supabase](https://supabase.com))

> **Første gang?** Se [GJENSTAAR.md](./GJENSTAAR.md) (norsk sjekkliste) eller [SETUP.md](./SETUP.md) (engelsk).

## Backend setup

```bash
cd backend
cp .env.example .env
# Edit .env — set DATABASE_URL from Supabase (Settings → Database → Connection string)
npm install
npx prisma migrate deploy
npm run dev
```

API runs at `http://localhost:3001`.

## Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Environment variables

| App | Variable | Example |
|-----|----------|---------|
| Backend | `DATABASE_URL` | `postgresql://...` |
| Backend | `PORT` | `3001` |
| Backend | `CORS_ORIGIN` | `http://localhost:5173` |
| Frontend | `VITE_API_URL` | `http://localhost:3001` |

## API endpoints

- `GET /health`
- `GET /applications` — optional `?status=` and `?search=`
- `GET /applications/:id`
- `POST /applications`
- `PATCH /applications/:id`
- `DELETE /applications/:id`
- `PATCH /applications/:id/status`

## Tests

Backend integration tests require `DATABASE_URL` in `backend/.env`:

```bash
cd backend
npm test
```

Without a database, integration tests are skipped.

## Root scripts

From the project root:

```bash
npm run dev:backend    # Start API
npm run dev:frontend   # Start UI
npm run build          # Build both apps
npm run test           # Backend tests
```

## Sample data

After migrations, seed demo applications:

```bash
cd backend
npm run db:seed
```

## Deployment

### Frontend (Vercel)

1. Import the repo and set the root directory to `frontend`.
2. Add environment variable `VITE_API_URL` pointing to your deployed API.
3. Build command: `npm run build` (default). Output: `dist`.

`frontend/vercel.json` includes SPA routing rewrites.

### Backend (Railway)

1. Create a service from the repo with root directory `backend`.
2. Add PostgreSQL (or link Supabase `DATABASE_URL`).
3. Set `CORS_ORIGIN` to your Vercel URL.
4. Railway uses `backend/railway.toml` to build, run migrations, and start the API.

### Supabase database

Use the **Transaction pooler** connection string for `DATABASE_URL` in production serverless setups when recommended by Supabase.

## Scripts

| Location | Command | Description |
|----------|---------|-------------|
| backend | `npm run dev` | Start API with hot reload |
| backend | `npm test` | Run Vitest tests |
| backend | `npm run db:seed` | Load sample applications |
| frontend | `npm run dev` | Start Vite dev server |
| frontend | `npm run build` | Production build |

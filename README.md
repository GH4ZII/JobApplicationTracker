# Job Application Tracker

A full-stack web app to manage job applications, interviews, deadlines, notes, and statuses.

## Tech stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, Prisma
- **Database:** PostgreSQL (Supabase or local)

## Project structure

```
JobApplicationTracker/
  backend/     # REST API
  frontend/    # React UI
```

## Prerequisites

- Node.js 20+
- PostgreSQL database (e.g. [Supabase](https://supabase.com))

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

## Scripts

| Location | Command | Description |
|----------|---------|-------------|
| backend | `npm run dev` | Start API with hot reload |
| backend | `npm test` | Run Vitest tests |
| frontend | `npm run dev` | Start Vite dev server |
| frontend | `npm run build` | Production build |

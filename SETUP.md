# Quick setup (done for you + one manual step)

## Already completed

- **GitHub:** `main` branch pushed with the full app ([repo](https://github.com/GH4ZII/JobApplicationTracker))
- **Supabase:** Restored project **GH4ZII's Project** (`supjudpbfovvzupsceqk`)
- **Database:** Applied `Application` table migration and inserted 3 sample rows

## One step you need (database password)

The API needs your Supabase database password. MCP cannot read it for security reasons.

1. Open [Supabase → GH4ZII's Project → Database](https://supabase.com/dashboard/project/supjudpbfovvzupsceqk/settings/database)
2. Copy the **URI** connection string (Transaction pooler or Direct).
3. Create `backend/.env`:

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

4. Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001
```

5. Run:

```bash
cd backend
npm install
npx prisma generate
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 — you should see the seeded applications.

## Deploy (manual — needs your accounts)

| Service | Root folder | Key settings |
|---------|-------------|--------------|
| **Vercel** | `frontend` | `VITE_API_URL` = your Railway API URL |
| **Railway** | `backend` | `DATABASE_URL`, `CORS_ORIGIN` = Vercel URL |

See [README.md](./README.md#deployment) for details.

## Optional: local Postgres (Docker)

If Docker Desktop is running:

```bash
docker compose up -d
```

Use in `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/jobtracker"
```

Then: `cd backend && npx prisma migrate deploy && npm run db:seed`

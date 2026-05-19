# Job Application Tracker — Backend

## Setup

1. Copy environment file:

```bash
cp .env.example .env
```

2. Set `DATABASE_URL` in `.env` to your PostgreSQL connection string (Supabase or local Postgres).

3. Install dependencies and apply migrations:

```bash
npm install
npx prisma migrate deploy
npx prisma generate
```

4. Start the dev server:

```bash
npm run dev
```

API base URL: `http://localhost:3001`

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/applications` | List (`?status=`, `?search=`) |
| GET | `/applications/:id` | Get one |
| POST | `/applications` | Create |
| PATCH | `/applications/:id` | Update |
| DELETE | `/applications/:id` | Delete |
| PATCH | `/applications/:id/status` | Update status only |

## Example create body

```json
{
  "companyName": "Acme Corp",
  "jobTitle": "Software Engineer",
  "status": "Applied",
  "appliedDate": "2025-05-01T00:00:00.000Z"
}
```

Status values: `Interested`, `Applied`, `Interview`, `Offer`, `Rejected`.

## Tests

```bash
npm test
```

Set `DATABASE_URL` in `.env` to run integration tests. Without it, tests are skipped.

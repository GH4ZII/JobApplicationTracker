# Hva som mangler og hva du må gjøre

Oversikt over Job Application Tracker — hva som allerede er på plass, og hva **du** må gjøre for å kjøre appen lokalt og eventuelt deploye den.

---

## ✅ Ferdig (allerede gjort)

| Område | Status |
|--------|--------|
| **Kode** | Full backend (Express + Prisma) og frontend (React + Vite + Tailwind) |
| **GitHub** | Pushet til `main`: https://github.com/GH4ZII/JobApplicationTracker |
| **Supabase-prosjekt** | «GH4ZII's Project» (`supjudpbfovvzupsceqk`) er aktivt |
| **Database-tabell** | `Application` med status-felt er opprettet |
| **Eksempeldata** | 3 jobbsøknader (Acme, Globex, Initech) ligger i databasen |
| **CI** | GitHub Actions bygger backend og frontend ved push |
| **Dokumentasjon** | `README.md`, `SETUP.md` (engelsk) |

---

## ❌ Det som mangler (krever deg)

### 1. Miljøfiler med hemmeligheter (viktigst)

Disse filene finnes **ikke** i repoet (med vilje — de skal ikke committes):

| Fil | Mangler |
|-----|---------|
| `backend/.env` | `DATABASE_URL` med Supabase-passord |
| `frontend/.env` | `VITE_API_URL` |

Uten `backend/.env` starter ikke API-et. Uten `frontend/.env` brukes standard `http://localhost:3001` (fungerer ofte lokalt).

### 2. Supabase database-passord

Jeg kan ikke hente passordet ditt fra Supabase. Du må kopiere connection string selv.

### 3. Lokal kjøring

Du har ikke bekreftet at backend og frontend kjører på maskinen din ennå (krever steg 1).

### 4. Deploy til produksjon (valgfritt)

| Tjeneste | Status |
|----------|--------|
| **Vercel** (frontend) | Ikke satt opp |
| **Railway** (backend) | Ikke satt opp |
| **GitHub secret** for CI-tester med ekte database | Ikke satt opp (valgfritt) |

### 5. Docker (valgfritt)

`docker-compose.yml` finnes, men Docker Desktop var ikke i gang sist. Alternativ til Supabase for lokal database.

### 6. Autentisering

Ikke planlagt i v1 — ingen innlogging ennå.

---

## 📋 Det du må gjøre — steg for steg

### Steg A: Kjør appen lokalt (ca. 10 min)

**A1.** Klon eller åpne prosjektet (hvis du ikke har det lokalt):

```bash
git clone https://github.com/GH4ZII/JobApplicationTracker.git
cd JobApplicationTracker
```

**A2.** Hent database-URL fra Supabase:

1. Gå til: https://supabase.com/dashboard/project/supjudpbfovvzupsceqk/settings/database  
2. Under **Connection string**, velg **URI** (Transaction pooler anbefales for server).  
3. Kopier strengen og erstatt `[YOUR-PASSWORD]` med databaspassordet ditt.

**A3.** Opprett `backend/.env`:

```env
DATABASE_URL="lim-inn-uri-fra-supabase-her"
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

**A4.** Opprett `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001
```

**A5.** Start backend (terminal 1):

```bash
cd backend
npm install
npx prisma generate
npm run dev
```

Du skal se noe lignende: `Server running on http://localhost:3001`

**A6.** Test API (valgfritt):

```bash
curl http://localhost:3001/health
curl http://localhost:3001/applications
```

**A7.** Start frontend (terminal 2):

```bash
cd frontend
npm install
npm run dev
```

**A8.** Åpne http://localhost:5173 i nettleseren.

Du bør se dashboard og de 3 eksempel-søknadene.

---

### Steg B: Deploy til internett (valgfritt, ca. 30 min)

**B1. Railway (backend)**

1. Logg inn på https://railway.app  
2. Nytt prosjekt → Deploy from GitHub → velg `JobApplicationTracker`  
3. Sett **Root Directory** til `backend`  
4. Legg til miljøvariabler:
   - `DATABASE_URL` = samme URI som i `backend/.env`
   - `CORS_ORIGIN` = fyll inn etter Vercel (steg B2), f.eks. `https://din-app.vercel.app`
   - `PORT` = `3001` (eller det Railway gir deg)
5. Deploy. Noter API-URL-en (f.eks. `https://xxx.up.railway.app`).

**B2. Vercel (frontend)**

1. Logg inn på https://vercel.com  
2. Import GitHub-repo → sett **Root Directory** til `frontend`  
3. Miljøvariabel:
   - `VITE_API_URL` = Railway API-URL fra B1  
4. Deploy.

**B3. Oppdater CORS på Railway**

Sett `CORS_ORIGIN` på Railway til den faktiske Vercel-URL-en og redeploy backend.

**B4. Migrasjoner i produksjon**

Railway kjører `npx prisma migrate deploy` via `railway.toml` ved deploy. Sjekk deploy-loggen at migrasjonen lykkes.

---

### Steg C: CI med ekte database-tester (valgfritt)

1. GitHub → repo → **Settings** → **Secrets and variables** → **Actions**  
2. Ny secret: `DATABASE_URL` = Supabase URI  
3. Oppdater `.github/workflows/ci.yml` til å bruke secret (eller kjør tester manuelt lokalt med `npm test` i `backend/`).

---

## 🔍 Sjekkliste — er du ferdig?

- [ ] `backend/.env` opprettet med gyldig `DATABASE_URL`
- [ ] `frontend/.env` opprettet
- [ ] `npm run dev` i `backend/` kjører uten feil
- [ ] `http://localhost:3001/health` returnerer `{"status":"ok"}`
- [ ] `http://localhost:3001/applications` returnerer en liste
- [ ] `npm run dev` i `frontend/` kjører
- [ ] Appen i nettleseren viser data
- [ ] (Valgfritt) Vercel + Railway deployet
- [ ] (Valgfritt) `CORS_ORIGIN` og `VITE_API_URL` matcher produksjons-URL-er

---

## 🆘 Vanlige problemer

| Problem | Løsning |
|---------|---------|
| `Missing required environment variable: DATABASE_URL` | Opprett `backend/.env` med Supabase URI |
| `Can't reach database server` | Sjekk passord i URI; sjekk at Supabase-prosjektet er aktivt |
| Frontend viser ingen data | Er backend i gang? Stemmer `VITE_API_URL`? |
| CORS-feil i nettleseren | Sett `CORS_ORIGIN` til frontend-URL (lokalt: `http://localhost:5173`) |
| Docker feiler | Start Docker Desktop, eller bruk Supabase i stedet |

---

## Lenker

- **Repo:** https://github.com/GH4ZII/JobApplicationTracker  
- **Supabase dashboard:** https://supabase.com/dashboard/project/supjudpbfovvzupsceqk  
- **Engelsk setup:** [SETUP.md](./SETUP.md)  
- **Teknisk README:** [README.md](./README.md)

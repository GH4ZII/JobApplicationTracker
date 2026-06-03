# Desktop-app (offline)

Job Application Tracker kan kjøres som en **lokal Windows desktop-app** uten Supabase, terminaler eller nettleser.

## Hva som er annerledes

| Web (main) | Desktop (denne branchen) |
|------------|--------------------------|
| PostgreSQL / Supabase | SQLite-fil på PC-en |
| Frontend + backend separat | Én server (API + UI) |
| `npm run dev` i to terminaler | `npm run desktop:dev` |

Databasen lagres her:

`%APPDATA%\JobApplicationTracker\jobtracker.db`

## Forutsetninger (engangs)

1. **Node.js 20+**
2. **Rust** — https://rustup.rs/
3. **Visual Studio Build Tools** med *Desktop development with C++*

## Første gangs oppsett

```bash
git checkout feature/desktop-sqlite
npm install --prefix backend
npm install --prefix frontend
npm install --prefix desktop
```

Opprett `backend/.env` (valgfritt — standard bruker lokal SQLite):

```env
DATABASE_URL="file:./data/jobtracker.db"
PORT=3001
CORS_ORIGIN=http://localhost:3001
```

## Kjøre i utvikling

```bash
npm run desktop:dev
```

Dette starter backend og åpner et Tauri-vindu mot `http://127.0.0.1:3001`.

## Bygge installer (.exe)

```bash
npm run desktop:build
```

Installer finnes typisk under:

`desktop/src-tauri/target/release/bundle/nsis/`

## Kjøre uten Tauri (kun nettleser, én kommando)

```bash
npm run build
npm run start
```

Åpne http://localhost:3001

## Feilsøking

| Problem | Løsning |
|---------|---------|
| `rustc` ikke funnet | Installer Rust via rustup |
| Tauri build feiler | Installer VS Build Tools (C++) |
| Port 3001 opptatt | Stopp gammel `npm run dev` / backend-prosess |
| Tom app første gang | Normalt — seed kjører automatisk ved første oppstart |
| Appen fryser / «Svarer ikke» | Backend startet ikke. Se loggfilen under (eller kjør sidecar manuelt) |

### Se feilmeldinger

**Loggfil (etter nyere build):**

`%APPDATA%\JobApplicationTracker\app.log`

**Test backend alene i PowerShell:**

```powershell
cd desktop\src-tauri\binaries
$env:PORT=3001
$env:SERVE_FRONTEND="true"
$env:NODE_ENV="production"
.\job-tracker-api-x86_64-pc-windows-msvc.exe
```

Hvis dette krasjer, vises feilen i terminalen (f.eks. Prisma `MODULE_NOT_FOUND`). Lukk appen før `npm run desktop:build`.

## Branch

Arbeidet ligger på `feature/desktop-sqlite`. Merge til `main` krever beslutning om å erstatte Supabase fullt ut eller støtte begge moduser.

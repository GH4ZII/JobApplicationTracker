import "dotenv/config";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function resolveDefaultDatabaseUrl(): string {
  const appData =
    process.env.APP_DATA_DIR ??
    (process.platform === "win32"
      ? process.env.APPDATA
      : process.env.XDG_DATA_HOME) ??
    path.join(os.homedir(), ".local", "share");

  const dbDir = path.join(appData, "JobApplicationTracker");
  fs.mkdirSync(dbDir, { recursive: true });
  const dbPath = path.join(dbDir, "jobtracker.db");
  return `file:${dbPath}`;
}

export function ensureDatabaseUrl(): string {
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = resolveDefaultDatabaseUrl();
  }

  const url = process.env.DATABASE_URL;
  if (url.startsWith("file:")) {
    const filePath = url.replace(/^file:/, "");
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  return url;
}

export const env = {
  port: Number(process.env.PORT ?? 3001),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3001",
  isProduction: process.env.NODE_ENV === "production",
  serveFrontend: process.env.SERVE_FRONTEND !== "false",
};

export function getDatabaseUrl(): string {
  return requireEnv("DATABASE_URL");
}

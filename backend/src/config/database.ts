import fs from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { ensureDatabaseUrl } from "./env.js";
import { getBackendRoot } from "./paths.js";

const seedData = [
  {
    companyName: "Acme Corp",
    jobTitle: "Software Engineer",
    location: "Remote",
    status: "APPLIED" as const,
    appliedDate: new Date("2025-04-15"),
    deadline: new Date("2025-06-01"),
    notes: "Referred by a friend.",
  },
  {
    companyName: "Globex",
    jobTitle: "Frontend Developer",
    location: "Oslo, Norway",
    status: "INTERVIEW" as const,
    appliedDate: new Date("2025-04-20"),
    interviewDate: new Date("2025-05-25"),
    salaryRange: "650k - 750k NOK",
  },
  {
    companyName: "Initech",
    jobTitle: "Product Manager",
    location: "Bergen, Norway",
    status: "INTERESTED" as const,
    jobUrl: "https://example.com/jobs/pm",
  },
];

async function runMigrations(backendRoot: string): Promise<void> {
  const prismaCli = path.join(
    backendRoot,
    "node_modules",
    "prisma",
    "build",
    "index.js",
  );

  if (fs.existsSync(prismaCli)) {
    const result = spawnSync(
      process.execPath,
      [prismaCli, "migrate", "deploy"],
      {
        cwd: backendRoot,
        stdio: "pipe",
        env: process.env,
      },
    );

    if (result.status === 0) {
      return;
    }
  }

  const prisma = new PrismaClient();
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Application" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "companyName" TEXT NOT NULL,
        "jobTitle" TEXT NOT NULL,
        "location" TEXT,
        "jobUrl" TEXT,
        "status" TEXT NOT NULL DEFAULT 'INTERESTED',
        "appliedDate" DATETIME,
        "deadline" DATETIME,
        "interviewDate" DATETIME,
        "salaryRange" TEXT,
        "contactPerson" TEXT,
        "contactEmail" TEXT,
        "notes" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
    `);
  } finally {
    await prisma.$disconnect();
  }
}

export async function initializeDatabase(): Promise<void> {
  ensureDatabaseUrl();

  const backendRoot = getBackendRoot();
  process.env.BACKEND_ROOT = backendRoot;

  await runMigrations(backendRoot);

  const prisma = new PrismaClient();
  try {
    const count = await prisma.application.count();
    if (count === 0) {
      await prisma.application.createMany({ data: seedData });
      console.log("Seeded sample applications.");
    }
  } finally {
    await prisma.$disconnect();
  }
}

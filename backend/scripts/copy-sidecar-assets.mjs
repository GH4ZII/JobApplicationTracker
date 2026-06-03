import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const binariesDir = path.resolve(backendRoot, "../desktop/src-tauri/binaries");

function copyDir(source, target) {
  if (!fs.existsSync(source)) {
    console.error(`Missing ${source}. Run: npm install && npx prisma generate --prefix backend`);
    process.exit(1);
  }

  fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, { recursive: true });
  console.log(`Copied ${source} -> ${target}`);
}

const prismaClient = path.join(backendRoot, "node_modules/.prisma");
const prismaVendor = path.join(backendRoot, "node_modules/@prisma");
const frontendDist = path.join(backendRoot, "frontend/dist");

copyDir(prismaClient, path.join(binariesDir, ".prisma"));
copyDir(prismaVendor, path.join(binariesDir, "node_modules/@prisma"));
copyDir(frontendDist, path.join(binariesDir, "frontend/dist"));

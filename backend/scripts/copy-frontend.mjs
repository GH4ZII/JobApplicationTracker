import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.resolve(backendRoot, "../frontend/dist");
const target = path.join(backendRoot, "frontend/dist");

if (!fs.existsSync(path.join(source, "index.html"))) {
  console.error("Frontend build not found. Run: npm run build --prefix frontend");
  process.exit(1);
}

fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(source, target, { recursive: true });
console.log(`Copied frontend dist to ${target}`);

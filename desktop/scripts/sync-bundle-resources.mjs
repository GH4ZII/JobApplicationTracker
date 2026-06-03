import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const desktopRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const binariesDir = path.join(desktopRoot, "src-tauri/binaries");
const bundleDir = path.join(desktopRoot, "src-tauri/bundle-resources");

const copies = [
  [path.join(binariesDir, ".prisma"), path.join(bundleDir, ".prisma")],
  [path.join(binariesDir, "node_modules"), path.join(bundleDir, "node_modules")],
  [path.join(binariesDir, "frontend"), path.join(bundleDir, "frontend")],
];

for (const [source, target] of copies) {
  if (!fs.existsSync(source)) {
    console.error(`Missing sidecar assets at ${source}. Run: npm run build:sidecar --prefix backend`);
    process.exit(1);
  }

  fs.rmSync(target, { recursive: true, force: true });
  fs.cpSync(source, target, { recursive: true });
  console.log(`Synced ${source} -> ${target}`);
}

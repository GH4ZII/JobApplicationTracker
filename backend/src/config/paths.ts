import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function getBackendRoot(): string {
  if (process.env.BACKEND_ROOT) {
    return process.env.BACKEND_ROOT;
  }

  if ("pkg" in process) {
    return path.dirname(process.execPath);
  }

  return path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../..",
  );
}

export function getFrontendDistPath(): string {
  const backendRoot = getBackendRoot();
  const packaged = path.join(backendRoot, "frontend", "dist");
  const dev = path.resolve(backendRoot, "..", "frontend", "dist");

  // Packaged sidecar ships frontend next to the binary.
  if ("pkg" in process && fs.existsSync(path.join(packaged, "index.html"))) {
    return packaged;
  }

  // Dev/desktop: always use the latest Vite build from frontend/.
  if (fs.existsSync(path.join(dev, "index.html"))) {
    return dev;
  }

  return packaged;
}

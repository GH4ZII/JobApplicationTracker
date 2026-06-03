import fs from "node:fs";
import Module from "node:module";
import path from "node:path";

function sidecarRoot(): string {
  if (process.env.SIDECAR_ROOT) {
    return process.env.SIDECAR_ROOT;
  }

  const base = path.dirname(process.execPath);
  const bundled = path.join(base, "bundle-resources");
  if (fs.existsSync(path.join(bundled, ".prisma", "client", "index.js"))) {
    return bundled;
  }

  return base;
}

function prismaClientDir(): string {
  const root = sidecarRoot();
  const nested = path.join(root, ".prisma", "client");
  if (fs.existsSync(path.join(nested, "index.js"))) {
    return nested;
  }

  const flat = path.join(root, ".prisma");
  if (fs.existsSync(path.join(flat, "index.js"))) {
    return flat;
  }

  return nested;
}

function resolvePrismaClientFile(request: string): string | null {
  const clientDir = prismaClientDir();
  if (!fs.existsSync(path.join(clientDir, "index.js"))) {
    return null;
  }

  const subpath = request.replace(/^\.prisma\/client\/?/, "") || "default";
  const fileName = subpath.endsWith(".js") ? subpath : `${subpath}.js`;
  const resolved = path.join(clientDir, fileName);

  return fs.existsSync(resolved) ? resolved : null;
}

function resolveSidecarModule(request: string): string | null {
  if (request === "#main-entry-point") {
    const indexPath = path.join(prismaClientDir(), "index.js");
    return fs.existsSync(indexPath) ? indexPath : null;
  }

  if (request === ".prisma/client" || request.startsWith(".prisma/client/")) {
    return resolvePrismaClientFile(request);
  }

  if (request.startsWith("@prisma/")) {
    const rel = request.slice("@prisma/".length);
    const moduleRoot = path.join(sidecarRoot(), "node_modules", "@prisma", rel);
    const candidates = [
      moduleRoot,
      `${moduleRoot}.js`,
      `${moduleRoot}.mjs`,
      path.join(moduleRoot, "index.js"),
    ];

    for (const candidate of candidates) {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return candidate;
      }
    }
  }

  return null;
}

export function patchPrismaForPkg(): void {
  if (!("pkg" in process)) {
    return;
  }

  const moduleWithResolve = Module as typeof Module & {
    _resolveFilename: (
      request: string,
      parent: Module | undefined,
      isMain: boolean,
      options?: unknown,
    ) => string;
  };

  const originalResolve = moduleWithResolve._resolveFilename.bind(Module);

  moduleWithResolve._resolveFilename = function resolveFilename(
    request: string,
    parent: Module | undefined,
    isMain: boolean,
    options?: unknown,
  ) {
    const resolved = resolveSidecarModule(request);
    if (resolved) {
      return resolved;
    }

    return originalResolve(request, parent, isMain, options);
  };
}

patchPrismaForPkg();

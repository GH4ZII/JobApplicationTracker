import express from "express";
import fs from "node:fs";
import path from "node:path";
import { corsMiddleware } from "./config/cors.js";
import { env } from "./config/env.js";
import { getFrontendDistPath } from "./config/paths.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiRouter } from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(corsMiddleware);
  app.use(express.json());
  app.use(apiRouter);

  if (env.serveFrontend) {
    const frontendDist = getFrontendDistPath();
    const indexHtml = path.join(frontendDist, "index.html");

    if (fs.existsSync(indexHtml)) {
      app.use(express.static(frontendDist));

      app.use((req, res, next) => {
        if (
          req.method !== "GET" ||
          req.path.startsWith("/applications") ||
          req.path === "/health"
        ) {
          next();
          return;
        }

        res.sendFile(indexHtml);
      });
    }
  }

  app.use(errorHandler);

  return app;
}

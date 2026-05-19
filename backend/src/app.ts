import express from "express";
import { corsMiddleware } from "./config/cors.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiRouter } from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(corsMiddleware);
  app.use(express.json());
  app.use(apiRouter);
  app.use(errorHandler);

  return app;
}

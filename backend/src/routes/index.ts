import { Router } from "express";
import { applicationRouter } from "./application.routes.js";
import { healthRouter } from "./health.routes.js";

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use("/applications", applicationRouter);

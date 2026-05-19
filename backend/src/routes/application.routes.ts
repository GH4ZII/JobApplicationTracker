import { Router } from "express";
import {
  createApplication,
  deleteApplication,
  getApplication,
  listApplications,
  updateApplication,
  updateApplicationStatus,
} from "../controllers/application.controller.js";

export const applicationRouter = Router();

applicationRouter.get("/", listApplications);
applicationRouter.get("/:id", getApplication);
applicationRouter.post("/", createApplication);
applicationRouter.patch("/:id/status", updateApplicationStatus);
applicationRouter.patch("/:id", updateApplication);
applicationRouter.delete("/:id", deleteApplication);

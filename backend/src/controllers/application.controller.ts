import type { Request, Response, NextFunction } from "express";
import { applicationService } from "../services/application.service.js";
import {
  createApplicationSchema,
  listApplicationsQuerySchema,
  updateApplicationSchema,
  updateStatusSchema,
} from "../validators/application.validator.js";

function getIdParam(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

export async function listApplications(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listApplicationsQuerySchema.parse(req.query);
    const applications = await applicationService.list(query);
    res.json(applications);
  } catch (error) {
    next(error);
  }
}

export async function getApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const application = await applicationService.getById(getIdParam(req.params.id));
    res.json(application);
  } catch (error) {
    next(error);
  }
}

export async function createApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const body = createApplicationSchema.parse(req.body);
    const application = await applicationService.create(body);
    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
}

export async function updateApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const body = updateApplicationSchema.parse(req.body);
    const application = await applicationService.update(getIdParam(req.params.id), body);
    res.json(application);
  } catch (error) {
    next(error);
  }
}

export async function updateApplicationStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const body = updateStatusSchema.parse(req.body);
    const application = await applicationService.updateStatus(getIdParam(req.params.id), body.status);
    res.json(application);
  } catch (error) {
    next(error);
  }
}

export async function deleteApplication(req: Request, res: Response, next: NextFunction) {
  try {
    await applicationService.delete(getIdParam(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

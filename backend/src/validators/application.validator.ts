import { z } from "zod";
import { APPLICATION_STATUSES } from "../types/application.js";

const optionalString = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((v) => (v === "" ? null : v));

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((v) => (v === "" ? null : v))
  .refine((v) => v === null || v === undefined || /^https?:\/\/.+/i.test(v), {
    message: "jobUrl must be a valid http(s) URL",
  });

const optionalEmail = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((v) => (v === "" ? null : v))
  .refine((v) => v === null || v === undefined || z.string().email().safeParse(v).success, {
    message: "contactEmail must be a valid email",
  });

const optionalDate = z.string().optional().nullable();

const statusSchema = z.enum(APPLICATION_STATUSES);

export const createApplicationSchema = z.object({
  companyName: z.string().trim().min(1, "companyName is required"),
  jobTitle: z.string().trim().min(1, "jobTitle is required"),
  location: optionalString,
  jobUrl: optionalUrl,
  status: statusSchema.optional(),
  appliedDate: optionalDate,
  deadline: optionalDate,
  interviewDate: optionalDate,
  salaryRange: optionalString,
  contactPerson: optionalString,
  contactEmail: optionalEmail,
  notes: optionalString,
});

export const updateApplicationSchema = createApplicationSchema.partial();

export const updateStatusSchema = z.object({
  status: statusSchema,
});

export const listApplicationsQuerySchema = z.object({
  status: statusSchema.optional(),
  search: z.string().trim().optional(),
});

export type CreateApplicationDto = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationDto = z.infer<typeof updateApplicationSchema>;
export type UpdateStatusDto = z.infer<typeof updateStatusSchema>;
export type ListApplicationsQuery = z.infer<typeof listApplicationsQuerySchema>;

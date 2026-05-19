import type { ApplicationStatus as PrismaStatus } from "@prisma/client";

export const APPLICATION_STATUSES = [
  "Interested",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type ApplicationResponse = {
  id: string;
  companyName: string;
  jobTitle: string;
  location: string | null;
  jobUrl: string | null;
  status: ApplicationStatus;
  appliedDate: string | null;
  deadline: string | null;
  interviewDate: string | null;
  salaryRange: string | null;
  contactPerson: string | null;
  contactEmail: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateApplicationInput = {
  companyName: string;
  jobTitle: string;
  location?: string | null;
  jobUrl?: string | null;
  status?: ApplicationStatus;
  appliedDate?: string | null;
  deadline?: string | null;
  interviewDate?: string | null;
  salaryRange?: string | null;
  contactPerson?: string | null;
  contactEmail?: string | null;
  notes?: string | null;
};

export type UpdateApplicationInput = Partial<CreateApplicationInput>;

const STATUS_TO_PRISMA: Record<ApplicationStatus, PrismaStatus> = {
  Interested: "INTERESTED",
  Applied: "APPLIED",
  Interview: "INTERVIEW",
  Offer: "OFFER",
  Rejected: "REJECTED",
};

const PRISMA_TO_STATUS: Record<PrismaStatus, ApplicationStatus> = {
  INTERESTED: "Interested",
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

export function toPrismaStatus(status: ApplicationStatus): PrismaStatus {
  return STATUS_TO_PRISMA[status];
}

export function fromPrismaStatus(status: PrismaStatus): ApplicationStatus {
  return PRISMA_TO_STATUS[status];
}

export function toIsoDate(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null;
}

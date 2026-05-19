export const APPLICATION_STATUSES = [
  "Interested",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type Application = {
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

export type ApplicationInput = {
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

import { apiRequest } from "./client.ts";
import type { Application, ApplicationInput, ApplicationStatus } from "../types/application.ts";

export async function fetchApplications(params?: {
  status?: ApplicationStatus;
  search?: string;
}): Promise<Application[]> {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.search) query.set("search", params.search);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return apiRequest<Application[]>(`/applications${suffix}`);
}

export async function fetchApplication(id: string): Promise<Application> {
  return apiRequest<Application>(`/applications/${id}`);
}

export async function createApplication(input: ApplicationInput): Promise<Application> {
  return apiRequest<Application>("/applications", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateApplication(
  id: string,
  input: Partial<ApplicationInput>,
): Promise<Application> {
  return apiRequest<Application>(`/applications/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<Application> {
  return apiRequest<Application>(`/applications/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteApplication(id: string): Promise<void> {
  await apiRequest<void>(`/applications/${id}`, { method: "DELETE" });
}

import { Prisma, type Application } from "@prisma/client";
import { applicationRepository } from "../repositories/application.repository.js";
import type {
  ApplicationResponse,
  ApplicationStatus,
  CreateApplicationInput,
  UpdateApplicationInput,
} from "../types/application.js";
import {
  fromPrismaStatus,
  toIsoDate,
  toPrismaStatus,
} from "../types/application.js";
import type {
  CreateApplicationDto,
  ListApplicationsQuery,
  UpdateApplicationDto,
} from "../validators/application.validator.js";

export class NotFoundError extends Error {
  constructor(message = "Application not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

function parseOptionalDate(value: string | null | undefined): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }
  return date;
}

function toResponse(application: Application): ApplicationResponse {
  return {
    id: application.id,
    companyName: application.companyName,
    jobTitle: application.jobTitle,
    location: application.location,
    jobUrl: application.jobUrl,
    status: fromPrismaStatus(application.status),
    appliedDate: toIsoDate(application.appliedDate),
    deadline: toIsoDate(application.deadline),
    interviewDate: toIsoDate(application.interviewDate),
    salaryRange: application.salaryRange,
    contactPerson: application.contactPerson,
    contactEmail: application.contactEmail,
    notes: application.notes,
    createdAt: application.createdAt.toISOString(),
    updatedAt: application.updatedAt.toISOString(),
  };
}

function mapCreateDto(dto: CreateApplicationDto): CreateApplicationInput {
  return {
    companyName: dto.companyName,
    jobTitle: dto.jobTitle,
    location: dto.location,
    jobUrl: dto.jobUrl,
    status: dto.status,
    appliedDate: dto.appliedDate ?? undefined,
    deadline: dto.deadline ?? undefined,
    interviewDate: dto.interviewDate ?? undefined,
    salaryRange: dto.salaryRange,
    contactPerson: dto.contactPerson,
    contactEmail: dto.contactEmail,
    notes: dto.notes,
  };
}

function toRepositoryCreateData(input: CreateApplicationInput) {
  return {
    companyName: input.companyName,
    jobTitle: input.jobTitle,
    location: input.location,
    jobUrl: input.jobUrl,
    status: input.status ? toPrismaStatus(input.status) : undefined,
    appliedDate: parseOptionalDate(input.appliedDate),
    deadline: parseOptionalDate(input.deadline),
    interviewDate: parseOptionalDate(input.interviewDate),
    salaryRange: input.salaryRange,
    contactPerson: input.contactPerson,
    contactEmail: input.contactEmail,
    notes: input.notes,
  };
}

function toRepositoryUpdateData(input: UpdateApplicationInput) {
  const data: Record<string, unknown> = {};

  if (input.companyName !== undefined) data.companyName = input.companyName;
  if (input.jobTitle !== undefined) data.jobTitle = input.jobTitle;
  if (input.location !== undefined) data.location = input.location;
  if (input.jobUrl !== undefined) data.jobUrl = input.jobUrl;
  if (input.status !== undefined) data.status = toPrismaStatus(input.status);
  if (input.appliedDate !== undefined) data.appliedDate = parseOptionalDate(input.appliedDate);
  if (input.deadline !== undefined) data.deadline = parseOptionalDate(input.deadline);
  if (input.interviewDate !== undefined) data.interviewDate = parseOptionalDate(input.interviewDate);
  if (input.salaryRange !== undefined) data.salaryRange = input.salaryRange;
  if (input.contactPerson !== undefined) data.contactPerson = input.contactPerson;
  if (input.contactEmail !== undefined) data.contactEmail = input.contactEmail;
  if (input.notes !== undefined) data.notes = input.notes;

  return data;
}

export class ApplicationService {
  async list(query: ListApplicationsQuery): Promise<ApplicationResponse[]> {
    const applications = await applicationRepository.findAll({
      status: query.status ? toPrismaStatus(query.status) : undefined,
      search: query.search,
    });
    return applications.map(toResponse);
  }

  async getById(id: string): Promise<ApplicationResponse> {
    const application = await applicationRepository.findById(id);
    if (!application) {
      throw new NotFoundError();
    }
    return toResponse(application);
  }

  async create(dto: CreateApplicationDto): Promise<ApplicationResponse> {
    const input = mapCreateDto(dto);
    const application = await applicationRepository.create(toRepositoryCreateData(input));
    return toResponse(application);
  }

  async update(id: string, dto: UpdateApplicationDto): Promise<ApplicationResponse> {
    await this.getById(id);
    const application = await applicationRepository.update(id, toRepositoryUpdateData(dto));
    return toResponse(application);
  }

  async updateStatus(id: string, status: ApplicationStatus): Promise<ApplicationResponse> {
    await this.getById(id);
    const application = await applicationRepository.update(id, {
      status: toPrismaStatus(status),
    });
    return toResponse(application);
  }

  async delete(id: string): Promise<void> {
    try {
      await applicationRepository.delete(id);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new NotFoundError();
      }
      throw error;
    }
  }
}

export const applicationService = new ApplicationService();

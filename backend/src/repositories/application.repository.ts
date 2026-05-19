import type { Application, ApplicationStatus as PrismaStatus, Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export type ApplicationCreateData = {
  companyName: string;
  jobTitle: string;
  location?: string | null;
  jobUrl?: string | null;
  status?: PrismaStatus;
  appliedDate?: Date | null;
  deadline?: Date | null;
  interviewDate?: Date | null;
  salaryRange?: string | null;
  contactPerson?: string | null;
  contactEmail?: string | null;
  notes?: string | null;
};

export type ApplicationUpdateData = Partial<ApplicationCreateData>;

export class ApplicationRepository {
  async findAll(filters?: {
    status?: PrismaStatus;
    search?: string;
  }): Promise<Application[]> {
    const where: Prisma.ApplicationWhereInput = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { companyName: { contains: filters.search, mode: "insensitive" } },
        { jobTitle: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return prisma.application.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });
  }

  async findById(id: string): Promise<Application | null> {
    return prisma.application.findUnique({ where: { id } });
  }

  async create(data: ApplicationCreateData): Promise<Application> {
    return prisma.application.create({ data });
  }

  async update(id: string, data: ApplicationUpdateData): Promise<Application> {
    return prisma.application.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Application> {
    return prisma.application.delete({ where: { id } });
  }
}

export const applicationRepository = new ApplicationRepository();

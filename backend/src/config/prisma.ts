import { PrismaClient } from "@prisma/client";
import { ensureDatabaseUrl } from "./env.js";

ensureDatabaseUrl();

export const prisma = new PrismaClient();

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "location" TEXT,
    "jobUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'INTERESTED',
    "appliedDate" DATETIME,
    "deadline" DATETIME,
    "interviewDate" DATETIME,
    "salaryRange" TEXT,
    "contactPerson" TEXT,
    "contactEmail" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

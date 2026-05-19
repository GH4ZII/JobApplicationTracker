import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.application.deleteMany();

  await prisma.application.createMany({
    data: [
      {
        companyName: "Acme Corp",
        jobTitle: "Software Engineer",
        location: "Remote",
        status: "APPLIED",
        appliedDate: new Date("2025-04-15"),
        deadline: new Date("2025-06-01"),
        notes: "Referred by a friend.",
      },
      {
        companyName: "Globex",
        jobTitle: "Frontend Developer",
        location: "Oslo, Norway",
        status: "INTERVIEW",
        appliedDate: new Date("2025-04-20"),
        interviewDate: new Date("2025-05-25"),
        salaryRange: "650k - 750k NOK",
      },
      {
        companyName: "Initech",
        jobTitle: "Product Manager",
        location: "Bergen, Norway",
        status: "INTERESTED",
        jobUrl: "https://example.com/jobs/pm",
      },
    ],
  });

  console.log("Seeded sample applications.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import type { Express } from "express";

const hasDatabase = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDatabase)("Applications API", () => {
  let app: Express;

  beforeAll(async () => {
    const { createApp } = await import("../src/app.js");
    app = createApp();
  });

  beforeEach(async () => {
    const { prisma } = await import("../src/config/prisma.js");
    await prisma.application.deleteMany();
  });

  afterAll(async () => {
    const { prisma } = await import("../src/config/prisma.js");
    await prisma.$disconnect();
  });

  it("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("POST /applications creates an application", async () => {
    const res = await request(app).post("/applications").send({
      companyName: "Acme Corp",
      jobTitle: "Software Engineer",
      status: "Applied",
    });

    expect(res.status).toBe(201);
    expect(res.body.companyName).toBe("Acme Corp");
    expect(res.body.jobTitle).toBe("Software Engineer");
    expect(res.body.status).toBe("Applied");
    expect(res.body.id).toBeDefined();
  });

  it("GET /applications lists applications", async () => {
    await request(app).post("/applications").send({
      companyName: "Beta Inc",
      jobTitle: "Designer",
    });

    const res = await request(app).get("/applications");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].companyName).toBe("Beta Inc");
  });

  it("GET /applications/:id returns one application", async () => {
    const created = await request(app).post("/applications").send({
      companyName: "Gamma LLC",
      jobTitle: "PM",
    });

    const res = await request(app).get(`/applications/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.companyName).toBe("Gamma LLC");
  });

  it("PATCH /applications/:id updates an application", async () => {
    const created = await request(app).post("/applications").send({
      companyName: "Delta Co",
      jobTitle: "Analyst",
    });

    const res = await request(app)
      .patch(`/applications/${created.body.id}`)
      .send({ location: "Remote" });

    expect(res.status).toBe(200);
    expect(res.body.location).toBe("Remote");
  });

  it("PATCH /applications/:id/status updates status only", async () => {
    const created = await request(app).post("/applications").send({
      companyName: "Epsilon",
      jobTitle: "Dev",
      status: "Interested",
    });

    const res = await request(app)
      .patch(`/applications/${created.body.id}/status`)
      .send({ status: "Interview" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("Interview");
  });

  it("DELETE /applications/:id removes an application", async () => {
    const created = await request(app).post("/applications").send({
      companyName: "Zeta",
      jobTitle: "QA",
    });

    const del = await request(app).delete(`/applications/${created.body.id}`);
    expect(del.status).toBe(204);

    const get = await request(app).get(`/applications/${created.body.id}`);
    expect(get.status).toBe(404);
  });

  it("returns 400 for invalid create payload", async () => {
    const res = await request(app).post("/applications").send({
      companyName: "",
      jobTitle: "Engineer",
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  it("returns 404 for missing application", async () => {
    const res = await request(app).get("/applications/nonexistent-id");
    expect(res.status).toBe(404);
  });

  it("filters by status and search query", async () => {
    await request(app).post("/applications").send({
      companyName: "Searchable Co",
      jobTitle: "Backend Dev",
      status: "Applied",
    });
    await request(app).post("/applications").send({
      companyName: "Other Co",
      jobTitle: "Designer",
      status: "Rejected",
    });

    const byStatus = await request(app).get("/applications?status=Applied");
    expect(byStatus.body).toHaveLength(1);
    expect(byStatus.body[0].companyName).toBe("Searchable Co");

    const bySearch = await request(app).get("/applications?search=searchable");
    expect(bySearch.body).toHaveLength(1);
  });
});

describe("Applications API without database", () => {
  it("skips integration tests when DATABASE_URL is unset", () => {
    if (hasDatabase) {
      expect(true).toBe(true);
      return;
    }
    expect(process.env.DATABASE_URL).toBeUndefined();
  });
});

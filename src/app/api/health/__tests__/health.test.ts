import { describe, it, expect, vi } from "vitest";
import { GET } from "../route";

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    $queryRaw: vi.fn().mockResolvedValue([{ 1: 1 }]),
  },
}));

describe("Health Check API", () => {
  it("should return status 200 and healthy services when database responds", async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.status).toBe("pass");
    expect(body.services.database.status).toBe("healthy");
    expect(body.services.application.status).toBe("healthy");
    expect(typeof body.durationMs).toBe("number");
  });
});

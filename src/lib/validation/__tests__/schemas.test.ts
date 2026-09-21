import { describe, it, expect } from "vitest";
import { experienceSchema } from "../experience.schema";
import { knowledgeSchema } from "../knowledge.schema";
import { personSchema } from "../person.schema";
import { partnerSchema } from "../partner.schema";
import { KnowledgeType } from "@prisma/client";

describe("Validation Schemas", () => {
  describe("experienceSchema", () => {
    it("validates a valid experience input", () => {
      const input = {
        titleId: "Inisiatif Konservasi Hutan",
        slug: "inisiatif-konservasi-hutan",
        year: "2024",
        coverMediaId: "media-123",
      };
      const res = experienceSchema.safeParse(input);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.year).toBe(2024);
        expect(res.data.coverMediaId).toBe("media-123");
      }
    });

    it("rejects invalid slug format", () => {
      const input = {
        titleId: "Test Title",
        slug: "Invalid Slug With Spaces!",
      };
      const res = experienceSchema.safeParse(input);
      expect(res.success).toBe(false);
    });

    it("rejects title shorter than 2 characters", () => {
      const input = {
        titleId: "A",
        slug: "valid-slug",
      };
      const res = experienceSchema.safeParse(input);
      expect(res.success).toBe(false);
    });
  });

  describe("knowledgeSchema", () => {
    it("validates a valid knowledge input and applies default type", () => {
      const input = {
        titleId: "Kajian Keanekaragaman Hayati",
        slug: "kajian-keanekaragaman-hayati",
        coverMediaId: "cover-456",
      };
      const res = knowledgeSchema.safeParse(input);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.type).toBe(KnowledgeType.ARTICLE);
        expect(res.data.coverMediaId).toBe("cover-456");
      }
    });

    it("accepts valid explicit KnowledgeType", () => {
      const input = {
        titleId: "Laporan Tahunan 2025",
        slug: "laporan-tahunan-2025",
        type: KnowledgeType.REPORT,
      };
      const res = knowledgeSchema.safeParse(input);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.type).toBe(KnowledgeType.REPORT);
      }
    });
  });

  describe("personSchema", () => {
    it("validates a valid person profile input", () => {
      const input = {
        nameId: "Sendi Kenia Savitri",
        credentialsId: "M.Si.",
        roleId: "Direktur Eksekutif",
        slug: "sendi-kenia-savitri",
        imageId: "img-789",
        displayOrder: "1",
      };
      const res = personSchema.safeParse(input);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.displayOrder).toBe(1);
        expect(res.data.imageId).toBe("img-789");
      }
    });
  });

  describe("partnerSchema", () => {
    it("validates a valid partner input", () => {
      const input = {
        name: "Kementerian Lingkungan Hidup",
        slug: "kementerian-lh",
        website: "https://menlhk.go.id",
        logoMediaId: "logo-001",
      };
      const res = partnerSchema.safeParse(input);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.logoMediaId).toBe("logo-001");
      }
    });

    it("accepts empty string as website URL", () => {
      const input = {
        name: "Mitra Lokal",
        slug: "mitra-lokal",
        website: "",
      };
      const res = partnerSchema.safeParse(input);
      expect(res.success).toBe(true);
    });

    it("rejects invalid website URL", () => {
      const input = {
        name: "Mitra Lokal",
        slug: "mitra-lokal",
        website: "not-a-valid-url",
      };
      const res = partnerSchema.safeParse(input);
      expect(res.success).toBe(false);
    });
  });
});

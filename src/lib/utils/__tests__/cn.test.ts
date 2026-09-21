import { describe, it, expect } from "vitest";
import { cn } from "../cn";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    expect(cn("px-2 py-1", "bg-black")).toBe("px-2 py-1 bg-black");
  });

  it("handles conditional classes", () => {
    const isTrue = true;
    const isFalse = false;
    expect(cn("base", isTrue && "active", isFalse && "hidden")).toBe("base active");
  });

  it("resolves tailwind conflict overrides", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
});

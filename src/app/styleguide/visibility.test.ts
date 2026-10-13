import { describe, expect, it } from "vitest";
import { isStyleguideEnabled } from "./visibility";

describe("isStyleguideEnabled", () => {
  it("hides the styleguide in production builds", () => {
    expect(isStyleguideEnabled("production")).toBe(false);
  });

  it.each(["preview", "development", undefined] as const)(
    "shows it when VERCEL_ENV is %s",
    (value) => {
      expect(isStyleguideEnabled(value)).toBe(true);
    },
  );
});

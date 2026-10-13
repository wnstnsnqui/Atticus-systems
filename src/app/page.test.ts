import { describe, expect, it } from "vitest";
import * as home from "./page";

// covers: verify.md "ensureStatic guard". The build fails if the home page
// does request time work only while this export is present, so removing it
// would silently let the page turn dynamic.
describe("home page route config", () => {
  it("opts into the ensureStatic build guard", () => {
    expect(home.ensureStatic).toBe("navigation");
  });
});

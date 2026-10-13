import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// jsdom has no IntersectionObserver, which Motion's whileInView needs. This one
// never reports an intersection, so reveal targets stay in their hidden state;
// Playwright covers the real in view behavior.
vi.stubGlobal(
  "IntersectionObserver",
  class {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  },
);

afterEach(() => {
  cleanup();
});

import { render, screen } from "@testing-library/react";
import { m } from "motion/react";
import { describe, expect, it, vi } from "vitest";
import { MotionProvider } from "./motion-provider";

describe("MotionProvider", () => {
  it("renders its children", () => {
    render(
      <MotionProvider>
        <m.p>Animated</m.p>
      </MotionProvider>,
    );

    expect(screen.getByText("Animated")).toBeInTheDocument();
  });

  it("rejects full motion components, keeping the bundle on m.*", async () => {
    const { motion } = await import("motion/react");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() =>
      render(
        <MotionProvider>
          <motion.p>Too heavy</motion.p>
        </MotionProvider>,
      ),
    ).toThrow();

    consoleError.mockRestore();
  });
});

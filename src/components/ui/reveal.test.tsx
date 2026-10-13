import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MotionProvider } from "./motion-provider";
import { Reveal } from "./reveal";

describe("Reveal", () => {
  it("marks its element for the noscript fallback and starts hidden", () => {
    render(
      <MotionProvider>
        <Reveal>Block</Reveal>
      </MotionProvider>,
    );

    const block = screen.getByText("Block");
    expect(block).toHaveAttribute("data-reveal");
    expect(block.style.opacity).toBe("0");
  });

  it("renders the requested element", () => {
    render(
      <MotionProvider>
        <ul>
          <Reveal as="li">Item</Reveal>
        </ul>
      </MotionProvider>,
    );

    expect(screen.getByRole("listitem")).toHaveTextContent("Item");
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Chip } from "./chip";

describe("Chip", () => {
  it("is a mono label on the overlay fill, not uppercased", () => {
    render(<Chip>Next.js</Chip>);

    const chip = screen.getByText("Next.js");
    expect(chip).toHaveClass("font-mono", "text-label", "text-copy", "bg-overlay", "rounded-chip");
    expect(chip).not.toHaveClass("uppercase", "mono-label");
  });
});

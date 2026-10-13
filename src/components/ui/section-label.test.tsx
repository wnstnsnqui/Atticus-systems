import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { formatSectionIndex, SectionLabel } from "./section-label";

describe("SectionLabel", () => {
  it("reads NN // LABEL with the label uppercased in CSS", () => {
    render(<SectionLabel index={1}>Services</SectionLabel>);

    const label = screen.getByText("01 // Services");
    expect(label).toHaveClass("mono-label", "text-muted");
  });

  it("zero pads single digits and leaves two digits alone", () => {
    expect(formatSectionIndex(4)).toBe("04");
    expect(formatSectionIndex(12)).toBe("12");
  });
});

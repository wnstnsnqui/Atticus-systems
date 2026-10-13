import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Section } from "./section";

describe("Section", () => {
  it("is an anchor target with section padding and the nav scroll margin", () => {
    render(
      <Section id="services" labelledBy="services-title">
        <h2 id="services-title">Services</h2>
      </Section>,
    );

    const section = screen.getByRole("region", { name: "Services" });
    expect(section).toHaveAttribute("id", "services");
    expect(section).toHaveClass("py-section", "scroll-mt-anchor");
  });
});

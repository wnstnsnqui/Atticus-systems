import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Section } from "./section";

describe("Section", () => {
  it("is an anchor target with section padding, the nav scroll margin, and the texture", () => {
    render(
      <Section id="services" labelledBy="services-title">
        <h2 id="services-title">Services</h2>
      </Section>,
    );

    const section = screen.getByRole("region", { name: "Services" });
    expect(section).toHaveAttribute("id", "services");
    expect(section).toHaveAttribute("data-tone", "base");
    expect(section).toHaveClass("py-section", "scroll-mt-anchor", "texture-dots", "overflow-clip");
  });

  it("marks the void tone for the hero", () => {
    render(
      <Section id="hero" labelledBy="hero-title" tone="void">
        <h1 id="hero-title">atticus</h1>
      </Section>,
    );

    expect(screen.getByRole("region", { name: "atticus" })).toHaveAttribute("data-tone", "void");
  });

  it("paints decor first and lifts the content above it", () => {
    render(
      <Section id="s" labelledBy="s-title" decor={<div data-testid="glow" />}>
        <h2 id="s-title">Title</h2>
      </Section>,
    );

    const section = screen.getByRole("region", { name: "Title" });
    expect(section.firstElementChild).toBe(screen.getByTestId("glow"));
    expect(screen.getByRole("heading").parentElement).toHaveClass("relative", "z-10");
  });
});

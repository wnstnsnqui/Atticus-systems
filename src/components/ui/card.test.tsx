import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./card";

describe("Card", () => {
  it("is a raised surface with a border edge, card radius, and no shadow", () => {
    render(<Card>Inside</Card>);

    const card = screen.getByText("Inside");
    expect(card.tagName).toBe("DIV");
    expect(card).toHaveClass("bg-raised", "border-border", "rounded-card", "p-6");
    expect(card.className).not.toMatch(/shadow/);
  });

  it("renders as an article or list item when asked", () => {
    render(
      <ul>
        <Card as="li">Row</Card>
      </ul>,
    );

    expect(screen.getByRole("listitem")).toHaveTextContent("Row");
  });

  it("with glow puts a decorative halo behind the surface", () => {
    render(
      <Card as="article" glow className="col-span-2">
        Lit
      </Card>,
    );

    const surface = screen.getByText("Lit");
    const wrapper = surface.parentElement;
    const halo = wrapper?.firstElementChild;

    expect(wrapper?.tagName).toBe("ARTICLE");
    expect(wrapper).toHaveClass("group/card", "col-span-2");
    expect(halo).toHaveAttribute("aria-hidden", "true");
    expect(halo).toHaveClass("glow-halo", "opacity-0", "group-hover/card:opacity-100");
    expect(halo).toHaveClass("group-focus-within/card:opacity-100");
    expect(halo?.nextElementSibling).toBe(surface);
    expect(surface).toHaveClass("bg-raised");
  });
});

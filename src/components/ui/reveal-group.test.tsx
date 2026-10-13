import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MotionProvider } from "./motion-provider";
import { RevealGroup } from "./reveal-group";
import { RevealItem } from "./reveal-item";

describe("RevealGroup", () => {
  it("never hides itself, only its items", () => {
    render(
      <MotionProvider>
        <RevealGroup as="ul">
          <RevealItem as="li">One</RevealItem>
          <RevealItem as="li">Two</RevealItem>
        </RevealGroup>
      </MotionProvider>,
    );

    const list = screen.getByRole("list");
    expect(list).not.toHaveAttribute("data-reveal");
    expect(list.style.opacity).toBe("");

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    items.forEach((item) => {
      expect(item).toHaveAttribute("data-reveal");
      expect(item.style.opacity).toBe("0");
    });
  });
});

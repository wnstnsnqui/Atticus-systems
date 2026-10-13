import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MotionProvider } from "./motion-provider";
import { RevealGroup } from "./reveal-group";
import { RevealItem } from "./reveal-item";

describe("RevealItem", () => {
  it("inherits the group's hidden state and carries data-reveal", () => {
    render(
      <MotionProvider>
        <RevealGroup>
          <RevealItem as="p">Paragraph</RevealItem>
        </RevealGroup>
      </MotionProvider>,
    );

    const item = screen.getByText("Paragraph");
    expect(item.tagName).toBe("P");
    expect(item).toHaveAttribute("data-reveal");
    expect(item.style.opacity).toBe("0");
  });
});

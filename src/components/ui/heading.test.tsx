import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Heading } from "./heading";

describe("Heading", () => {
  it.each([1, 2, 3] as const)("renders level %i at its matching size by default", (level) => {
    render(<Heading level={level}>Title</Heading>);

    const heading = screen.getByRole("heading", { level, name: "Title" });
    expect(heading).toHaveClass(`text-h${level}`, "text-white");
  });

  it("keeps the semantic level when the visual size changes", () => {
    render(
      <Heading level={2} size="display" id="hero">
        Infrastructure
      </Heading>,
    );

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveClass("text-display");
    expect(heading).not.toHaveClass("text-h2");
    expect(heading).toHaveAttribute("id", "hero");
  });
});

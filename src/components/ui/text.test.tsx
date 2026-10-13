import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Text } from "./text";

describe("Text", () => {
  it("defaults to a gray body paragraph", () => {
    render(<Text>Body copy</Text>);

    const text = screen.getByText("Body copy");
    expect(text.tagName).toBe("P");
    expect(text).toHaveClass("text-body", "text-gray");
  });

  it.each([
    ["lg", "text-body-lg"],
    ["sm", "text-small"],
  ] as const)("size %s uses %s", (size, className) => {
    render(<Text size={size}>Sized</Text>);

    expect(screen.getByText("Sized")).toHaveClass(className);
  });

  it.each([
    ["muted", "text-muted"],
    ["strong", "text-white"],
  ] as const)("tone %s uses %s", (tone, className) => {
    render(<Text tone={tone}>Toned</Text>);

    expect(screen.getByText("Toned")).toHaveClass(className);
  });

  it("renders as a span or list item when asked", () => {
    render(
      <ul>
        <Text as="li">Item</Text>
      </ul>,
    );

    expect(screen.getByRole("listitem")).toHaveTextContent("Item");
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusIndicator } from "./status-indicator";

describe("StatusIndicator", () => {
  it("keeps the meaning in the text and hides the decorative dot", () => {
    const { container } = render(<StatusIndicator>Pipeline Active // 2026</StatusIndicator>);

    expect(screen.getByText("Pipeline Active // 2026")).toBeInTheDocument();

    const dot = container.querySelector('[aria-hidden="true"]');
    expect(dot).toHaveClass("size-2", "bg-amber", "after:animate-status-pulse");
    expect(dot).toHaveClass("motion-reduce:after:hidden");
  });
});

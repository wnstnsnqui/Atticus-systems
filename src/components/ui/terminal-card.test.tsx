import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TerminalCard } from "./terminal-card";

describe("TerminalCard", () => {
  it("shows a mono title above a mono body on a card surface", () => {
    render(
      <TerminalCard title="pipeline.log">
        {"[09:41:02] build passed\n[09:41:05] deployed"}
      </TerminalCard>,
    );

    const title = screen.getByText("pipeline.log");
    expect(title).toHaveClass("mono-label", "text-muted");

    const body = screen.getByText(/build passed/);
    expect(body).toHaveClass("font-mono", "text-copy", "whitespace-pre-wrap");
    expect(body.closest(".rounded-card")).toHaveClass("bg-raised");
  });

  it("hides the three window dots from assistive tech", () => {
    const { container } = render(<TerminalCard title="log">ok</TerminalCard>);

    const dots = container.querySelector('[aria-hidden="true"]');
    expect(dots?.children).toHaveLength(3);
    expect(dots?.firstElementChild).toHaveClass("bg-overlay", "rounded-full");
  });
});

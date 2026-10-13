import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ActionLink } from "./action-link";

describe("ActionLink", () => {
  it("announces the label once, without the arrow", () => {
    render(
      <ActionLink href="#connect" arrow>
        Initialize Pipeline
      </ActionLink>,
    );

    const link = screen.getByRole("link", { name: "Initialize Pipeline" });
    expect(link).toHaveAttribute("href", "#connect");
    expect(link).toHaveClass("letter-roll", "text-amber");
    expect(link).toHaveTextContent("→");
    expect(link).not.toHaveAttribute("target");
  });

  it("opens external links in a new tab without leaking the opener", () => {
    render(
      <ActionLink href="https://github.com/atticus" external>
        GitHub
      </ActionLink>,
    );

    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("leaves the arrow out unless asked", () => {
    render(<ActionLink href="/terms">Terms</ActionLink>);

    expect(screen.getByRole("link", { name: "Terms" })).not.toHaveTextContent("→");
  });
});

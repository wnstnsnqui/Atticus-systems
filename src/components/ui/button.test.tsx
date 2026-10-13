import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("is a light primary button named by its label, without the letter roll", async () => {
    const onClick = vi.fn();
    render(
      <Button arrow onClick={onClick}>
        Send
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Send" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("bg-button", "text-ink", "rounded-control", "min-h-12", "px-6");
    expect(button).not.toHaveClass("letter-roll");
    expect(button.querySelector(".letter-roll-char")).toBeNull();

    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("draws the arrow in violet-deep, hidden from assistive tech", () => {
    render(<Button arrow>Send</Button>);

    const arrow = screen.getByRole("button").querySelector("svg");
    expect(arrow).toHaveAttribute("aria-hidden", "true");
    expect(arrow?.parentElement).toHaveClass("text-violet-deep");
  });

  it("puts a hover halo behind the primary button only", () => {
    const { container, rerender } = render(<Button>Send</Button>);
    expect(container.querySelector(".glow-halo")).toHaveAttribute("aria-hidden", "true");

    rerender(<Button variant="secondary">Send</Button>);
    expect(container.querySelector(".glow-halo")).toBeNull();
  });

  it("renders the secondary variant on the raised fill with a field-line border", () => {
    render(<Button variant="secondary">Back</Button>);

    expect(screen.getByRole("button", { name: "Back" })).toHaveClass(
      "bg-raised",
      "border-field-line",
      "text-heading",
      "hover:bg-overlay",
    );
  });

  it("while pending shows the pending label, stays focusable, and ignores click and Enter", async () => {
    const onClick = vi.fn();
    const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
    const { container } = render(
      <form onSubmit={(event) => onSubmit(event.nativeEvent as SubmitEvent)}>
        <Button type="submit" pending pendingLabel="Sending" onClick={onClick}>
          Send
        </Button>
      </form>,
    );

    const button = screen.getByRole("button", { name: "Sending" });
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveClass("bg-button", "text-ink");
    expect(button).not.toHaveClass("opacity-50", "motion-safe:hover:-translate-y-px");
    expect(container.querySelector(".glow-halo")).toBeNull();

    await userEvent.tab();
    expect(button).toHaveFocus();

    await userEvent.click(button);
    await userEvent.keyboard("{Enter}");
    expect(onClick).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("falls back to the normal label when no pending label is given", () => {
    render(<Button pending>Send</Button>);

    expect(screen.getByRole("button", { name: "Send" })).toHaveAttribute("aria-disabled", "true");
  });

  it("when disabled shows muted text on raised with no motion and no opacity change", () => {
    render(<Button disabled>Send</Button>);

    const button = screen.getByRole("button", { name: "Send" });
    expect(button).toBeDisabled();
    expect(button).toHaveClass(
      "bg-raised",
      "text-muted",
      "border-field-line",
      "cursor-not-allowed",
    );
    expect(button).not.toHaveClass("bg-button", "opacity-50", "motion-safe:active:scale-97");
  });
});

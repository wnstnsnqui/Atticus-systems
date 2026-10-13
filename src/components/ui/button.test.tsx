import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("is an amber letter roll button named by its label", async () => {
    const onClick = vi.fn();
    render(
      <Button arrow onClick={onClick}>
        Send
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Send" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("letter-roll", "text-amber");

    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("while pending shows the pending label, stays focusable, and ignores click and Enter", async () => {
    const onClick = vi.fn();
    const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
    render(
      <form onSubmit={(event) => onSubmit(event.nativeEvent as SubmitEvent)}>
        <Button type="submit" pending pendingLabel="Sending" onClick={onClick}>
          Send
        </Button>
      </form>,
    );

    const button = screen.getByRole("button", { name: "Sending" });
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).not.toHaveClass("opacity-50");
    expect(button.querySelector(".letter-roll-char")).toBeNull();

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
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ErrorPage from "./error";

function renderError(message = "database password is hunter2") {
  const reset = vi.fn();
  render(<ErrorPage error={new Error(message)} reset={reset} />);
  return { reset };
}

describe("error boundary page", () => {
  it("tells the visitor something went wrong", () => {
    renderError();

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("retries by calling reset when the visitor clicks the button", async () => {
    const user = userEvent.setup();
    const { reset } = renderError();

    await user.click(screen.getByRole("button", { name: /try again/i }));

    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("lets keyboard users reach and press the retry button", async () => {
    const user = userEvent.setup();
    const { reset } = renderError();

    await user.tab();
    expect(screen.getByRole("button", { name: /try again/i })).toHaveFocus();
    await user.keyboard("{Enter}");

    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("never shows the raw error message to the visitor", () => {
    renderError("database password is hunter2");

    expect(screen.queryByText(/hunter2/)).not.toBeInTheDocument();
  });
});

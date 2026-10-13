import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TextField } from "./text-field";

describe("TextField", () => {
  it("ties a visible mono label to an input with no placeholder", () => {
    render(<TextField name="name" label="Name" />);

    const input = screen.getByRole("textbox", { name: "Name" });
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("name", "name");
    expect(input).not.toHaveAttribute("placeholder");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(screen.getByText("Name")).toHaveClass("mono-label");
  });

  it("renders a textarea when multiline", () => {
    render(<TextField name="scope" label="Project Scope Overview" multiline />);

    expect(screen.getByRole("textbox", { name: "Project Scope Overview" }).tagName).toBe(
      "TEXTAREA",
    );
  });

  it("marks the control invalid and describes it with the error message", () => {
    render(
      <TextField name="email" label="Company Email" type="email" error="Enter a valid email" />,
    );

    const input = screen.getByRole("textbox", { name: "Company Email" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(/Enter a valid email/);
    expect(screen.getByText(/ERR \/\//)).toHaveAttribute("aria-hidden", "true");
  });

  it("shows no error message without an error", () => {
    render(<TextField name="email" label="Company Email" />);

    expect(screen.queryByText(/ERR/)).toBeNull();
  });

  it("describes the control with its description", () => {
    render(<TextField name="email" label="Email" description="We reply within a day." />);

    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAccessibleDescription(
      "We reply within a day.",
    );
  });

  it("renders the error as text, never as HTML", () => {
    render(<TextField name="x" label="X" error="<img src=x onerror=alert(1)>" />);

    expect(document.querySelector("img")).toBeNull();
  });

  it("is reachable and typeable by keyboard", async () => {
    render(<TextField name="name" label="Name" />);

    await userEvent.tab();
    await userEvent.keyboard("Ada");
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("Ada");
  });
});

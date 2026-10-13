import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFound from "./not-found";

describe("not found page", () => {
  it("has a page heading", () => {
    render(<NotFound />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("links the visitor back to the home page", () => {
    render(<NotFound />);

    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/");
  });
});

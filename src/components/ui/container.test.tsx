import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Container } from "./container";

describe("Container", () => {
  it("centers content at the content width with fluid gutters", () => {
    render(<Container>Inside</Container>);

    expect(screen.getByText("Inside")).toHaveClass("mx-auto", "max-w-content", "px-gutter");
  });

  it("appends a caller className", () => {
    render(<Container className="grid">Inside</Container>);

    expect(screen.getByText("Inside")).toHaveClass("grid", "max-w-content");
  });
});

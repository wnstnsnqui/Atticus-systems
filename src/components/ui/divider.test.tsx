import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Divider } from "./divider";

describe("Divider", () => {
  it("is a decorative hairline hidden from assistive tech", () => {
    const { container } = render(<Divider />);

    const rule = container.querySelector("hr");
    expect(rule).toHaveAttribute("aria-hidden", "true");
    expect(rule).toHaveClass("border-hairline");
  });
});

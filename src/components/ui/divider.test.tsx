import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Divider } from "./divider";

describe("Divider", () => {
  it("is a decorative hairline that fades at both ends, hidden from assistive tech", () => {
    const { container } = render(<Divider />);

    const rule = container.querySelector("hr");
    expect(rule).toHaveAttribute("aria-hidden", "true");
    expect(rule).toHaveClass("h-px", "from-transparent", "via-hairline", "to-transparent");
  });
});

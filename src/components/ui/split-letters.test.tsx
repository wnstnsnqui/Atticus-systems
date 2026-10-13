import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SplitLetters } from "./split-letters";

describe("SplitLetters", () => {
  it("pairs a readable label with a per letter copy hidden from assistive tech", () => {
    const { container } = render(<SplitLetters labelId="cta">Go on</SplitLetters>);

    const label = container.querySelector("#cta");
    expect(label).toHaveClass("sr-only");
    expect(label).toHaveTextContent("Go on");

    const visual = container.querySelector('[aria-hidden="true"]');
    const chars = Array.from(visual?.querySelectorAll(".letter-roll-char") ?? []);
    expect(chars.map((char) => char.getAttribute("data-char"))).toEqual(["G", "o", " ", "o", "n"]);
  });

  it("gives each letter its index for the stagger delay", () => {
    const { container } = render(<SplitLetters>Hey</SplitLetters>);

    const indexes = Array.from(
      container.querySelectorAll<HTMLElement>(".letter-roll-char"),
      (char) => char.style.getPropertyValue("--i"),
    );
    expect(indexes).toEqual(["0", "1", "2"]);
  });
});

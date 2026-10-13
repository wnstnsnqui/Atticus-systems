import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MotionProvider } from "./motion-provider";
import { RevealWords, splitWords } from "./reveal-words";

const TEXT = "Engineering that compounds";

const renderWords = () =>
  render(
    <MotionProvider>
      <RevealWords text={TEXT} level={2} size="display" id="title" />
    </MotionProvider>,
  );

describe("RevealWords", () => {
  it("exposes the full sentence once as the heading's accessible name", () => {
    renderWords();

    const heading = screen.getByRole("heading", { level: 2, name: TEXT });
    expect(heading).toHaveAttribute("id", "title");
    expect(heading).toHaveClass("text-display");
  });

  it("splits a visual copy into words hidden from assistive tech", () => {
    const { container } = renderWords();

    const visual = container.querySelector('[aria-hidden="true"]');
    expect(visual).toHaveAttribute("data-reveal");

    const words = visual?.querySelectorAll(".inline-block[data-reveal]") ?? [];
    expect(Array.from(words, (word) => word.textContent)).toEqual([
      "Engineering",
      "that",
      "compounds",
    ]);
    expect(visual).toHaveTextContent(TEXT);
  });

  it("collapses repeated whitespace when splitting", () => {
    expect(splitWords("  Ship   it\nnow ")).toEqual(["Ship", "it", "now"]);
  });
});

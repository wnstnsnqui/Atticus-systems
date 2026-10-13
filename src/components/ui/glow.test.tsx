import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Glow } from "./glow";

type ObserverCallback = (entries: readonly Partial<IntersectionObserverEntry>[]) => void;

const observers: { callback: ObserverCallback; options?: IntersectionObserverInit }[] = [];
const disconnect = vi.fn();

beforeEach(() => {
  observers.length = 0;
  vi.stubGlobal(
    "IntersectionObserver",
    vi.fn(function (this: unknown, callback: ObserverCallback, options?: IntersectionObserverInit) {
      observers.push({ callback, options });
      return { observe: vi.fn(), disconnect, unobserve: vi.fn(), takeRecords: () => [] };
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  disconnect.mockClear();
});

describe("Glow", () => {
  it("is decorative light with no pointer events", () => {
    const { container } = render(<Glow hue="violet" position="top" />);

    const glow = container.firstElementChild;
    expect(glow).toHaveAttribute("aria-hidden", "true");
    expect(glow).toHaveClass(
      "glow-violet",
      "pointer-events-none",
      "absolute",
      "forced-colors:hidden",
    );
  });

  it("starts hidden and fades in once when it enters the viewport", () => {
    const { container } = render(<Glow hue="blue" position="bottom-left" size="lg" />);
    const glow = container.firstElementChild;

    expect(glow).toHaveAttribute("data-reveal");
    expect(glow).not.toHaveAttribute("data-in");
    expect(glow).toHaveClass("opacity-0", "data-in:opacity-100", "duration-(--duration-glow)");
    expect(observers[0]?.options?.rootMargin).toBe("0px 0px -10% 0px");

    act(() => observers[0]?.callback([{ isIntersecting: true }]));
    expect(glow).toHaveAttribute("data-in");
    expect(disconnect).toHaveBeenCalled();
  });

  it("ignores observer updates while it is still outside the viewport", () => {
    const { container } = render(<Glow hue="cyan" position="center" />);

    act(() => observers[0]?.callback([{ isIntersecting: false }]));
    expect(container.firstElementChild).not.toHaveAttribute("data-in");
  });

  it("with reveal off is visible from the first paint and needs no observer", () => {
    const { container } = render(<Glow hue="violet-blue" position="top" reveal={false} />);
    const glow = container.firstElementChild;

    expect(glow).not.toHaveAttribute("data-reveal");
    expect(glow).not.toHaveClass("opacity-0");
    expect(glow).toHaveClass("glow-violet-blue");
    expect(observers).toHaveLength(0);
  });

  it.each([
    ["sm", "size-[min(24rem,70vw)]"],
    ["md", "size-[min(40rem,90vw)]"],
    ["lg", "size-[min(64rem,120vw)]"],
  ] as const)("size %s scales down on narrow viewports", (size, className) => {
    const { container } = render(<Glow hue="violet" position="top" size={size} />);

    expect(container.firstElementChild).toHaveClass(className);
  });
});

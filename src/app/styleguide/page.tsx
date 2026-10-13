import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ActionLink } from "@/components/ui/action-link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Glow, type GlowHue, type GlowSize } from "@/components/ui/glow";
import { Heading, headingVariants, type HeadingSize } from "@/components/ui/heading";
import { Reveal } from "@/components/ui/reveal";
import { RevealGroup } from "@/components/ui/reveal-group";
import { RevealItem } from "@/components/ui/reveal-item";
import { RevealWords } from "@/components/ui/reveal-words";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { TerminalCard } from "@/components/ui/terminal-card";
import { Text } from "@/components/ui/text";
import { TextField } from "@/components/ui/text-field";
import { contrastRatio } from "@/lib/design/contrast";
import { parseColorTokens } from "@/lib/design/tokens";
import { duration, stagger } from "@/lib/motion";
import { env } from "@/lib/env";
import { isStyleguideEnabled } from "./visibility";

export const ensureStatic = "navigation";

export const metadata: Metadata = {
  title: "Styleguide · Atticus",
  robots: { index: false, follow: false },
};

// Read at build time while prerendering; the page ships as static HTML.
const colorTokens = () =>
  parseColorTokens(readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8"));

// Text sits on these, so their swatch shows the ratio of heading text on them.
const SURFACE_TOKENS: ReadonlySet<string> = new Set(["void", "base", "raised", "overlay"]);

const swatchRatio = (name: string, value: string, tokens: ReadonlyMap<string, string>): string => {
  const base = tokens.get("base") ?? "#0E0D12";
  const heading = tokens.get("heading") ?? "#F6F6F9";
  return SURFACE_TOKENS.has(name)
    ? `${contrastRatio(heading, value).toFixed(2)}:1 heading on it`
    : `${contrastRatio(value, base).toFixed(2)}:1 on base`;
};

const colorUse: Readonly<Record<string, string>> = {
  void: "Hero background only",
  base: "Page and every non hero section",
  raised: "Cards, fields, secondary buttons",
  overlay: "Chips, window dots, hover fill",
  hairline: "Divider line",
  border: "Card and primary button edge",
  dot: "Dot texture",
  "field-line": "Field and secondary button border",
  muted: "Labels, meta lines, status text",
  copy: "Body copy, chip and terminal text",
  heading: "Headings, input text",
  violet: "Links, focus ring, caret, selection",
  "violet-hover": "Link hover",
  "violet-deep": "Arrow on the primary button",
  button: "Primary button fill",
  "button-hover": "Primary button hover fill",
  ink: "Text on light fills",
  green: "Status dot and halo only",
  red: "Field errors only",
  "glow-violet": "Glows and hover halos",
  "glow-blue": "Glows",
  "glow-cyan": "Glows",
};

const typeSteps: readonly {
  readonly token: string;
  readonly range: string;
  readonly sample: string;
  readonly heading?: HeadingSize;
  readonly text?: "lg" | "base" | "sm";
}[] = [
  { token: "display", range: "40 → 96px", sample: "Infrastructure that ships", heading: "display" },
  { token: "h1", range: "32 → 64px", sample: "Engineering that compounds", heading: "h1" },
  { token: "h2", range: "24 → 40px", sample: "Systems built to last", heading: "h2" },
  { token: "h3", range: "20 → 28px", sample: "atticus core", heading: "h3" },
  {
    token: "body-lg",
    range: "18 → 20px",
    sample: "We design and ship production software for teams that cannot afford to guess.",
    text: "lg",
  },
  {
    token: "body",
    range: "16 → 18px",
    sample: "Every system is typed, tested, and observable from the first commit to the last.",
    text: "base",
  },
  { token: "small", range: "14px", sample: "© 2026 Atticus. All rights reserved.", text: "sm" },
];

const spacingTokens: readonly {
  readonly token: string;
  readonly value: string;
  readonly use: string;
}[] = [
  { token: "max-w-content", value: "1280px", use: "Outer content width, gutters included" },
  { token: "max-w-prose", value: "640px", use: "Body text measure" },
  { token: "px-gutter", value: "24 → 48px", use: "Side gutters" },
  { token: "py-section", value: "96 → 192px", use: "Vertical padding per section" },
  { token: "scroll-mt-anchor", value: "96px", use: "Anchor offset under the nav" },
  { token: "--spacing-fade", value: "200px", use: "Void to base fade at the hero's foot" },
  { token: "--spacing-dot", value: "24px", use: "Dot texture grid pitch" },
];

const radiusTokens: readonly { readonly token: string; readonly value: string }[] = [
  { token: "rounded-chip", value: "6px" },
  { token: "rounded-control", value: "12px" },
  { token: "rounded-card", value: "24px" },
  { token: "rounded-full", value: "dots" },
];

const surfaces: readonly {
  readonly token: string;
  readonly className: string;
  readonly tone?: "void" | "base";
  readonly use: string;
}[] = [
  { token: "void", className: "texture-dots", tone: "void", use: "Hero only, with texture" },
  { token: "base", className: "texture-dots", tone: "base", use: "Every other section" },
  { token: "raised", className: "bg-raised", use: "Cards, fields" },
  { token: "overlay", className: "bg-overlay", use: "Chips, hover fill" },
];

const glowHues: readonly GlowHue[] = ["violet", "blue", "cyan", "violet-blue"];
const glowSizes: readonly GlowSize[] = ["sm", "md", "lg"];

const motionRules: readonly { readonly name: string; readonly value: string }[] = [
  { name: "Reveal", value: `${duration.reveal}ms, rise 16px, once` },
  { name: "Group stagger", value: `${stagger.children}ms per item` },
  { name: "Word stagger", value: `${stagger.words}ms per word, rise 0.3em` },
  { name: "Letter roll", value: `${duration.roll}ms per letter, ${stagger.letters}ms apart` },
  { name: "Glow fade", value: `${duration.glow}ms, once, then still` },
  { name: "Hover halo", value: `${duration.reveal}ms fade` },
  { name: "Button lift and press", value: `${duration.fast}ms, 1px up, 0.97 scale` },
  { name: "Status halo", value: `${duration.pulse}ms loop` },
  { name: "Reduced motion", value: `${duration.fast}ms fade, no movement` },
];

const terminalLog = [
  "[09:41:02] lint ........ passed",
  "[09:41:09] typecheck ... passed",
  "[09:41:31] tests ....... 116 passed",
  "[09:42:04] deploy ...... preview ready",
].join("\n");

const sections = [
  { id: "color", label: "Color" },
  { id: "surfaces", label: "Surfaces" },
  { id: "type", label: "Type" },
  { id: "spacing", label: "Spacing" },
  { id: "motion", label: "Motion" },
  { id: "components", label: "Components" },
] as const;

function SectionHeader({ index, id, title }: { index: number; id: string; title: string }) {
  return (
    <div className="flex flex-col gap-4">
      <SectionLabel index={index}>{title}</SectionLabel>
      <Heading level={2} id={`${id}-title`}>
        {title}
      </Heading>
    </div>
  );
}

function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="mono-label text-muted">{label}</p>
      {children}
    </div>
  );
}

export default function StyleguidePage() {
  if (!isStyleguideEnabled(env.VERCEL_ENV)) notFound();

  const tokens = colorTokens();
  const tokenMap = new Map(tokens.map(({ name, value }) => [name, value]));

  return (
    <>
      <header>
        <Container className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-6">
          <p className="text-h3 text-heading">
            atticus <span className="text-muted">/ styleguide</span>
          </p>
          <nav aria-label="Styleguide sections">
            <ul className="flex flex-wrap gap-x-6">
              {sections.map(({ id, label }) => (
                <li key={id}>
                  <ActionLink href={`#${id}`}>{label}</ActionLink>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </header>

      <main>
        <Section
          id="intro"
          labelledBy="intro-title"
          tone="void"
          decor={<Glow hue="violet-blue" position="top" size="lg" reveal={false} />}
        >
          <Container className="grid items-end gap-12 lg:grid-cols-[1fr_24rem]">
            <div className="flex flex-col gap-8">
              <StatusIndicator>Preview build // Not served in production</StatusIndicator>
              <Heading level={1} size="display" id="intro-title">
                The Atticus design system
              </Heading>
              <Text size="lg" className="max-w-prose">
                Tokens, surfaces, type, motion, and the primitives every section is built from. A
                pure black void for the hero, violet obsidian below it, and violet only where you
                can act.
              </Text>
              <div className="flex flex-wrap gap-4">
                <Button arrow>Start a Project</Button>
                <Button variant="secondary">Read the Spec</Button>
              </div>
            </div>
            <Card>
              <div className="flex flex-col gap-3">
                <p className="mono-label text-muted">Raised surface</p>
                <Text tone="strong">Cards cover the dot texture with a solid fill.</Text>
                <Text size="sm">Rounded 24px, a 1px border edge, and no shadow.</Text>
              </div>
            </Card>
          </Container>
        </Section>

        <Section id="color" labelledBy="color-title">
          <Container className="flex flex-col gap-16">
            <SectionHeader index={1} id="color" title="Color" />
            <RevealGroup
              as="ul"
              className="grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-8 md:grid-cols-3 lg:grid-cols-4"
            >
              {tokens.map(({ name, value }) => (
                <RevealItem as="li" key={name} className="flex flex-col gap-4">
                  <div
                    className="aspect-[4/3] w-full rounded-control border border-border"
                    style={{ backgroundColor: value }}
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-body text-heading">{name}</p>
                    <p className="font-mono text-label text-muted">
                      {value} · {swatchRatio(name, value, tokenMap)}
                    </p>
                    <Text size="sm" tone="muted">
                      {colorUse[name]}
                    </Text>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </Section>

        <Section id="surfaces" labelledBy="surfaces-title">
          <Container className="flex flex-col gap-16">
            <SectionHeader index={2} id="surfaces" title="Surfaces" />
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {surfaces.map(({ token, className, tone, use }) => (
                <li key={token} className="flex flex-col gap-4">
                  <div
                    data-tone={tone}
                    data-surface={token}
                    className={`h-40 rounded-card border border-border ${className}`}
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-body text-heading">{token}</p>
                    <Text size="sm" tone="muted">
                      {use}
                    </Text>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-8">
              <Heading level={3}>Glows</Heading>
              <Text className="max-w-prose">
                Soft light behind a section&apos;s content, never above text. Each fades in once
                when it scrolls into view, then stays still. At most two per viewport on real pages.
              </Text>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {glowHues.map((hue) => (
                  <li key={hue} className="flex flex-col gap-4">
                    <div className="relative isolate h-48 overflow-clip rounded-card border border-border bg-void">
                      <Glow hue={hue} position="center" size="sm" />
                    </div>
                    <p className="font-mono text-label text-muted">hue · {hue}</p>
                  </li>
                ))}
              </ul>
              <ul className="grid gap-6 lg:grid-cols-3">
                {glowSizes.map((size) => (
                  <li key={size} className="flex flex-col gap-4">
                    <div className="relative isolate h-64 overflow-clip rounded-card border border-border bg-void">
                      <Glow hue="violet" position="bottom" size={size} />
                    </div>
                    <p className="font-mono text-label text-muted">size · {size}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-8">
              <Heading level={3}>Radius and shadow</Heading>
              <ul className="flex flex-wrap items-end gap-8">
                {radiusTokens.map(({ token, value }) => (
                  <li key={token} className="flex flex-col gap-3">
                    <div
                      className={`size-20 border border-field-line bg-raised ${
                        token === "rounded-full" ? "rounded-full" : token
                      }`}
                    />
                    <p className="font-mono text-label text-muted">
                      {token} · {value}
                    </p>
                  </li>
                ))}
                <li className="flex flex-col gap-3">
                  <div className="size-20 rounded-control border border-border bg-raised shadow-control" />
                  <p className="font-mono text-label text-muted">shadow-control · buttons</p>
                </li>
              </ul>
            </div>
          </Container>
        </Section>

        <Section id="type" labelledBy="type-title">
          <Container className="flex flex-col gap-16">
            <SectionHeader index={3} id="type" title="Type" />
            <ul className="flex flex-col gap-12">
              {typeSteps.map(({ token, range, sample, heading, text }) => (
                <li key={token}>
                  <Reveal className="grid gap-4 md:grid-cols-[12rem_1fr] md:gap-8">
                    <p className="mono-label text-muted">
                      text-{token} <span className="text-muted">· {range}</span>
                    </p>
                    {heading ? (
                      <p className={headingVariants({ size: heading })}>{sample}</p>
                    ) : (
                      <Text size={text}>{sample}</Text>
                    )}
                  </Reveal>
                </li>
              ))}
              <li>
                <Reveal className="grid gap-4 md:grid-cols-[12rem_1fr] md:gap-8">
                  <p className="mono-label text-muted">
                    mono-label <span className="text-muted">· 12 → 13px</span>
                  </p>
                  <SectionLabel index={1}>Services</SectionLabel>
                </Reveal>
              </li>
            </ul>
          </Container>
        </Section>

        <Section id="spacing" labelledBy="spacing-title">
          <Container className="flex flex-col gap-16">
            <SectionHeader index={4} id="spacing" title="Spacing" />
            <dl className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {spacingTokens.map(({ token, value, use }) => (
                <div key={token} className="flex flex-col gap-2">
                  <dt className="font-mono text-label text-heading">{token}</dt>
                  <dd className="text-h3 text-heading">{value}</dd>
                  <dd>
                    <Text size="sm" tone="muted" as="span">
                      {use}
                    </Text>
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </Section>

        <Section id="motion" labelledBy="motion-title">
          <Container className="flex flex-col gap-16">
            <SectionHeader index={5} id="motion" title="Motion" />
            <RevealWords level={3} size="display" text="Calm motion that respects every visitor" />
            <div className="grid gap-16 lg:grid-cols-2">
              <Reveal className="flex flex-col gap-6">
                <Text size="lg" tone="strong">
                  One reveal pattern, everywhere.
                </Text>
                <Text className="max-w-prose">
                  Blocks fade in while rising, the first time they reach the viewport, and never
                  replay. With reduced motion they simply fade. Without JavaScript they are already
                  there.
                </Text>
              </Reveal>
              <RevealGroup as="ul" className="flex flex-col gap-6">
                {motionRules.map(({ name, value }) => (
                  <RevealItem
                    as="li"
                    key={name}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1"
                  >
                    <Text tone="strong" as="span">
                      {name}
                    </Text>
                    <span className="font-mono text-label text-muted">{value}</span>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </Container>
        </Section>

        <Section id="components" labelledBy="components-title">
          <Container className="flex flex-col gap-16">
            <SectionHeader index={6} id="components" title="Components" />
            <div className="grid gap-x-16 gap-y-20 lg:grid-cols-2">
              <Specimen label="ActionLink">
                <div className="flex flex-wrap gap-x-10 gap-y-2">
                  <ActionLink href="#components" arrow>
                    Initialize Pipeline
                  </ActionLink>
                  <ActionLink href="https://github.com" external>
                    View on GitHub
                  </ActionLink>
                </div>
              </Specimen>

              <Specimen label="Button · primary and secondary">
                <div className="flex flex-wrap gap-4">
                  <Button arrow>Send Inquiry</Button>
                  <Button variant="secondary" arrow>
                    See the Work
                  </Button>
                </div>
              </Specimen>

              <Specimen label="Button · pending and disabled">
                <div className="flex flex-wrap gap-4">
                  <Button pending pendingLabel="Sending…">
                    Send Again
                  </Button>
                  <Button disabled arrow>
                    Unavailable
                  </Button>
                </div>
              </Specimen>

              <Specimen label="StatusIndicator">
                <StatusIndicator>Pipeline Active // 2026</StatusIndicator>
              </Specimen>

              <Specimen label="TextField">
                <div className="flex flex-col gap-8">
                  <TextField name="name" label="Name" autoComplete="name" />
                  <TextField
                    name="email"
                    label="Company Email"
                    type="email"
                    autoComplete="email"
                    description="We reply within one business day."
                  />
                </div>
              </Specimen>

              <Specimen label="TextField · error, disabled, multiline">
                <div className="flex flex-col gap-8">
                  <TextField
                    name="email-invalid"
                    label="Work Email"
                    type="email"
                    defaultValue="ada@"
                    error="Enter a valid email"
                  />
                  <TextField name="locked" label="Reference" defaultValue="ATT-0042" disabled />
                  <TextField name="scope" label="Project Scope Overview" multiline />
                </div>
              </Specimen>

              <Specimen label="Card">
                <Card as="article">
                  <div className="flex flex-col gap-3">
                    <Heading level={3}>atticus core</Heading>
                    <Text>Production systems, typed end to end and observable from day one.</Text>
                  </div>
                </Card>
              </Specimen>

              <Specimen label="Card · glow on hover and focus">
                <Card as="article" glow>
                  <div className="flex flex-col gap-3">
                    <Heading level={3}>atticus labs</Heading>
                    <Text>Hover the card, or tab to the link inside it.</Text>
                    <div>
                      <ActionLink href="#components" arrow>
                        Explore Labs
                      </ActionLink>
                    </div>
                  </div>
                </Card>
              </Specimen>

              <Specimen label="TerminalCard">
                <TerminalCard title="pipeline.log">{terminalLog}</TerminalCard>
              </Specimen>

              <Specimen label="Chip, SectionLabel, and Divider">
                <div className="flex flex-col gap-6">
                  <ul className="flex flex-wrap gap-2">
                    {["Next.js", "TypeScript", "Postgres", "Vercel"].map((tech) => (
                      <li key={tech}>
                        <Chip>{tech}</Chip>
                      </li>
                    ))}
                  </ul>
                  <SectionLabel index={4}>Connect</SectionLabel>
                  <Divider />
                  <Text size="sm" tone="muted">
                    Dividers fade at both ends. They are decoration, never the only cue.
                  </Text>
                </div>
              </Specimen>
            </div>
          </Container>
        </Section>
      </main>

      <footer>
        <Container className="pb-16">
          <Text size="sm" tone="muted">
            Spec 0002 · Reference in docs/design.md · This page returns 404 in production.
          </Text>
        </Container>
      </footer>
    </>
  );
}

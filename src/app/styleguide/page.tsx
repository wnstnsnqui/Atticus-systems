import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ActionLink } from "@/components/ui/action-link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Glow } from "@/components/ui/glow";
import { Heading, headingVariants, type HeadingSize } from "@/components/ui/heading";
import { Reveal } from "@/components/ui/reveal";
import { RevealGroup } from "@/components/ui/reveal-group";
import { RevealItem } from "@/components/ui/reveal-item";
import { RevealWords } from "@/components/ui/reveal-words";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { StatusIndicator } from "@/components/ui/status-indicator";
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
];

const motionRules: readonly { readonly name: string; readonly value: string }[] = [
  { name: "Reveal", value: `${duration.reveal}ms, rise 16px, once` },
  { name: "Group stagger", value: `${stagger.children}ms per item` },
  { name: "Word stagger", value: `${stagger.words}ms per word, rise 0.3em` },
  { name: "Letter roll", value: `${duration.roll}ms per letter, ${stagger.letters}ms apart` },
  { name: "Status halo", value: `${duration.pulse}ms loop` },
  { name: "Reduced motion", value: `${duration.fast}ms fade, no movement` },
];

const sections = [
  { id: "color", label: "Color" },
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
              <div>
                <Button arrow>Start a Project</Button>
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
              className="grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-8 lg:grid-cols-4"
            >
              {colorTokens().map(({ name, value }) => (
                <RevealItem as="li" key={name} className="flex flex-col gap-4">
                  <div
                    className="aspect-[4/3] w-full rounded-control border border-border"
                    style={{ backgroundColor: value }}
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-body text-heading">{name}</p>
                    <p className="font-mono text-label text-muted">
                      {value} · {contrastRatio(value, "#0E0D12").toFixed(2)}:1
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

        <Section id="type" labelledBy="type-title">
          <Container className="flex flex-col gap-16">
            <SectionHeader index={2} id="type" title="Type" />
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
                    text-label <span className="text-muted">· 12 → 13px</span>
                  </p>
                  <SectionLabel index={1}>Services</SectionLabel>
                </Reveal>
              </li>
            </ul>
          </Container>
        </Section>

        <Section id="spacing" labelledBy="spacing-title">
          <Container className="flex flex-col gap-16">
            <SectionHeader index={3} id="spacing" title="Spacing" />
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
            <SectionHeader index={4} id="motion" title="Motion" />
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
            <SectionHeader index={5} id="components" title="Components" />
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

              <Specimen label="Button">
                <div className="flex flex-wrap gap-x-10 gap-y-2">
                  <Button arrow>Send Inquiry</Button>
                  <Button pending pendingLabel="Sending…">
                    Send Again
                  </Button>
                </div>
              </Specimen>

              <Specimen label="TextField">
                <div className="flex flex-col gap-10">
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

              <Specimen label="TextField · error and multiline">
                <div className="flex flex-col gap-10">
                  <TextField
                    name="email-invalid"
                    label="Work Email"
                    type="email"
                    defaultValue="ada@"
                    error="Enter a valid email"
                  />
                  <TextField name="scope" label="Project Scope Overview" multiline />
                </div>
              </Specimen>

              <Specimen label="StatusIndicator">
                <StatusIndicator>Pipeline Active // 2026</StatusIndicator>
              </Specimen>

              <Specimen label="SectionLabel and Divider">
                <div className="flex flex-col gap-6">
                  <SectionLabel index={4}>Connect</SectionLabel>
                  <Divider />
                  <Text size="sm" tone="muted">
                    Hairlines separate portfolio rows only. They are decoration, never the only cue.
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

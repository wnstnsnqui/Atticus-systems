// WCAG 2.x contrast ratio between two hex colors (#rgb or #rrggbb).

const expandHex = (hex: string): string => {
  const digits = hex.replace("#", "");
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(digits)) {
    throw new Error(`Not a hex color: ${hex}`);
  }
  return digits.length === 3 ? Array.from(digits, (digit) => digit + digit).join("") : digits;
};

const channelLuminance = (channel: number): number => {
  const srgb = channel / 255;
  return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
};

export const relativeLuminance = (hex: string): number => {
  const digits = expandHex(hex);
  const [r, g, b] = [0, 2, 4].map((start) =>
    channelLuminance(parseInt(digits.slice(start, start + 2), 16)),
  ) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrastRatio = (a: string, b: string): number => {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x) as [
    number,
    number,
  ];
  return (lighter + 0.05) / (darker + 0.05);
};

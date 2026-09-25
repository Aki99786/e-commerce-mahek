// Compact color palette for closest color matching
const PALETTE: [string, string][] = [
  ["#000000", "Black"],
  ["#111827", "Charcoal"],
  ["#808080", "Gray"],
  ["#ffffff", "White"],
  ["#f5f5f0", "Off White"],
  ["#f5f5dc", "Beige"],
  ["#1e3a8a", "Navy Blue"],
  ["#3a5e95", "Steel Blue"],
  ["#3b82f6", "Blue"],
  ["#0d9488", "Teal"],
  ["#249e8d", "Sea Green"],
  ["#5dddbe", "Mint Green"],
  ["#166534", "Dark Green"],
  ["#67d818", "Lime Green"],
  ["#eab308", "Yellow"],
  ["#d4af37", "Gold"],
  ["#ea580c", "Orange"],
  ["#ffcba4", "Peach"],
  ["#f31b1b", "Red"],
  ["#c41e3a", "Crimson"],
  ["#800020", "Maroon"],
  ["#722f37", "Wine"],
  ["#e75480", "Pink"],
  ["#cb648b", "Rose Pink"],
  ["#9310d4", "Violet"],
  ["#6b21a8", "Purple"],
  ["#c1c5f8", "Lavender"],
  ["#866859", "Brown"],
];

// Helper: Convert hex to [r, g, b]
const toRgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

/**
 * Returns color name and hex for any input hex or color name.
 * Uses Euclidean color distance to pick the closest name in ~30 lines.
 */
export function getColorInfo(input: string): { name: string; hex: string } {
  if (!input) return { name: "Other", hex: "#6B7280" };

  const trimmed = input.trim();
  const hex = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;

  // If not a standard 6-char hex, treat as a name
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    return { name: formatted, hex: "#6B7280" };
  }

  const [r, g, b] = toRgb(hex);
  let closest = PALETTE[0];
  let minDiff = Infinity;

  for (const item of PALETTE) {
    const [pr, pg, pb] = toRgb(item[0]);
    const diff = Math.hypot(r - pr, g - pg, b - pb);
    if (diff === 0) return { name: item[1], hex }; // exact match
    if (diff < minDiff) {
      minDiff = diff;
      closest = item;
    }
  }

  return { name: closest[1], hex };
}

export const getColorName = (input: string) => getColorInfo(input).name;
export const getColorCode = (input: string) => getColorInfo(input).hex;

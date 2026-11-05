export interface ShoePalette {
  base: string;
  highlightBright: string;
  highlightSoft: string;
  midLight: string;
  midDark: string;
  rimShade: string;
  footbedCenter: string;
  footbedDeep: string;
  heelCupDeep: string;
  seamColor: string;
  nubHighlight: string;
  nubShadow: string;
}

function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace('#', '').trim();
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return [229, 62, 62];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function toHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
  );
}

function mixRgb(
  rgb1: [number, number, number],
  rgb2: [number, number, number],
  weight2: number
): string {
  const w1 = 1 - weight2;
  return toHex(
    rgb1[0] * w1 + rgb2[0] * weight2,
    rgb1[1] * w1 + rgb2[1] * weight2,
    rgb1[2] * w1 + rgb2[2] * weight2
  );
}

/**
 * Generates a natural, subdued 3D shading palette for any Crocs colorway.
 * Keeps highlights subtle so the true shoe color remains accurate.
 */
export function computeShoePalette(hex: string): ShoePalette {
  const rgb = parseHex(hex);
  const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;

  const white: [number, number, number] = [255, 255, 255];
  const shadowDark: [number, number, number] = [10, 14, 20];
  const deepInk: [number, number, number] = [6, 8, 12];

  // Subdued highlight stops so the gradient is not overly bright
  const hiBoost = luminance < 0.15 ? 0.15 : luminance > 0.85 ? 0.06 : 0.10;
  const softBoost = luminance < 0.15 ? 0.08 : 0.05;
  const shadeWeight = luminance > 0.85 ? 0.22 : 0.18;

  return {
    base: toHex(rgb[0], rgb[1], rgb[2]),
    highlightBright: mixRgb(rgb, white, hiBoost),
    highlightSoft: mixRgb(rgb, white, softBoost),
    midLight: mixRgb(rgb, white, 0.03),
    midDark: mixRgb(rgb, shadowDark, 0.10),
    rimShade: mixRgb(rgb, shadowDark, shadeWeight),
    footbedCenter: mixRgb(rgb, shadowDark, 0.15),
    footbedDeep: mixRgb(rgb, shadowDark, 0.36),
    heelCupDeep: mixRgb(rgb, deepInk, 0.48),
    seamColor: mixRgb(rgb, deepInk, 0.70),
    nubHighlight: mixRgb(rgb, white, luminance < 0.15 ? 0.14 : 0.12),
    nubShadow: mixRgb(rgb, deepInk, 0.44),
  };
}

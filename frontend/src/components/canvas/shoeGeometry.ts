import type { CrocSize, ShoeSide } from '@crocs/shared';

export interface ShoeSvgPaths {
  outerShell: string;
  footbed: string;
  strap: string;
  strapRivet: { x: number; y: number };
  toeBumper: string;
}

/**
 * Returns tailored SVG path strings for each size tier, reflecting the realistic
 * anatomical differences: infant is blocky/chubby with a semicircular toe,
 * kids is transitional, and adult has classic elongated asymmetrical curves.
 */
export function getShoePaths(
  side: ShoeSide,
  size: CrocSize,
  width: number,
  height: number
): ShoeSvgPaths {
  const isLeft = side === 'left';

  // Transform normalized (0..1) point to mirrored pixel point
  const pt = (normX: number, normY: number): string => {
    const x = isLeft ? normX * width : (1.0 - normX) * width;
    const y = normY * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  if (size === 'infant') {
    // Infant: Blocky, stubby, bulbous semicircle toe, wide collar
    return {
      outerShell: [
        `M ${pt(0.5, 0.03)}`,
        `C ${pt(0.88, 0.03)} ${pt(0.96, 0.28)} ${pt(0.95, 0.52)}`,
        `C ${pt(0.94, 0.72)} ${pt(0.88, 0.96)} ${pt(0.5, 0.98)}`,
        `C ${pt(0.12, 0.96)} ${pt(0.06, 0.72)} ${pt(0.05, 0.52)}`,
        `C ${pt(0.04, 0.28)} ${pt(0.12, 0.03)} ${pt(0.5, 0.03)} Z`,
      ].join(' '),
      footbed: [
        `M ${pt(0.5, 0.62)}`,
        `C ${pt(0.78, 0.62)} ${pt(0.82, 0.76)} ${pt(0.78, 0.88)}`,
        `C ${pt(0.72, 0.95)} ${pt(0.28, 0.95)} ${pt(0.22, 0.88)}`,
        `C ${pt(0.18, 0.76)} ${pt(0.22, 0.62)} ${pt(0.5, 0.62)} Z`,
      ].join(' '),
      strap: [
        `M ${pt(0.14, 0.68)}`,
        `C ${pt(0.14, 0.58)} ${pt(0.86, 0.58)} ${pt(0.86, 0.68)}`,
        `L ${pt(0.83, 0.73)}`,
        `C ${pt(0.83, 0.64)} ${pt(0.17, 0.64)} ${pt(0.17, 0.73)} Z`,
      ].join(' '),
      strapRivet: {
        x: isLeft ? 0.15 * width : 0.85 * width,
        y: 0.68 * height,
      },
      toeBumper: [
        `M ${pt(0.25, 0.08)}`,
        `C ${pt(0.5, 0.05)} ${pt(0.75, 0.08)} ${pt(0.82, 0.16)}`,
      ].join(' '),
    };
  }

  // Adult / Youth / Kids: Asymmetrical anatomical sweep favoring inner arch
  const isAdultOrYouth = size === 'adult' || size === 'youth';
  const toeFlareX = isAdultOrYouth ? 0.92 : 0.93;

  return {
    outerShell: [
      `M ${pt(0.52, 0.02)}`,
      // Toe cap curve
      `C ${pt(toeFlareX, 0.05)} ${pt(0.96, 0.22)} ${pt(0.94, 0.45)}`,
      // Lateral waist taper
      `C ${pt(0.92, 0.62)} ${pt(0.86, 0.82)} ${pt(0.76, 0.94)}`,
      // Heel cup
      `C ${pt(0.64, 0.99)} ${pt(0.36, 0.99)} ${pt(0.24, 0.94)}`,
      // Medial inner arch contour (curved in for anatomical foot shape)
      `C ${pt(0.14, 0.82)} ${pt(0.08, 0.62)} ${pt(0.06, 0.45)}`,
      // Inner toe sweep
      `C ${pt(0.04, 0.22)} ${pt(0.16, 0.04)} ${pt(0.52, 0.02)} Z`,
    ].join(' '),
    footbed: [
      `M ${pt(0.5, 0.66)}`,
      `C ${pt(0.74, 0.66)} ${pt(0.78, 0.78)} ${pt(0.74, 0.90)}`,
      `C ${pt(0.68, 0.96)} ${pt(0.32, 0.96)} ${pt(0.26, 0.90)}`,
      `C ${pt(0.22, 0.78)} ${pt(0.26, 0.66)} ${pt(0.5, 0.66)} Z`,
    ].join(' '),
    strap: [
      `M ${pt(0.12, 0.72)}`,
      `C ${pt(0.12, 0.62)} ${pt(0.88, 0.62)} ${pt(0.88, 0.72)}`,
      `L ${pt(0.85, 0.77)}`,
      `C ${pt(0.85, 0.67)} ${pt(0.15, 0.67)} ${pt(0.15, 0.77)} Z`,
    ].join(' '),
    strapRivet: {
      x: isLeft ? 0.13 * width : 0.87 * width,
      y: 0.72 * height,
    },
    toeBumper: [
      `M ${pt(0.20, 0.07)}`,
      `C ${pt(0.52, 0.04)} ${pt(0.80, 0.07)} ${pt(0.88, 0.15)}`,
    ].join(' '),
  };
}

import React from 'react';
import { CLOG_REGIONS } from './crocsSvgData.js';
import type { ShoePalette } from './shoeColorUtils.js';

interface ShoeSvgDefsProps {
  side: 'left' | 'right';
  palette: ShoePalette;
}

export const ShoeSvgDefs: React.FC<ShoeSvgDefsProps> = ({ side, palette }) => {
  return (
    <defs>
      {/* Strict Vector Clip Path so nothing can ever render outside the shoe body */}
      <clipPath id={`shoe-clip-${side}`}>
        <path d={CLOG_REGIONS.bodySilhouette} />
      </clipPath>

      {/* 1. Unified Upper Vamp Subtle 3D Dome Gradient */}
      <radialGradient id={`vamp-grad-${side}`} cx="52%" cy="36%" r="64%" fx="48%" fy="30%">
        <stop offset="0%" stopColor={palette.highlightBright} />
        <stop offset="28%" stopColor={palette.highlightSoft} />
        <stop offset="72%" stopColor={palette.base} />
        <stop offset="92%" stopColor={palette.midDark} />
        <stop offset="100%" stopColor={palette.rimShade} />
      </radialGradient>

      {/* 2. Subtle Vamp Crown Sheen */}
      <radialGradient id={`vamp-sheen-${side}`} cx="50%" cy="34%" r="42%">
        <stop offset="0%" stopColor="rgba(255, 255, 255, 0.05)" />
        <stop offset="55%" stopColor="rgba(255, 255, 255, 0.02)" />
        <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
      </radialGradient>

      {/* 3. Raised Collar Rim Tubular Gradient */}
      <linearGradient id={`collar-grad-${side}`} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={palette.highlightBright} />
        <stop offset="35%" stopColor={palette.base} />
        <stop offset="85%" stopColor={palette.midDark} />
        <stop offset="100%" stopColor={palette.rimShade} />
      </linearGradient>

      {/* 4. Recessed Concave Footbed Gradient */}
      <radialGradient id={`footbed-grad-${side}`} cx="50%" cy="54%" r="55%">
        <stop offset="0%" stopColor={palette.footbedCenter} />
        <stop offset="72%" stopColor={palette.footbedDeep} />
        <stop offset="100%" stopColor={palette.seamColor} />
      </radialGradient>

      {/* 5. Upright Backstrap Cylindrical 3D Gradient */}
      <linearGradient id={`strap-grad-${side}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={palette.rimShade} />
        <stop offset="18%" stopColor={palette.base} />
        <stop offset="50%" stopColor={palette.highlightBright} />
        <stop offset="82%" stopColor={palette.base} />
        <stop offset="100%" stopColor={palette.rimShade} />
      </linearGradient>

      {/* 6. Subtle Croslite Foam Texture Strictly Clipped to SourceAlpha */}
      <filter
        id={`foam-grain-${side}`}
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.7"
          numOctaves="2"
          stitchTiles="stitch"
          result="rawNoise"
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.025 0"
          in="rawNoise"
          result="grain"
        />
        <feComposite in="grain" in2="SourceAlpha" operator="in" result="clippedGrain" />
        <feBlend mode="overlay" in="clippedGrain" in2="SourceGraphic" />
      </filter>
    </defs>
  );
};

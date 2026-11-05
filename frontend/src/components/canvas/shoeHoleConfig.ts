import type { CrocSize } from '@crocs/shared';

export interface LocalHoleSpec {
  index: number;
  x: number;
  y: number;
  r: number;
}

export interface ShoeDisplaySpec {
  width: number;
  height: number;
  label: string;
}

/**
 * Display dimensions per size tier based on the 350x786 reference clog viewBox.
 * Infant is intentionally wider/stubbier (lower height-to-width ratio) than Adult.
 */
export const SHOE_DISPLAY_SIZES: Record<CrocSize, ShoeDisplaySpec> = {
  infant: { width: 176, height: 320, label: 'Infant (Blocky & Wide)' },
  kids: { width: 186, height: 376, label: 'Kids (Transitional)' },
  youth: { width: 198, height: 422, label: 'Youth (Streamlined)' },
  adult: { width: 210, height: 472, label: 'Adult (Classic 1:1)' },
};

/**
 * Per-size Left Shoe hole coordinates in the 350x786 SVG viewBox space.
 * Edit (x, y, r) here to fine-tune hole alignment for each shoe size.
 * The Right Shoe automatically mirrors these horizontally (x_right = 350 - x_left).
 */
export const SHOE_HOLES_BY_SIZE: Record<CrocSize, LocalHoleSpec[]> = {
  infant: [
    { index: 1, x: 207.3, y: 76.5, r: 11.1 },
    { index: 2, x: 141.6, y: 105.5, r: 11.0 },
    { index: 3, x: 256.7, y: 123.4, r: 11.2 },
    { index: 4, x: 204.9, y: 140.4, r: 11.3 },
    { index: 5, x: 96.7, y: 154.8, r: 10.9 },
    { index: 6, x: 152.5, y: 166.1, r: 11.1 },
    { index: 7, x: 258.0, y: 190.2, r: 11.2 },
    { index: 8, x: 202.1, y: 211.9, r: 11.1 },
    { index: 9, x: 74.2, y: 215.0, r: 10.8 },
    { index: 10, x: 124.5, y: 219.2, r: 10.9 },
    { index: 11, x: 255.6, y: 254.3, r: 11.1 },
    { index: 12, x: 158.2, y: 258.1, r: 11.0 },
    { index: 13, x: 71.0, y: 278.6, r: 10.8 },
  ],
  kids: [
    { index: 1, x: 207.3, y: 76.5, r: 11.1 },
    { index: 2, x: 141.6, y: 105.5, r: 11.0 },
    { index: 3, x: 256.7, y: 123.4, r: 11.2 },
    { index: 4, x: 204.9, y: 140.4, r: 11.3 },
    { index: 5, x: 96.7, y: 154.8, r: 10.9 },
    { index: 6, x: 152.5, y: 166.1, r: 11.1 },
    { index: 7, x: 258.0, y: 190.2, r: 11.2 },
    { index: 8, x: 202.1, y: 211.9, r: 11.1 },
    { index: 9, x: 74.2, y: 215.0, r: 10.8 },
    { index: 10, x: 124.5, y: 219.2, r: 10.9 },
    { index: 11, x: 255.6, y: 254.3, r: 11.1 },
    { index: 12, x: 158.2, y: 258.1, r: 11.0 },
    { index: 13, x: 71.0, y: 278.6, r: 10.8 },
  ],
  youth: [
    { index: 1, x: 207.3, y: 76.5, r: 11.1 },
    { index: 2, x: 141.6, y: 105.5, r: 11.0 },
    { index: 3, x: 256.7, y: 123.4, r: 11.2 },
    { index: 4, x: 204.9, y: 140.4, r: 11.3 },
    { index: 5, x: 96.7, y: 154.8, r: 10.9 },
    { index: 6, x: 152.5, y: 166.1, r: 11.1 },
    { index: 7, x: 258.0, y: 190.2, r: 11.2 },
    { index: 8, x: 202.1, y: 211.9, r: 11.1 },
    { index: 9, x: 74.2, y: 215.0, r: 10.8 },
    { index: 10, x: 124.5, y: 219.2, r: 10.9 },
    { index: 11, x: 255.6, y: 254.3, r: 11.1 },
    { index: 12, x: 158.2, y: 258.1, r: 11.0 },
    { index: 13, x: 71.0, y: 278.6, r: 10.8 },
  ],
  adult: [
    { index: 1, x: 207.3, y: 76.5, r: 11.1 },
    { index: 2, x: 141.6, y: 105.5, r: 11.0 },
    { index: 3, x: 256.7, y: 123.4, r: 11.2 },
    { index: 4, x: 204.9, y: 140.4, r: 11.3 },
    { index: 5, x: 96.7, y: 154.8, r: 10.9 },
    { index: 6, x: 152.5, y: 166.1, r: 11.1 },
    { index: 7, x: 258.0, y: 190.2, r: 11.2 },
    { index: 8, x: 202.1, y: 211.9, r: 11.1 },
    { index: 9, x: 74.2, y: 215.0, r: 10.8 },
    { index: 10, x: 124.5, y: 219.2, r: 10.9 },
    { index: 11, x: 255.6, y: 254.3, r: 11.1 },
    { index: 12, x: 158.2, y: 258.1, r: 11.0 },
    { index: 13, x: 71.0, y: 278.6, r: 10.8 },
  ],
};

export interface Point2D {
  x: number;
  y: number;
}

/**
 * Calculates the angle in degrees (0 to 359) from center to pointer.
 * 0° points straight up (12 o'clock), rotating clockwise.
 */
export function calculateAngleDeg(center: Point2D, pointer: Point2D): number {
  const dx = pointer.x - center.x;
  const dy = pointer.y - center.y;
  // atan2(dx, -dy) gives 0 at top (12 o'clock), 90 at right (3 o'clock)
  const rad = Math.atan2(dx, -dy);
  let deg = Math.round((rad * 180) / Math.PI);
  if (deg < 0) {
    deg += 360;
  }
  return deg % 360;
}

/**
 * Normalizes any degree value into the canonical 0-359 range.
 */
export function normalizeAngle(deg: number): number {
  const mod = deg % 360;
  return mod < 0 ? mod + 360 : mod;
}

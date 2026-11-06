import { describe, it, expect } from 'vitest';
import {
  calculateAngleDeg,
  normalizeAngle,
  processCharmClick,
  DEFAULT_CLICK_TIMEOUT_MS,
  type ClickTrackerState,
} from '../src/index.js';

describe('Rotation Utilities', () => {
  it('calculates 360-degree angles correctly relative to center', () => {
    const center = { x: 100, y: 100 };

    // Straight up (12 o'clock) -> 0°
    expect(calculateAngleDeg(center, { x: 100, y: 50 })).toBe(0);

    // Right (3 o'clock) -> 90°
    expect(calculateAngleDeg(center, { x: 150, y: 100 })).toBe(90);

    // Down (6 o'clock) -> 180°
    expect(calculateAngleDeg(center, { x: 100, y: 150 })).toBe(180);

    // Left (9 o'clock) -> 270°
    expect(calculateAngleDeg(center, { x: 50, y: 100 })).toBe(270);
  });

  it('normalizes degrees to 0-359 range', () => {
    expect(normalizeAngle(0)).toBe(0);
    expect(normalizeAngle(360)).toBe(0);
    expect(normalizeAngle(370)).toBe(10);
    expect(normalizeAngle(-90)).toBe(270);
  });
});

describe('Double-Tap Deletion Engine', () => {
  it('selects on first tap', () => {
    const state: ClickTrackerState = { targetId: null, clickCount: 0, lastClickTime: 0 };
    const res = processCharmClick('inst-1', state, 1000);

    expect(res.isSelected).toBe(true);
    expect(res.shouldDelete).toBe(false);
    expect(res.nextState.clickCount).toBe(1);
    expect(res.nextState.targetId).toBe('inst-1');
  });

  it('deletes on the second tap (double-tap within timeout)', () => {
    const state: ClickTrackerState = { targetId: 'inst-1', clickCount: 1, lastClickTime: 1000 };
    const res = processCharmClick('inst-1', state, 1250);

    expect(res.shouldDelete).toBe(true);
    expect(res.isSelected).toBe(false);
    expect(res.nextState.clickCount).toBe(0);
  });

  it('resets click count if time between taps exceeds timeout', () => {
    const state: ClickTrackerState = { targetId: 'inst-1', clickCount: 1, lastClickTime: 1000 };
    // Click after timeout expired
    const res = processCharmClick('inst-1', state, 1000 + DEFAULT_CLICK_TIMEOUT_MS + 100);

    expect(res.shouldDelete).toBe(false);
    expect(res.isSelected).toBe(true);
    expect(res.nextState.clickCount).toBe(1); // restarts at 1
  });

  it('switches target if clicking another charm', () => {
    const state: ClickTrackerState = { targetId: 'inst-1', clickCount: 1, lastClickTime: 1000 };
    const res = processCharmClick('inst-2', state, 1100);

    expect(res.shouldDelete).toBe(false);
    expect(res.isSelected).toBe(true);
    expect(res.nextState.targetId).toBe('inst-2');
    expect(res.nextState.clickCount).toBe(1);
  });
});

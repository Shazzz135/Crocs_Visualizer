import type { CrocSize } from '../types/crocs.js';
import type { PlacedJibbitz } from '../types/jibbitz.js';

export const STORAGE_SCHEMA_VERSION = 1;
export const CUSTOMIZER_STORAGE_KEY = 'crocs_customizer_state_v1';

const VALID_SIZES: Set<CrocSize> = new Set(['adult', 'youth', 'kids', 'infant']);
const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export interface PersistedCustomizerState {
  version: number;
  size: CrocSize;
  colorHex: string;
  placements: PlacedJibbitz[];
  updatedAt: number;
}

/**
 * Validates whether a single placement object complies with PlacedJibbitz contract.
 */
function isValidPlacement(item: unknown): item is PlacedJibbitz {
  if (typeof item !== 'object' || item === null) return false;
  const p = item as Record<string, unknown>;

  return (
    typeof p.instanceId === 'string' &&
    p.instanceId.length > 0 &&
    typeof p.jibbitId === 'string' &&
    p.jibbitId.length > 0 &&
    typeof p.holeId === 'string' &&
    p.holeId.length > 0 &&
    typeof p.rotationDeg === 'number' &&
    !Number.isNaN(p.rotationDeg) &&
    typeof p.placedAt === 'number'
  );
}

/**
 * Strict schema validator for serialized customizer storage payloads.
 */
export function isValidPersistedState(data: unknown): data is PersistedCustomizerState {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;

  if (typeof d.version !== 'number' || d.version < 1) return false;
  if (typeof d.size !== 'string' || !VALID_SIZES.has(d.size as CrocSize)) return false;
  if (typeof d.colorHex !== 'string' || !HEX_COLOR_REGEX.test(d.colorHex)) return false;
  if (typeof d.updatedAt !== 'number' || Number.isNaN(d.updatedAt)) return false;
  if (!Array.isArray(d.placements)) return false;

  return d.placements.every(isValidPlacement);
}

/**
 * Safely parses raw JSON from localStorage with validation and corruption protection.
 * Returns null if string is empty, invalid JSON, or fails schema validation.
 */
export function deserializeCustomizerState(rawJson: string | null): PersistedCustomizerState | null {
  if (!rawJson || typeof rawJson !== 'string') return null;

  try {
    const parsed = JSON.parse(rawJson);
    if (isValidPersistedState(parsed)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Encodes customizer state into a versioned JSON string for localStorage.
 */
export function serializeCustomizerState(
  payload: Omit<PersistedCustomizerState, 'version' | 'updatedAt'>
): string {
  const state: PersistedCustomizerState = {
    version: STORAGE_SCHEMA_VERSION,
    size: payload.size,
    colorHex: payload.colorHex,
    placements: payload.placements,
    updatedAt: Date.now(),
  };

  return JSON.stringify(state);
}

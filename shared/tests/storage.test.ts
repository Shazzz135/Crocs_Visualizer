import { describe, expect, it } from 'vitest';
import {
  CUSTOMIZER_STORAGE_KEY,
  STORAGE_SCHEMA_VERSION,
  deserializeCustomizerState,
  isValidPersistedState,
  serializeCustomizerState,
} from '../src/index.js';

describe('LocalStorage Persistence & Schema Validation', () => {
  const sampleValidPlacement = {
    instanceId: 'inst-1',
    jibbitId: '10006949',
    holeId: 'HL-01',
    rotationDeg: 45,
    placedAt: 1730000000000,
  };

  it('serializes customizer state with schema version and timestamp', () => {
    const json = serializeCustomizerState({
      size: 'adult',
      colorHex: '#101010',
      placements: [sampleValidPlacement],
    });

    expect(typeof json).toBe('string');
    const parsed = JSON.parse(json);
    expect(parsed.version).toBe(STORAGE_SCHEMA_VERSION);
    expect(parsed.size).toBe('adult');
    expect(parsed.colorHex).toBe('#101010');
    expect(parsed.placements).toHaveLength(1);
    expect(typeof parsed.updatedAt).toBe('number');
  });

  it('deserializes a valid payload correctly', () => {
    const raw = JSON.stringify({
      version: 1,
      size: 'youth',
      colorHex: '#0055ff',
      placements: [sampleValidPlacement],
      updatedAt: 1730000000000,
    });

    const result = deserializeCustomizerState(raw);
    expect(result).not.toBeNull();
    expect(result?.size).toBe('youth');
    expect(result?.colorHex).toBe('#0055ff');
    expect(result?.placements).toHaveLength(1);
  });

  it('gracefully returns null for null, empty, or non-string inputs', () => {
    expect(deserializeCustomizerState(null)).toBeNull();
    expect(deserializeCustomizerState('')).toBeNull();
    // @ts-expect-error test non-string runtime values
    expect(deserializeCustomizerState(undefined)).toBeNull();
  });

  it('gracefully handles corrupted/malformed JSON strings without throwing', () => {
    expect(deserializeCustomizerState('{"corrupted JSON ...')).toBeNull();
    expect(deserializeCustomizerState('{ invalid }')).toBeNull();
    expect(deserializeCustomizerState('null')).toBeNull();
    expect(deserializeCustomizerState('12345')).toBeNull();
  });

  it('rejects payloads with missing or invalid fields', () => {
    // Missing size
    expect(
      isValidPersistedState({
        version: 1,
        colorHex: '#000000',
        placements: [],
        updatedAt: Date.now(),
      })
    ).toBe(false);

    // Invalid size tier
    expect(
      isValidPersistedState({
        version: 1,
        size: 'giant',
        colorHex: '#000000',
        placements: [],
        updatedAt: Date.now(),
      })
    ).toBe(false);

    // Invalid color format (not a valid hex)
    expect(
      isValidPersistedState({
        version: 1,
        size: 'adult',
        colorHex: 'rgb(255,0,0)',
        placements: [],
        updatedAt: Date.now(),
      })
    ).toBe(false);

    // Invalid version
    expect(
      isValidPersistedState({
        version: 0,
        size: 'adult',
        colorHex: '#000000',
        placements: [],
        updatedAt: Date.now(),
      })
    ).toBe(false);

    // Corrupted placement item missing required fields
    expect(
      isValidPersistedState({
        version: 1,
        size: 'adult',
        colorHex: '#000000',
        placements: [{ invalidField: true }],
        updatedAt: Date.now(),
      })
    ).toBe(false);
  });

  it('exports standard storage key constant', () => {
    expect(CUSTOMIZER_STORAGE_KEY).toBe('crocs_customizer_state_v1');
  });
});

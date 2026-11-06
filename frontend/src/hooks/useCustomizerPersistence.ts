import {
  CUSTOMIZER_STORAGE_KEY,
  DEFAULT_CROC_COLORS,
  deserializeCustomizerState,
  serializeCustomizerState,
  type CrocColor,
  type CrocSize,
  type PlacedJibbitz,
} from '@crocs/shared';
import { useEffect } from 'react';

export interface InitialCustomizerData {
  size: CrocSize;
  color: CrocColor;
  placements: PlacedJibbitz[];
}

/**
 * Safely loads persisted customizer configuration from localStorage.
 * Gracefully falls back to default settings if data is missing, invalid, or corrupted.
 */
export function loadPersistedCustomizerState(): InitialCustomizerData {
  const fallback: InitialCustomizerData = {
    size: 'adult',
    color: DEFAULT_CROC_COLORS[0],
    placements: [],
  };

  if (typeof window === 'undefined' || !window.localStorage) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(CUSTOMIZER_STORAGE_KEY);
    const parsed = deserializeCustomizerState(raw);
    if (!parsed) return fallback;

    const matchedColor =
      DEFAULT_CROC_COLORS.find((c) => c.hex.toLowerCase() === parsed.colorHex.toLowerCase()) ?? {
        id: 'persisted-color',
        name: 'Selected Color',
        hex: parsed.colorHex,
      };

    return {
      size: parsed.size,
      color: matchedColor,
      placements: parsed.placements,
    };
  } catch {
    return fallback;
  }
}

/**
 * Safely removes customizer configuration from localStorage.
 */
export function clearPersistedCustomizerState(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.removeItem(CUSTOMIZER_STORAGE_KEY);
  } catch {
    // Graceful no-op on storage errors
  }
}

interface UsePersistenceOptions {
  size: CrocSize;
  colorHex: string;
  placements: PlacedJibbitz[];
}

/**
 * React hook that automatically saves customizer configuration to localStorage.
 */
export function useCustomizerPersistence({ size, colorHex, placements }: UsePersistenceOptions): void {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      const serialized = serializeCustomizerState({
        size,
        colorHex,
        placements,
      });
      window.localStorage.setItem(CUSTOMIZER_STORAGE_KEY, serialized);
    } catch {
      // Graceful no-op if localStorage quota is exceeded or storage is disabled
    }
  }, [size, colorHex, placements]);
}

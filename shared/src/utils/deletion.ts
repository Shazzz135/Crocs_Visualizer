export interface ClickTrackerState {
  targetId: string | null;
  clickCount: number;
  lastClickTime: number;
}

export const DEFAULT_CLICK_TIMEOUT_MS = 500;

/**
 * Handles double-tap deletion tracking:
 * Tap 1: Select charm
 * Tap 2 (double-tap within timeout): Trigger deletion
 * Returns: { shouldDelete: boolean, isSelected: boolean, nextState: ClickTrackerState }
 */
export function processCharmClick(
  charmId: string,
  currentState: ClickTrackerState,
  now: number = Date.now(),
  timeoutMs: number = DEFAULT_CLICK_TIMEOUT_MS
): {
  shouldDelete: boolean;
  isSelected: boolean;
  nextState: ClickTrackerState;
} {
  const isSameTarget = currentState.targetId === charmId;
  const isWithinTimeout = now - currentState.lastClickTime <= timeoutMs;

  if (isSameTarget && isWithinTimeout) {
    const nextCount = currentState.clickCount + 1;
    if (nextCount >= 2) {
      // Double-tap reached -> Trigger deletion
      return {
        shouldDelete: true,
        isSelected: false,
        nextState: { targetId: null, clickCount: 0, lastClickTime: 0 },
      };
    }
  }

  // First click on this charm (or previous click timed out)
  return {
    shouldDelete: false,
    isSelected: true,
    nextState: { targetId: charmId, clickCount: 1, lastClickTime: now },
  };
}

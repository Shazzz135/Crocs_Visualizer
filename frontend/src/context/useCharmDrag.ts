import { useContext } from 'react';
import { CharmDragContext, type CharmDragContextValue } from './charmDragContextDef.js';

export function useCharmDrag(): CharmDragContextValue {
  const ctx = useContext(CharmDragContext);
  if (!ctx) {
    throw new Error('useCharmDrag must be used within CharmDragProvider');
  }
  return ctx;
}

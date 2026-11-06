import { useState, useRef, useCallback } from 'react';

export type DrawerPosition = 'collapsed' | 'mid' | 'expanded';

interface UseMobileDrawerDragReturn {
  position: DrawerPosition;
  dragHeightPx: number | null;
  isDragging: boolean;
  drawerStyle: React.CSSProperties;
  drawerClass: string;
  handleTouchStart: (e: React.TouchEvent | React.PointerEvent) => void;
  handleTouchMove: (e: React.TouchEvent | React.PointerEvent) => void;
  handleTouchEnd: () => void;
  toggleDrawer: () => void;
  setPosition: (pos: DrawerPosition) => void;
}

export function useMobileDrawerDrag(): UseMobileDrawerDragReturn {
  const [position, setPosition] = useState<DrawerPosition>('mid');
  const [dragHeightPx, setDragHeightPx] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const startYRef = useRef<number>(0);
  const startHeightRef = useRef<number>(0);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent | React.PointerEvent) => {
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      startYRef.current = clientY;

      const vh = window.innerHeight;
      const curH =
        position === 'expanded' ? vh * 0.92 : position === 'mid' ? vh * 0.55 : 64;

      startHeightRef.current = curH;
      setIsDragging(true);
    },
    [position]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent | React.PointerEvent) => {
      if (!isDragging) return;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaY = startYRef.current - clientY;
      const newHeight = Math.max(
        64,
        Math.min(window.innerHeight * 0.94, startHeightRef.current + deltaY)
      );
      setDragHeightPx(newHeight);
    },
    [isDragging]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragHeightPx !== null) {
      const vh = window.innerHeight;
      const collapsedThreshold = vh * 0.25;
      const expandedThreshold = vh * 0.75;

      if (dragHeightPx < collapsedThreshold) {
        setPosition('collapsed');
      } else if (dragHeightPx > expandedThreshold) {
        setPosition('expanded');
      } else {
        setPosition('mid');
      }
      setDragHeightPx(null);
    }
  }, [dragHeightPx, isDragging]);

  const toggleDrawer = useCallback(() => {
    setPosition((prev) => {
      if (prev === 'collapsed') return 'mid';
      if (prev === 'mid') return 'expanded';
      return 'collapsed';
    });
  }, []);

  const drawerStyle: React.CSSProperties =
    dragHeightPx !== null ? { height: `${dragHeightPx}px`, transition: 'none' } : {};

  const drawerClass =
    dragHeightPx !== null
      ? 'fixed inset-x-0 bottom-0 md:relative md:h-full md:inset-auto'
      : position === 'expanded'
      ? 'h-[92dvh] fixed inset-x-0 bottom-0 md:relative md:h-full md:inset-auto'
      : position === 'collapsed'
      ? 'h-16 fixed inset-x-0 bottom-0 md:relative md:h-full md:inset-auto'
      : 'h-[56dvh] md:h-full';

  return {
    position,
    dragHeightPx,
    isDragging,
    drawerStyle,
    drawerClass,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    toggleDrawer,
    setPosition,
  };
}

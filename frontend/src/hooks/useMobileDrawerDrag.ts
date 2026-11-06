import { useState, useRef, useCallback } from 'react';

export type DrawerPosition = 'collapsed' | 'mid' | 'expanded';

interface UseMobileDrawerDragReturn {
  position: DrawerPosition;
  drawerRef: React.RefObject<HTMLElement | null>;
  isDragging: boolean;
  drawerClass: string;
  handlePointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  handlePointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  handlePointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleClick: (e: React.MouseEvent) => void;
  toggleDrawer: () => void;
  setPosition: (pos: DrawerPosition) => void;
}

export function useMobileDrawerDrag(): UseMobileDrawerDragReturn {
  const [position, setPosition] = useState<DrawerPosition>('mid');
  const [isDragging, setIsDragging] = useState(false);
  const drawerRef = useRef<HTMLElement | null>(null);

  const startYRef = useRef<number>(0);
  const startHeightRef = useRef<number>(0);
  const pointerIdRef = useRef<number | null>(null);
  const hasMovedRef = useRef<boolean>(false);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      e.stopPropagation();

      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Fallback if capture not available
      }

      pointerIdRef.current = e.pointerId;
      hasMovedRef.current = false;
      startYRef.current = e.clientY;

      const currentHeight = drawerRef.current
        ? drawerRef.current.getBoundingClientRect().height
        : position === 'expanded'
        ? window.innerHeight * 0.90
        : position === 'mid'
        ? window.innerHeight * 0.52
        : 64;

      startHeightRef.current = currentHeight;
      setIsDragging(true);
    },
    [position]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current !== e.pointerId || !isDragging) return;
      e.stopPropagation();

      const deltaY = startYRef.current - e.clientY;
      if (Math.abs(deltaY) > 5) {
        hasMovedRef.current = true;
      }

      const minH = 64;
      const maxH = window.innerHeight * 0.90;
      const newHeight = Math.max(minH, Math.min(maxH, startHeightRef.current + deltaY));

      if (drawerRef.current) {
        drawerRef.current.style.height = `${newHeight}px`;
        drawerRef.current.style.transition = 'none';
      }
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current !== e.pointerId) return;
      e.stopPropagation();

      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Fallback if release not available
      }

      pointerIdRef.current = null;
      setIsDragging(false);

      if (drawerRef.current) {
        const currentHeight = drawerRef.current.getBoundingClientRect().height;
        const vh = window.innerHeight;
        const collapsedThreshold = vh * 0.28;
        const expandedThreshold = vh * 0.72;

        const targetPos: DrawerPosition =
          currentHeight < collapsedThreshold
            ? 'collapsed'
            : currentHeight > expandedThreshold
            ? 'expanded'
            : 'mid';

        drawerRef.current.style.height = '';
        drawerRef.current.style.transition = '';
        setPosition(targetPos);
      }
    },
    []
  );

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setPosition((prev) => {
      if (prev === 'collapsed') return 'mid';
      if (prev === 'mid') return 'expanded';
      return 'collapsed';
    });
  }, []);

  const toggleDrawer = useCallback(() => {
    setPosition((prev) => {
      if (prev === 'collapsed') return 'mid';
      if (prev === 'mid') return 'expanded';
      return 'collapsed';
    });
  }, []);

  const drawerClass =
    position === 'expanded'
      ? 'h-[90dvh] fixed inset-x-0 bottom-0 md:relative md:h-full md:inset-auto'
      : position === 'collapsed'
      ? 'h-16 fixed inset-x-0 bottom-0 md:relative md:h-full md:inset-auto'
      : 'h-[52dvh] fixed inset-x-0 bottom-0 md:relative md:h-full md:inset-auto';

  return {
    position,
    drawerRef,
    isDragging,
    drawerClass,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleClick,
    toggleDrawer,
    setPosition,
  };
}

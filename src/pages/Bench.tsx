import { useState, useEffect, useRef, useCallback } from 'react';
import Tools, { getCharmSpriteStyle } from '../components/Tools';
import View from '../components/View';
import { colors, type Color } from '../data/colors';

export interface PlacedCharm {
  id: string;
  char: string;
  shoe: 'left' | 'right';
  holeId: string;
  rotation: number;
}

export default function Bench() {
  const [selectedColor, setSelectedColor] = useState<Color>(colors[0]);
  const [placedCharms, setPlacedCharms] = useState<PlacedCharm[]>([]);
  
  // Custom Global Drag State
  const [dragChar, setDragChar] = useState<string | null>(null);
  
  // Ref for the floating ghost element to eliminate render lag
  const ghostRef = useRef<HTMLDivElement>(null);

  const handleDropCharm = useCallback((holeId: string, shoe: 'left' | 'right', charmData?: any) => {
    const rawChar = typeof charmData === 'string' ? charmData : charmData?.char || dragChar;
    if (!rawChar) return;

    setPlacedCharms((prev) => {
      // Remove existing charm in that hole if present
      const filtered = prev.filter((c) => !(c.holeId === holeId && c.shoe === shoe));
      
      // Append newly dropped charm
      return [
        ...filtered,
        {
          id: `${shoe}-${holeId}-${Date.now()}`,
          holeId,
          shoe,
          char: typeof rawChar === 'string' ? rawChar : rawChar.char,
          rotation: 0,
        },
      ];
    });

    setDragChar(null);
  }, [dragChar]);

  useEffect(() => {
    if (!dragChar) return;

    const handlePointerMove = (e: PointerEvent) => {
      // Prevent screen scrolling during touch drag on mobile devices
      if (e.cancelable) e.preventDefault();

      // Directly update DOM for smooth 60FPS dragging attached to pointer/touch
      if (ghostRef.current) {
        ghostRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      // Identify target hole under pointer position (works on mouse & mobile touch)
      const targetEl = document.elementFromPoint(e.clientX, e.clientY);
      const holeTarget = targetEl?.closest('[data-hole-id]') as HTMLElement | null;

      if (holeTarget && dragChar) {
        const holeId = holeTarget.getAttribute('data-hole-id');
        const shoe = holeTarget.getAttribute('data-shoe') as 'left' | 'right';
        if (holeId && shoe) {
          handleDropCharm(holeId, shoe, dragChar);
        }
      }

      setDragChar(null);
    };

    document.addEventListener('pointermove', handlePointerMove, { passive: false });
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointercancel', handlePointerUp);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [dragChar, handleDropCharm]);

  return (
    <div className="relative flex flex-col-reverse md:flex-row h-screen w-screen overflow-hidden text-white bg-gray-950">
      <aside className="w-full md:w-1/2 h-2/5 md:h-full z-10 bg-gray-900 border-t md:border-r border-gray-800 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <Tools
          selectedColor={selectedColor.color}
          onSelectColor={setSelectedColor}
          onDragStartCharm={(char, x, y) => {
            setDragChar(char);
            // Snap ghost immediately to cursor on click or touch down
            if (ghostRef.current) {
              ghostRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
            }
          }}
        />
      </aside>

      <main className="relative w-full md:w-1/2 h-3/5 md:h-full flex items-center justify-center p-2 sm:p-4 md:p-8 bg-gray-950/80 overflow-hidden">
        <View 
          selectedColor={selectedColor} 
          isDragging={!!dragChar}
          placedCharms={placedCharms}
          onUpdateCharm={(id, rotation) => setPlacedCharms((p) => p.map((c) => c.id === id ? { ...c, rotation } : c))}
          onRemoveCharm={(id) => setPlacedCharms((p) => p.filter((c) => c.id !== id))}
          onDropCharm={handleDropCharm}
          activeDraggedCharm={dragChar}
        />
      </main>

      {/* Dynamic Touch / Drag Ghost Element */}
      <div
        ref={ghostRef}
        className={`fixed top-0 left-0 pointer-events-none z-[100] drop-shadow-2xl transition-opacity duration-150 touch-none ${
          dragChar ? 'opacity-90' : 'opacity-0'
        }`}
        style={{ willChange: 'transform' }}
      >
        {dragChar && (
          <div
            className="w-16 h-16 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-no-repeat"
            style={getCharmSpriteStyle(dragChar)}
          />
        )}
      </div>
    </div>
  );
}
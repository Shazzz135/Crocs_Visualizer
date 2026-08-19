import { useState, useRef } from 'react';
import ColoredClog from './view/Canvas';
import { colors, type Color } from '../data/colors';
import { getCharmSpriteStyle } from './Tools';
import { type PlacedCharm } from '../pages/Bench';

interface ViewProps {
  selectedColor?: Color | null;
  isDragging: boolean;
  placedCharms: PlacedCharm[];
  onUpdateCharm: (id: string, rotation: number) => void;
  onRemoveCharm: (id: string) => void;
  onDropCharm?: (holeId: string, shoe: 'left' | 'right', charmData?: any) => void;
  activeDraggedCharm?: any;
}

const SHOE_HOLES = [
  { id: 'h1', x: 59.5, y: 9.75 },
  { id: 'h2', x: 40.5, y: 13.5 }, 
  { id: 'h3', x: 73.5, y: 15.75 },
  { id: 'h4', x: 59, y: 18 }, 
  { id: 'h5', x: 27.75, y: 19.75 }, 
  { id: 'h6', x: 43.5, y: 21 },
  { id: 'h7', x: 74, y: 24 }, 
  { id: 'h8', x: 58, y: 27 }, 
  { id: 'h9', x: 21, y: 27.5 }, 
  { id: 'h10', x: 36, y: 28 },
  { id: 'h11', x: 73, y: 32.5 }, 
  { id: 'h12', x: 45.25, y: 33 }, 
  { id: 'h13', x: 20.5, y: 35.5 }
];

export default function View({ 
  selectedColor, 
  isDragging, 
  placedCharms, 
  onUpdateCharm, 
  onRemoveCharm, 
  onDropCharm,
  activeDraggedCharm 
}: ViewProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeColors = selectedColor?.set
    ? [selectedColor.set.c1, selectedColor.set.c2, selectedColor.set.c3].filter(Boolean)
    : [colors[0].set.c1, colors[0].set.c2, colors[0].set.c3];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const executeDrop = (holeId: string, shoeType: 'left' | 'right', rawData?: any) => {
    if (!onDropCharm) return;

    let payload = rawData || activeDraggedCharm;

    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        payload = { char: payload };
      }
    }

    onDropCharm(holeId, shoeType, payload);
  };

  const handleNativeDrop = (e: React.DragEvent, holeId: string, shoeType: 'left' | 'right') => {
    e.preventDefault();
    e.stopPropagation();
    
    let charmData: any = null;
    const jsonStr = e.dataTransfer.getData('application/json');
    const textData = e.dataTransfer.getData('text/plain');

    if (jsonStr) {
      try { charmData = JSON.parse(jsonStr); } catch { charmData = jsonStr; }
    } else if (textData) {
      try { charmData = JSON.parse(textData); } catch { charmData = { char: textData }; }
    }

    executeDrop(holeId, shoeType, charmData);
  };

  const renderShoe = (shoeType: 'left' | 'right', isFlipped: boolean) => {
    const shoeCharms = placedCharms.filter((c) => c.shoe === shoeType);

    return (
      <div 
        className="relative w-[48%] sm:max-w-md scale-[0.85] sm:scale-100 transition-transform origin-center my-0 select-none" 
        onClick={() => setActiveMenuId(null)}
      >
        <ColoredClog color={{ colors: activeColors, angle: 90 }} flipped={isFlipped} />

        <div className="absolute inset-0">
          {SHOE_HOLES.map((hole) => {
            const posX = isFlipped ? 100 - hole.x : hole.x;
            const posY = hole.y;
            const charmInHole = shoeCharms.find((c) => c.holeId === hole.id);
            const hasCharm = !!charmInHole;

            const isNearTop = posY < 25;
            const isNearBottom = posY > 75;
            const verticalAlignClass = isNearTop 
              ? 'top-0 translate-y-0' 
              : isNearBottom 
                ? 'bottom-0 translate-y-0' 
                : 'top-1/2 -translate-y-1/2';

            const horizontalPlacementClass = shoeType === 'left' 
              ? 'left-full ml-3' 
              : 'right-full mr-3';

            return (
              <div
                key={hole.id}
                data-hole-id={hole.id}
                data-shoe={shoeType}
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDrop={(e) => handleNativeDrop(e, hole.id, shoeType)}
                onPointerUp={() => {
                  if (isDragging) executeDrop(hole.id, shoeType);
                }}
                onMouseUp={() => {
                  if (isDragging) executeDrop(hole.id, shoeType);
                }}
                className={`absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 rounded-full transition-all w-[26%] sm:w-[19.5%] aspect-square ${
                  isDragging 
                    ? 'z-40 pointer-events-auto cursor-pointer' 
                    : hasCharm 
                      ? 'z-30 pointer-events-auto' 
                      : 'z-20 pointer-events-auto cursor-pointer'
                }`}
                style={{ left: `${posX}%`, top: `${posY}%` }}
              >
                {/* Placed Charm Target Container */}
                {charmInHole && (
                  <div 
                    className={`absolute inset-0 flex items-center justify-center ${
                      isDragging ? 'pointer-events-none' : 'pointer-events-auto cursor-pointer'
                    }`}
                    onClick={(e) => {
                      if (!isDragging) {
                        e.stopPropagation();
                        e.preventDefault();
                        setActiveMenuId(prev => (prev === charmInHole.id ? null : charmInHole.id));
                      }
                    }}
                  >
                    {/* Rotated Charm Image */}
                    <div
                      className="relative transition-transform select-none flex items-center justify-center pointer-events-none w-full h-full"
                      style={{ transform: `rotate(${charmInHole.rotation}deg)` }}
                    >
                      <div
                        className="bg-no-repeat bg-center drop-shadow-2xl transition-transform w-full h-full sm:w-[88%] sm:h-[88%]"
                        style={getCharmSpriteStyle(charmInHole.char)}
                      />
                    </div>

                    {/* Action Menu */}
                    {activeMenuId === charmInHole.id && !isDragging && (
                      <div 
                        className={`absolute z-50 flex flex-col items-center gap-2 bg-gray-900/95 border border-gray-700 p-2.5 rounded-xl shadow-2xl backdrop-blur-md cursor-default pointer-events-auto ${verticalAlignClass} ${horizontalPlacementClass}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        {/* Vertical Rotation Slider */}
                        <div className="flex flex-col items-center gap-1.5 py-1">
                          <span className="text-[10px] text-gray-400 font-medium">{charmInHole.rotation}°</span>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={charmInHole.rotation}
                            onChange={(e) => onUpdateCharm(charmInHole.id, parseInt(e.target.value, 10))}
                            // @ts-ignore
                            orient="vertical"
                            style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                            className="h-20 w-3 accent-indigo-500 cursor-pointer"
                            title="Rotate charm"
                          />
                        </div>

                        <div className="w-full h-px bg-gray-700" />

                        <button
                          type="button"
                          title="Delete charm"
                          className="w-full py-1.5 px-2 bg-red-600/90 hover:bg-red-500 text-white rounded-lg transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer text-xs font-semibold"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onRemoveCharm(charmInHole.id);
                            setActiveMenuId(null);
                          }}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Remove</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="flex flex-row w-full max-w-4xl justify-center items-center bg-transparent overflow-x-hidden py-4 -space-x-6 sm:space-x-0 sm:gap-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {renderShoe('left', false)}
      {renderShoe('right', true)}
    </div>
  );
}
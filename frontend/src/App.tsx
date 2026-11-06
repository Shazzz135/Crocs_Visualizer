import React, { useState } from 'react';
import type { VentHole } from '@crocs/shared';
import { ShoeCanvas } from './components/canvas/ShoeCanvas.js';
import { ShoeColorTab } from './components/controls/ShoeColorTab.js';
import { JibbitzDiscoveryDrawer } from './components/discovery/JibbitzDiscoveryDrawer.js';
import { useShoeCustomizer } from './hooks/useShoeCustomizer.js';
import { useMobileDrawerDrag } from './hooks/useMobileDrawerDrag.js';

type CustomizerTab = 'shoe' | 'charms';

export const App: React.FC = () => {
  const {
    size,
    color,
    placements,
    occupiedHoleIds,
    activeCharmToPlace,
    selectedPlacementId,
    setSize,
    setColor,
    setActiveHole,
    setActiveCharmToPlace,
    setSelectedPlacementId,
    placeCharm,
    updateRotation,
    handlePlacementClick,
  } = useShoeCustomizer();

  const [activeTab, setActiveTab] = useState<CustomizerTab>('charms');
  const {
    position: drawerPos,
    dragHeightPx,
    isDragging,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    toggleDrawer,
  } = useMobileDrawerDrag();

  const handleHoleClick = (hole: VentHole) => {
    setActiveHole(hole);
    if (activeCharmToPlace) {
      placeCharm(activeCharmToPlace, hole.id);
    }
  };

  // Determine dynamic mobile height style
  const mobileHeightStyle: React.CSSProperties =
    dragHeightPx !== null
      ? { height: `${dragHeightPx}px`, transition: 'none' }
      : {};

  const mobileHeightClass =
    dragHeightPx !== null
      ? 'fixed inset-x-0 bottom-0 md:relative md:h-full md:inset-auto'
      : drawerPos === 'expanded'
      ? 'h-[92dvh] fixed inset-x-0 bottom-0 md:relative md:h-full md:inset-auto'
      : drawerPos === 'collapsed'
      ? 'h-16 fixed inset-x-0 bottom-0 md:relative md:h-full md:inset-auto'
      : 'h-[56dvh] md:h-full';

  return (
    <div className="flex flex-col h-screen w-full max-w-full overflow-hidden bg-[#031811] text-emerald-50 font-sans">
      {/* Main Workspace Layout */}
      <main className="flex-1 flex flex-col-reverse md:flex-row relative overflow-hidden w-full h-full">
        {/* Left Editing Window (Desktop Side Panel / Mobile Dynamic Bottom Sheet) */}
        <aside
          aria-label="Customizer editing workspace"
          style={mobileHeightStyle}
          className={`w-full md:w-[420px] lg:w-[450px] border-t md:border-t-0 md:border-r border-emerald-900/60 bg-[#06241a]/95 p-3 sm:p-4 flex flex-col gap-2.5 backdrop-blur-md shrink-0 z-20 shadow-2xl transition-all duration-200 ${mobileHeightClass}`}
        >
          {/* Mobile Drag Handle: Supports Full Dragging Up and Down */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onPointerDown={handleTouchStart}
            onPointerMove={handleTouchMove}
            onPointerUp={handleTouchEnd}
            className="md:hidden flex flex-col items-center -mt-1 pb-1 cursor-grab active:cursor-grabbing select-none touch-none"
          >
            <div
              className={`w-14 h-1.5 rounded-full transition-colors ${
                isDragging ? 'bg-emerald-400 scale-110' : 'bg-emerald-800'
              }`}
            />
            <span
              onClick={toggleDrawer}
              className="text-[9px] text-emerald-400/80 mt-1 font-medium cursor-pointer"
            >
              {drawerPos === 'expanded'
                ? 'Drag down to collapse'
                : drawerPos === 'collapsed'
                ? 'Drag up or tap to expand'
                : 'Drag all the way up / down'}
            </span>
          </div>

          {/* Dynamic Compact Header Bar */}
          <div className="flex items-center justify-between border-b border-emerald-900/60 pb-2.5 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 shrink-0 rounded-lg bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-black text-emerald-400 text-xs shadow-sm shadow-emerald-500/20">
                CV
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-white leading-tight">
                  Classic Crocs Visualizer
                </h1>
                <p className="text-[11px] text-emerald-400 font-medium">
                  {color.name} • {size.toUpperCase()}
                  {placements.length > 0 && ` • ${placements.length} charms`}
                </p>
              </div>
            </div>

            {/* Dynamic Segmented Mode Switcher */}
            <div
              role="tablist"
              aria-label="Customizer tool modes"
              className="flex p-0.5 bg-[#02130e]/95 rounded-lg border border-emerald-900/80 shadow-inner"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'shoe'}
                onClick={() => setActiveTab('shoe')}
                className={`flex items-center gap-1 py-1 px-2.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'shoe'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/30'
                    : 'text-emerald-300/80 hover:text-white'
                }`}
              >
                <span>👟</span>
                <span>Shoe</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'charms'}
                onClick={() => setActiveTab('charms')}
                className={`flex items-center gap-1 py-1 px-2.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'charms'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/30'
                    : 'text-emerald-300/80 hover:text-white'
                }`}
              >
                <span>✨</span>
                <span>Charms</span>
              </button>
            </div>
          </div>

          {/* Active Placement Hint Banner */}
          {activeCharmToPlace && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950 border border-emerald-600/60 text-xs shrink-0 shadow-md animate-pulse">
              <div className="flex items-center gap-2">
                <img
                  src={activeCharmToPlace.imageUrl}
                  alt={activeCharmToPlace.name}
                  className="w-5 h-5 object-contain"
                />
                <span className="text-emerald-200 font-semibold truncate max-w-[200px]">
                  Click any empty hole to place &ldquo;{activeCharmToPlace.name}&rdquo;
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveCharmToPlace(null)}
                className="text-[10px] text-emerald-400 hover:text-white px-1.5 py-0.5 rounded bg-emerald-900/80 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Active Tool Content */}
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden touch-pan-y">
            {activeTab === 'shoe' ? (
              <ShoeColorTab
                size={size}
                color={color}
                onSelectSize={setSize}
                onSelectColor={setColor}
                onNavigateToCharms={() => setActiveTab('charms')}
              />
            ) : (
              <JibbitzDiscoveryDrawer
                selectedCharmId={activeCharmToPlace?.id}
                onSelectCharm={(charm) => setActiveCharmToPlace(charm)}
              />
            )}
          </div>
        </aside>

        {/* Right Preview Window (2D Interactive Shoe Canvas) */}
        <section
          aria-label="Interactive 2D Crocs preview canvas"
          className="flex-1 flex flex-col items-center justify-center relative w-full h-full overflow-hidden p-2 sm:p-4 bg-gradient-to-b from-[#041d15] to-[#02130e] min-h-0"
        >
          <ShoeCanvas
            size={size}
            color={color}
            placements={placements}
            occupiedHoleIds={occupiedHoleIds}
            selectedPlacementId={selectedPlacementId}
            onHoleClick={handleHoleClick}
            onCharmClick={handlePlacementClick}
            onRotateCharm={updateRotation}
            onCanvasClick={() => setSelectedPlacementId(null)}
          />
        </section>
      </main>
    </div>
  );
};

export default App;

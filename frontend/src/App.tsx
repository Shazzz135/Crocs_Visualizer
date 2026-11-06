import React, { useState } from 'react';
import { DEFAULT_CROC_COLORS, type HoleId, type JibbitzItem, type VentHole } from '@crocs/shared';
import { ShoeCanvas } from './components/canvas/ShoeCanvas.js';
import { ShoeColorTab } from './components/controls/ShoeColorTab.js';
import { JibbitzDiscoveryDrawer } from './components/discovery/JibbitzDiscoveryDrawer.js';
import { LegalDisclaimerModal } from './components/common/LegalDisclaimerModal.js';
import { useShoeCustomizer } from './hooks/useShoeCustomizer.js';
import { useMobileDrawerDrag } from './hooks/useMobileDrawerDrag.js';
import { CharmDragProvider } from './context/CharmDragProvider.js';

type CustomizerTab = 'shoe' | 'charms';

export const AppContent: React.FC = () => {
  const customizer = useShoeCustomizer();
  const size = customizer?.size ?? 'adult';
  const color = customizer?.color ?? DEFAULT_CROC_COLORS[0];
  const placements = customizer?.placements ?? [];
  const occupiedHoleIds = customizer?.occupiedHoleIds ?? new Set<string>();
  const activeCharmToPlace = customizer?.activeCharmToPlace ?? null;
  const selectedPlacementId = customizer?.selectedPlacementId ?? null;

  const {
    setSize,
    setColor,
    setActiveHole,
    setActiveCharmToPlace,
    setSelectedPlacementId,
    placeCharm,
    swapOrMoveCharm,
    removePlacementByHole,
    updateRotation,
    handlePlacementClick,
    findFirstAvailableHole,
    resetCustomizer,
  } = customizer ?? {};

  const [activeTab, setActiveTab] = useState<CustomizerTab>('charms');
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const {
    position: drawerPos,
    dragHeightPx,
    isDragging,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    toggleDrawer,
  } = useMobileDrawerDrag();

  const handleSelectCharm = (charm: JibbitzItem) => {
    const emptyHoleId = findFirstAvailableHole?.();
    if (emptyHoleId) placeCharm?.(charm, emptyHoleId);
    else setActiveCharmToPlace?.(charm);
  };

  const handleHoleClick = (hole: VentHole) => {
    setActiveHole?.(hole);
    if (activeCharmToPlace) placeCharm?.(activeCharmToPlace, hole.id);
  };

  const handleDropCharm = (charm: JibbitzItem, targetHoleId: HoleId, sourceHoleId?: HoleId | null, rotationDeg?: number) => {
    if (sourceHoleId) {
      if (sourceHoleId === targetHoleId) return;
      swapOrMoveCharm?.(sourceHoleId, targetHoleId);
    } else {
      placeCharm?.(charm, targetHoleId, rotationDeg);
    }
  };

  const mobileHeightStyle: React.CSSProperties =
    dragHeightPx !== null ? { height: `${dragHeightPx}px`, transition: 'none' } : {};

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
      <main className="flex-1 flex flex-col-reverse md:flex-row relative overflow-hidden w-full h-full">
        <aside
          aria-label="Customizer editing workspace"
          style={mobileHeightStyle}
          className={`w-full md:w-[420px] lg:w-[450px] border-t md:border-t-0 md:border-r border-emerald-900/60 bg-[#06241a]/95 p-3 sm:p-4 flex flex-col gap-2.5 backdrop-blur-md shrink-0 z-20 shadow-2xl transition-all duration-200 ${mobileHeightClass}`}
        >
          {/* Mobile Drag Handle */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={toggleDrawer}
            className="md:hidden flex flex-col items-center justify-center py-1 cursor-grab active:cursor-grabbing select-none shrink-0"
          >
            <div className={`w-12 h-1.5 rounded-full transition-colors ${isDragging ? 'bg-emerald-400' : 'bg-emerald-700/80'}`} />
            <span className="text-[10px] text-emerald-400/80 font-medium mt-0.5">
              {drawerPos === 'collapsed' ? 'Drag up for charms' : drawerPos === 'expanded' ? 'Drag down for shoe preview' : 'Drag up or down'}
            </span>
          </div>

          {/* Header Bar with Quick Reset and Size Indicator */}
          <div className="flex items-center justify-between pb-1.5 border-b border-emerald-900/60 shrink-0">
            <div>
              <h1 className="text-sm sm:text-base font-bold text-white tracking-wide">CROCS CUSTOMIZER</h1>
              <p className="text-[11px] text-emerald-400/80">Design your pair with authentic Jibbitz</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-700/60 rounded-full">
                {size}
              </span>
              <button
                type="button"
                onClick={() => resetCustomizer?.()}
                title="Quick Reset: Clear placed charms and reset canvas"
                className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 hover:text-white bg-emerald-950 hover:bg-red-950/80 border border-emerald-700/60 hover:border-red-500/60 rounded-full transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Mode Switcher */}
          <div
            role="tablist"
            aria-label="Customizer tool modes"
            className="grid grid-cols-2 gap-1.5 p-1 bg-[#02130e] rounded-xl border border-emerald-900/70 shrink-0"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'charms'}
              onClick={() => setActiveTab('charms')}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'charms' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-300/80 hover:text-white hover:bg-emerald-950/60'
              }`}
            >
              <span>Charms</span>
              {placements.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-400 text-emerald-950 text-[10px] font-bold flex items-center justify-center">
                  {placements.length}
                </span>
              )}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'shoe'}
              onClick={() => setActiveTab('shoe')}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'shoe' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-300/80 hover:text-white hover:bg-emerald-950/60'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full border border-white/40" style={{ backgroundColor: color.hex }} />
              <span>Shoe Color</span>
            </button>
          </div>

          {/* Active Placement Hint Banner */}
          {activeCharmToPlace && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950 border border-emerald-600/60 text-xs shrink-0 shadow-md">
              <div className="flex items-center gap-2">
                <img src={activeCharmToPlace.imageUrl} alt={activeCharmToPlace.name} className="w-5 h-5 object-contain" />
                <span className="text-emerald-200 font-semibold truncate max-w-[200px]">
                  Placed on empty hole &bull; Drag to move
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveCharmToPlace?.(null)}
                className="text-[10px] text-emerald-400 hover:text-white px-1.5 py-0.5 rounded bg-emerald-900/80 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Active Tool Content */}
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden touch-pan-y">
            {activeTab === 'shoe' ? (
              <ShoeColorTab
                size={size}
                color={color}
                onSelectSize={(s) => setSize?.(s)}
                onSelectColor={(c) => setColor?.(c)}
                onNavigateToCharms={() => setActiveTab('charms')}
              />
            ) : (
              <JibbitzDiscoveryDrawer selectedCharmId={activeCharmToPlace?.id} onSelectCharm={handleSelectCharm} />
            )}
          </div>

          {/* Footer Legal & Disclaimers Link */}
          <div className="pt-1.5 border-t border-emerald-900/60 flex items-center justify-between text-[10px] text-emerald-400/80 shrink-0">
            <span className="truncate">Independent visualizer &bull; In-store prototype</span>
            <button
              type="button"
              onClick={() => setIsLegalModalOpen(true)}
              className="text-emerald-300 hover:text-white underline cursor-pointer shrink-0 ml-2 font-medium"
            >
              Legal &amp; Disclaimers
            </button>
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
            onCharmClick={(instId) => handlePlacementClick?.(instId)}
            onRotateCharm={(instId, deg) => updateRotation?.(instId, deg)}
            onCanvasClick={() => setSelectedPlacementId?.(null)}
            onDropCharm={handleDropCharm}
            onRemoveCharm={(holeId) => removePlacementByHole?.(holeId)}
          />
        </section>
      </main>

      {/* Retail & Trademark Legal Disclaimer Modal */}
      <LegalDisclaimerModal isOpen={isLegalModalOpen} onClose={() => setIsLegalModalOpen(false)} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CharmDragProvider>
      <AppContent />
    </CharmDragProvider>
  );
};

export default App;

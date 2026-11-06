import React, { useState } from 'react';
import { DEFAULT_CROC_COLORS, type HoleId, type JibbitzItem, type VentHole } from '@crocs/shared';
import { ShoeCanvas } from './components/canvas/ShoeCanvas.js';
import { ShoeColorTab } from './components/controls/ShoeColorTab.js';
import { JibbitzDiscoveryDrawer } from './components/discovery/JibbitzDiscoveryDrawer.js';
import { LegalDisclaimerModal } from './components/common/LegalDisclaimerModal.js';
import { CustomizerHeader } from './components/common/CustomizerHeader.js';
import { CustomizerFooter } from './components/common/CustomizerFooter.js';
import { MobileDrawerHandle } from './components/common/MobileDrawerHandle.js';
import { useShoeCustomizer } from './hooks/useShoeCustomizer.js';
import { useMobileDrawerDrag } from './hooks/useMobileDrawerDrag.js';
import { CharmDragProvider } from './context/CharmDragProvider.js';
import { exportShoeCanvasToPng } from './utils/pngExport.js';

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
  const [isExporting, setIsExporting] = useState(false);

  const {
    position: drawerPos,
    drawerRef,
    isDragging,
    drawerClass,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleClick,
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

  const handleDropCharm = (
    charm: JibbitzItem,
    targetHoleId: HoleId,
    sourceHoleId?: HoleId | null,
    rotationDeg?: number
  ) => {
    if (sourceHoleId) {
      if (sourceHoleId === targetHoleId) return;
      swapOrMoveCharm?.(sourceHoleId, targetHoleId);
    } else {
      placeCharm?.(charm, targetHoleId, rotationDeg);
    }
  };

  const handleExportPng = async () => {
    try {
      setIsExporting(true);
      const leftSvg = document.querySelector<SVGSVGElement>('svg[data-shoe-side="left"]');
      const rightSvg = document.querySelector<SVGSVGElement>('svg[data-shoe-side="right"]');
      await exportShoeCanvasToPng({ size, color, placements, leftSvg, rightSvg });
    } catch (err) {
      console.error('Failed to export PNG snapshot:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-full overflow-hidden bg-[#031811] text-emerald-50 font-sans">
      <main className="flex-1 flex flex-col md:flex-row relative overflow-hidden w-full h-full">
        {/* Mobile bottom drawer & Desktop left sidebar */}
        <aside
          ref={drawerRef}
          aria-label="Customizer editing workspace"
          className={`w-full md:w-[420px] lg:w-[450px] border-t md:border-t-0 md:border-r border-emerald-900/60 bg-[#06241a]/95 p-3 sm:p-4 flex flex-col gap-2.5 backdrop-blur-md shrink-0 z-20 shadow-2xl transition-[height] duration-250 ease-out ${drawerClass}`}
        >
          <MobileDrawerHandle
            drawerPos={drawerPos}
            isDragging={isDragging}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onClick={handleClick}
          />

          <CustomizerHeader
            size={size}
            onReset={() => resetCustomizer?.()}
            onExportPng={handleExportPng}
            isExporting={isExporting}
          />

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

          <CustomizerFooter onOpenLegalModal={() => setIsLegalModalOpen(true)} />
        </aside>

        {/* Right Preview Window (2D Interactive Shoe Canvas) */}
        <section
          aria-label="Interactive 2D Crocs preview canvas"
          className={`flex-1 flex flex-col items-center justify-center relative w-full h-full overflow-hidden p-2 sm:p-4 bg-gradient-to-b from-[#041d15] to-[#02130e] min-h-0 md:pb-4 transition-[padding] duration-250 ease-out ${
            drawerPos === 'collapsed'
              ? 'pb-20'
              : drawerPos === 'expanded'
              ? 'pb-[90dvh]'
              : 'pb-[52dvh]'
          }`}
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

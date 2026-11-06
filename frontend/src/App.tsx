import React, { useState } from 'react';
import { ShoeCanvas } from './components/canvas/ShoeCanvas.js';
import { ShoeColorTab } from './components/controls/ShoeColorTab.js';
import { JibbitzDiscoveryDrawer } from './components/discovery/JibbitzDiscoveryDrawer.js';
import { useShoeCustomizer } from './hooks/useShoeCustomizer.js';

type CustomizerTab = 'shoe' | 'charms';

export const App: React.FC = () => {
  const { size, color, setSize, setColor, setActiveHole, activeHole } =
    useShoeCustomizer();

  const [activeTab, setActiveTab] = useState<CustomizerTab>('charms');
  const [isMobileExpanded, setIsMobileExpanded] = useState<boolean>(false);

  return (
    <div className="flex flex-col h-screen w-full max-w-full overflow-hidden bg-[#031811] text-emerald-50 font-sans">
      {/* Main Workspace Layout */}
      <main className="flex-1 flex flex-col-reverse md:flex-row relative overflow-hidden w-full h-full">
        {/* Left Editing Window (Desktop Side Panel / Mobile Bottom Sheet) */}
        <aside
          aria-label="Customizer editing workspace"
          className={`w-full md:w-[420px] lg:w-[450px] border-t md:border-t-0 md:border-r border-emerald-900/60 bg-[#06241a]/95 p-3 sm:p-4 flex flex-col gap-2.5 backdrop-blur-md shrink-0 z-20 shadow-2xl transition-all duration-300 ${
            isMobileExpanded
              ? 'h-[90dvh] fixed inset-x-0 bottom-0 md:relative md:h-full md:inset-auto'
              : 'h-[62dvh] md:h-full'
          }`}
        >
          {/* Mobile Drag / Height Toggle Handle (< 768px) */}
          <div className="md:hidden flex items-center justify-between -mt-1 pb-1">
            <button
              type="button"
              onClick={() => setIsMobileExpanded((prev) => !prev)}
              aria-label={isMobileExpanded ? 'Collapse panel' : 'Expand panel'}
              className="w-full flex flex-col items-center py-1 group cursor-pointer"
            >
              <div className="w-12 h-1 bg-emerald-800 rounded-full group-hover:bg-emerald-400 transition-colors" />
              <span className="text-[10px] text-emerald-400/80 mt-1 font-medium">
                {isMobileExpanded ? 'Tap to minimize' : 'Tap to expand full screen'}
              </span>
            </button>
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

          {/* Active Tool Content: Fills Entire Available Window Space */}
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
              <JibbitzDiscoveryDrawer />
            )}
          </div>
        </aside>

        {/* Right Preview Window (2D Interactive Shoe Canvas with Dark Green Depth) */}
        <section
          aria-label="Interactive 2D Crocs preview canvas"
          className="flex-1 flex flex-col items-center justify-center relative w-full h-full overflow-hidden p-2 sm:p-4 bg-gradient-to-b from-[#041d15] to-[#02130e] min-h-0"
        >
          <ShoeCanvas
            size={size}
            color={color}
            activeSnapHoleId={activeHole?.id}
            onHoleClick={(hole) => setActiveHole(hole)}
          />
        </section>
      </main>
    </div>
  );
};

export default App;

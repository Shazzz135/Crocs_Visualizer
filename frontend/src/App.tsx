import React, { useState } from 'react';
import { ShoeCanvas } from './components/canvas/ShoeCanvas.js';
import { ShoeColorTab } from './components/controls/ShoeColorTab.js';
import { JibbitzDiscoveryDrawer } from './components/discovery/JibbitzDiscoveryDrawer.js';
import { useShoeCustomizer } from './hooks/useShoeCustomizer.js';

type CustomizerTab = 'shoe' | 'charms';

export const App: React.FC = () => {
  const { size, color, setSize, setColor, setActiveHole, activeHole } =
    useShoeCustomizer();

  const [activeTab, setActiveTab] = useState<CustomizerTab>('shoe');
  const [isMobileExpanded, setIsMobileExpanded] = useState<boolean>(false);

  return (
    <div className="flex flex-col h-screen w-full max-w-full overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Main Workspace Layout */}
      <main className="flex-1 flex flex-col-reverse md:flex-row relative overflow-hidden w-full h-full">
        {/* Left Editing Window (Desktop Side Panel / Mobile Bottom Sheet) */}
        <aside
          aria-label="Customizer editing workspace"
          className={`w-full md:w-[420px] lg:w-[450px] border-t md:border-t-0 md:border-r border-slate-800 bg-slate-900/95 p-3.5 sm:p-4 md:p-5 flex flex-col gap-3 backdrop-blur-md shrink-0 z-20 transition-all duration-300 ${
            isMobileExpanded
              ? 'h-[85vh] fixed inset-x-0 bottom-0 md:relative md:h-full md:inset-auto'
              : 'h-[50vh] md:h-full'
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
              <div className="w-12 h-1 bg-slate-600 rounded-full group-hover:bg-emerald-400 transition-colors" />
              <span className="text-[10px] text-slate-400 mt-1 font-medium">
                {isMobileExpanded ? 'Tap to minimize' : 'Tap to expand full screen'}
              </span>
            </button>
          </div>

          {/* App Header with Crocs Brand Badge */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 shrink-0 rounded-lg bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-black text-emerald-400 text-sm shadow-sm shadow-emerald-500/20">
                CV
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                  Classic Crocs Visualizer
                </h1>
                <p className="text-xs text-emerald-400/90 font-medium">
                  {color.name} • {size.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs: Shoe & Color vs Jibbitz Charms */}
          <div
            role="tablist"
            aria-label="Customizer tool modes"
            className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800 shrink-0"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'shoe'}
              onClick={() => setActiveTab('shoe')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'shoe'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/25 ring-1 ring-emerald-400'
                  : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-850'
              }`}
            >
              <span className="text-sm">👟</span>
              <span>Shoe &amp; Color</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'charms'}
              onClick={() => setActiveTab('charms')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'charms'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/25 ring-1 ring-emerald-400'
                  : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-850'
              }`}
            >
              <span className="text-sm">✨</span>
              <span>Jibbitz™ Charms</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'charms'
                    ? 'bg-emerald-600/40 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                1,077
              </span>
            </button>
          </div>

          {/* Active Tool Content: Fills Entire Available Window Space */}
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
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

        {/* Right Preview Window (2D Interactive Shoe Canvas) */}
        <section
          aria-label="Interactive 2D Crocs preview canvas"
          className="flex-1 flex flex-col items-center justify-center relative w-full h-full overflow-hidden p-2 sm:p-4 bg-slate-950 min-h-0"
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

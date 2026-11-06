import React from 'react';
import { ShoeCanvas } from './components/canvas/ShoeCanvas.js';
import { ColorPalette } from './components/controls/ColorPalette.js';
import { SizeSelector } from './components/controls/SizeSelector.js';
import { JibbitzDiscoveryDrawer } from './components/discovery/JibbitzDiscoveryDrawer.js';
import { useShoeCustomizer } from './hooks/useShoeCustomizer.js';

export const App: React.FC = () => {
  const { size, color, setSize, setColor, setActiveHole, activeHole } =
    useShoeCustomizer();

  return (
    <div className="flex flex-col h-screen w-full max-w-full overflow-hidden bg-slate-950 text-slate-100">
      {/* Main Split Workspace: Editing Window on Left, Preview Window on Right */}
      <main className="flex-1 flex flex-col-reverse md:flex-row relative overflow-hidden w-full h-full">
        {/* Left Editing Window (Desktop Side Panel >= 768px / Mobile Controls < 768px) */}
        <aside
          aria-label="Customizer editing workspace"
          className="w-full md:w-96 border-t md:border-t-0 md:border-r border-slate-800 bg-slate-900/80 p-4 sm:p-5 flex flex-col gap-4 sm:gap-5 overflow-y-auto backdrop-blur-sm shrink-0 z-10"
        >
          {/* App Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 shrink-0 rounded-lg bg-sky-500/20 border border-sky-400 flex items-center justify-center font-bold text-sky-400 text-sm">
                CV
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                  Classic Crocs Visualizer
                </h1>
                <p className="text-xs text-slate-400">
                  {color.name} • {size.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Size Bracket Selector */}
          <SizeSelector selectedSize={size} onSelectSize={setSize} />

          {/* Colorway Swatches */}
          <ColorPalette selectedColorId={color.id} onSelectColor={setColor} />

          {/* Jibbitz Discovery Drawer & Semantic Search */}
          <JibbitzDiscoveryDrawer />
        </aside>

        {/* Right Pair Preview Window */}
        <section
          aria-label="Interactive 2D Crocs preview canvas"
          className="flex-1 flex flex-col items-center justify-center relative w-full h-full overflow-hidden p-1 sm:p-4 bg-slate-950 min-h-0"
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

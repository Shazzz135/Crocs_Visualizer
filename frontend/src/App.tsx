import React from 'react';
import { ShoeCanvas } from './components/canvas/ShoeCanvas.js';
import { ColorPalette } from './components/controls/ColorPalette.js';
import { SizeSelector } from './components/controls/SizeSelector.js';
import { useShoeCustomizer } from './hooks/useShoeCustomizer.js';

export const App: React.FC = () => {
  const { size, color, setSize, setColor, setActiveHole, activeHole } =
    useShoeCustomizer();

  return (
    <div className="flex flex-col h-screen w-full max-w-full overflow-hidden bg-slate-950 text-slate-100">
      {/* Main Split Workspace: Editing Window on Left, Preview Window on Right */}
      <main className="flex-1 flex flex-col-reverse lg:flex-row relative overflow-hidden w-full h-full">
        {/* Left Editing Window (Desktop Left Sidebar / Mobile Bottom Sheet) */}
        <aside
          aria-label="Customizer editing workspace"
          className="w-full lg:w-96 border-t lg:border-t-0 lg:border-r border-slate-800 bg-slate-900/80 p-4 sm:p-5 flex flex-col gap-5 sm:gap-6 overflow-y-auto backdrop-blur-sm shrink-0"
        >
          {/* App Title inside Editing Window */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
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

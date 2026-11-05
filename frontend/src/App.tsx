import React from 'react';
import { ShoeCanvas } from './components/canvas/ShoeCanvas.js';
import { ColorPalette } from './components/controls/ColorPalette.js';
import { SizeSelector } from './components/controls/SizeSelector.js';
import { InStoreBanner } from './components/disclaimer/InStoreBanner.js';
import { useShoeCustomizer } from './hooks/useShoeCustomizer.js';

export const App: React.FC = () => {
  const { size, color, setSize, setColor, setActiveHole, activeHole } =
    useShoeCustomizer();

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {/* Retail Testing Notice & Legal Disclaimers Banner */}
      <InStoreBanner />

      {/* Main App Bar */}
      <header className="px-6 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400 flex items-center justify-center font-bold text-sky-400 text-sm">
            CV
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white leading-none">
              Classic Crocs Visualizer
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5">
              2D Bird&apos;s-Eye Pair Customizer • 26 Authentic Vent Holes
            </p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Active: {color.name} ({size.toUpperCase()})
          </span>
          {activeHole && (
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-sky-300 border border-slate-700">
              Selected: {activeHole.id} ({activeHole.side})
            </span>
          )}
        </div>
      </header>

      {/* Main Interactive Canvas Area */}
      <main className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        {/* Pair View Canvas */}
        <section
          aria-label="Interactive 2D Crocs canvas"
          className="flex-1 flex flex-col items-center justify-center relative p-2 sm:p-6"
        >
          <ShoeCanvas
            size={size}
            color={color}
            activeSnapHoleId={activeHole?.id}
            onHoleClick={(hole) => setActiveHole(hole)}
          />

          <p className="text-xs text-slate-500 mt-2">
            Click any of the 26 vent holes to inspect socket coordinates
          </p>
        </section>

        {/* Desktop Controls Sidebar / Mobile Bottom Controls */}
        <aside
          aria-label="Customizer configuration controls"
          className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900/80 p-5 flex flex-col gap-6 backdrop-blur-sm"
        >
          {/* Size Bracket Selector */}
          <SizeSelector selectedSize={size} onSelectSize={setSize} />

          {/* Colorway Swatches */}
          <ColorPalette selectedColorId={color.id} onSelectColor={setColor} />

          {/* Quick Info Card */}
          <div className="mt-auto bg-slate-800/40 rounded-lg p-3 border border-slate-800/80 text-xs text-slate-400 flex flex-col gap-1">
            <span className="font-semibold text-slate-300">Footwear Anatomy:</span>
            <span>• 13 holes per shoe (3 toe, 4 mid, 4 vamp, 2 collar)</span>
            <span>• Size adjustments accurately warp aspect ratio (Infant is stubby/wide)</span>
            <span>• Jibbitz catalog & drag/drop placement arriving in upcoming milestone</span>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default App;

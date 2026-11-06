import React, { useEffect } from 'react';

interface LegalDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalDisclaimerModal: React.FC<LegalDisclaimerModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#06241a] border border-emerald-800/90 rounded-2xl p-5 sm:p-6 shadow-2xl text-emerald-100 flex flex-col gap-4 max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-900/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 id="disclaimer-modal-title" className="text-base font-bold text-white tracking-wide">
              Legal Notices & Retail Disclaimers
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close legal modal"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-900/60 transition-colors cursor-pointer text-lg"
          >
            &times;
          </button>
        </div>

        {/* Notice Sections */}
        <div className="flex flex-col gap-3.5 text-xs text-emerald-200/90 leading-relaxed">
          <section className="p-3 bg-[#02130e]/80 rounded-xl border border-emerald-900/60">
            <h3 className="text-emerald-300 font-semibold mb-1 text-xs uppercase tracking-wider">
              1. Non-Affiliation Statement
            </h3>
            <p>
              This interactive visualizer application is an independent conceptual prototype developed strictly for
              demonstration and design visualization purposes. It is not affiliated with, endorsed by, sponsored by, or
              in any way officially associated with Crocs, Inc. or any of its subsidiaries.
            </p>
          </section>

          <section className="p-3 bg-[#02130e]/80 rounded-xl border border-emerald-900/60">
            <h3 className="text-emerald-300 font-semibold mb-1 text-xs uppercase tracking-wider">
              2. Trademark & Intellectual Property
            </h3>
            <p>
              CROCS, JIBBITZ, and the Crocs crocodile logo are registered trademarks of Crocs, Inc. All other product
              names, logos, brands, and imagery featured or referred to within this application remain the property of
              their respective trademark holders.
            </p>
          </section>

          <section className="p-3 bg-[#02130e]/80 rounded-xl border border-emerald-900/60">
            <h3 className="text-emerald-300 font-semibold mb-1 text-xs uppercase tracking-wider">
              3. In-Store Retail & Inventory Disclaimer
            </h3>
            <p>
              All 2D digital simulations, colorways, Jibbitz charm dimensions, and vent hole configurations are approximate
              visual representations. Actual retail store charm inventory, physical socket grip, seasonal colors, and
              footwear sizing fit may vary by retail location.
            </p>
          </section>

          <section className="p-3 bg-[#02130e]/80 rounded-xl border border-emerald-900/60">
            <h3 className="text-emerald-300 font-semibold mb-1 text-xs uppercase tracking-wider">
              4. Zero-Account Local Storage
            </h3>
            <p>
              This application functions with zero account requirements. Your shoe customizations are saved exclusively
              within your local browser storage (<code className="text-emerald-300">localStorage</code>). No personal data,
              tracking identifiers, or design configurations are transmitted to remote servers.
            </p>
          </section>
        </div>

        {/* Footer Dismiss Button */}
        <div className="pt-2 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition-all cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

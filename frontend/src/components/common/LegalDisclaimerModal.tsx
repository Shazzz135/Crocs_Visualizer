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
      data-testid="legal-disclaimer-modal"
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
              Legal Notices &amp; Retail Disclaimers
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-testid="close-legal-modal-btn"
            aria-label="Close legal modal"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-900/60 transition-colors cursor-pointer text-lg"
          >
            &times;
          </button>
        </div>

        {/* Section 1: Non-Affiliation */}
        <section className="flex flex-col gap-1.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            1. Non-Affiliation Notice
          </h3>
          <p className="text-xs text-emerald-200/90 leading-relaxed">
            Crocs Visualizer is an independent fan-made preview tool and store concept prototype. It is
            not affiliated with, endorsed by, sponsored by, or officially associated with Crocs, Inc., or
            any of its subsidiaries or affiliates.
          </p>
        </section>

        {/* Section 2: Trademark Notice */}
        <section className="flex flex-col gap-1.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            2. Trademark Notice
          </h3>
          <p className="text-xs text-emerald-200/90 leading-relaxed">
            CROCS&reg;, the Crocs logo, and JIBBITZ&trade; are registered trademarks of Crocs, Inc. All shoe
            silhouettes, charms, and brand assets are the property of their respective trademark holders.
            Their appearance in this prototype is for non-commercial visual reference only.
          </p>
        </section>

        {/* Section 3: Retail Availability */}
        <section className="flex flex-col gap-1.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            3. In-Store Retail &amp; Inventory Disclaimer
          </h3>
          <p className="text-xs text-emerald-200/90 leading-relaxed">
            In-store retail inventory, colorway stocks, and physical Jibbitz charm availability vary by
            official Crocs retail store and partner locations. Digital preview representation does not
            guarantee physical in-store stock availability.
          </p>
        </section>

        {/* Section 4: Zero-Account Privacy Notice */}
        <section className="flex flex-col gap-1.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            4. Zero-Account Privacy Notice
          </h3>
          <p className="text-xs text-emerald-200/90 leading-relaxed">
            Your customizer session, placements, and color choices are saved locally in your browser
            storage only. No personal data, user accounts, or tracking cookies are collected or
            transmitted to any remote server.
          </p>
        </section>

        {/* Footer Close Button */}
        <div className="pt-3 border-t border-emerald-900/80 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer shadow-md"
          >
            I Understand &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};

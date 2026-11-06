import React from 'react';

interface CustomizerFooterProps {
  onOpenLegalModal: () => void;
}

export const CustomizerFooter: React.FC<CustomizerFooterProps> = ({
  onOpenLegalModal,
}) => {
  return (
    <footer
      data-testid="compact-footer"
      className="pt-1.5 border-t border-emerald-900/60 flex items-center justify-between text-[10px] text-emerald-400/80 shrink-0"
    >
      <div className="flex items-center gap-1.5 truncate">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 shrink-0" />
        <span className="truncate">
          Fan Visualizer &bull; Non-Affiliated &bull; Stock Varies
        </span>
      </div>

      <button
        type="button"
        onClick={onOpenLegalModal}
        data-testid="legal-disclaimers-trigger"
        className="text-emerald-300 hover:text-white underline cursor-pointer shrink-0 ml-2 font-medium transition-colors"
      >
        Legal &amp; Disclaimers
      </button>
    </footer>
  );
};

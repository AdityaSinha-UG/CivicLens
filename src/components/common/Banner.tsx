import React from 'react';
import { Info } from 'lucide-react';

export const DemoNoticeBanner: React.FC = () => {
  return (
    <div className="bg-[#FAF2E3] border border-[#D9A441]/40 rounded-xl p-3.5 mb-6 text-xs text-[#615E52] flex items-start gap-3 shadow-xs">
      <div className="p-1 rounded-md bg-[#D9A441]/20 text-[#8C6415] shrink-0 mt-0.5">
        <Info size={15} />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-[#292923] flex items-center gap-1.5">
          <span>Phase 1 UI Prototype • Deterministic Demo Mock Content</span>
          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] bg-[#D9A441] text-[#292923] font-bold">
            STAGE 1
          </span>
        </p>
        <p className="mt-1 leading-relaxed text-[#615E52]">
          All feed items below are clearly labeled deterministic mock records designed to test responsive layout, editorial cards, category filtering, and flashcards. Live news aggregation via <strong>SerpApi</strong> will be connected in Phase 2. No live incidents or news claims are fabricated.
        </p>
      </div>
    </div>
  );
};

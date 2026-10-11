import React from 'react';
import { Sparkles } from 'lucide-react';

export const DemoNoticeBanner: React.FC = () => {
  return (
    <div className="bg-white border-2 border-black rounded-3xl p-4 sm:p-5 mb-6 text-xs text-black/80 flex items-start gap-3.5 shadow-[0_6px_0_0_#121212]">
      <div className="p-2 rounded-2xl bg-[#FFF2E8] border-2 border-black text-[#FA541C] shrink-0 mt-0.5">
        <Sparkles size={16} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-['Syne'] font-extrabold text-sm text-black">
            Phase 1 Prototype • Curated Civic Dispatches
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-[#D4FF00] text-black font-black uppercase border border-black">
            STAGE 1
          </span>
        </div>
        <p className="mt-1 leading-relaxed text-black/75 font-medium">
          Feed records are deterministic mock records modeled on Pune municipal announcements to test the responsive layout, carousel, and flashcard deck. Real-time SerpApi integration is slated for Phase 2. No live incidents or news claims are fabricated.
        </p>
      </div>
    </div>
  );
};

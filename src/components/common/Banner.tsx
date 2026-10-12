import React from 'react';
import { Sparkles } from 'lucide-react';

export interface DemoNoticeBannerProps {
  isDemoMode?: boolean;
  statusMessage?: string;
}

export const DemoNoticeBanner: React.FC<DemoNoticeBannerProps> = ({
  isDemoMode = true,
  statusMessage,
}) => {
  return (
    <div className="bg-white dark:bg-[#231A0F] border-2 border-black dark:border-[#5A3A1A] rounded-3xl p-4 sm:p-5 mb-6 text-xs text-black/80 dark:text-[#F5EEE6]/75 flex items-start gap-3.5 shadow-[0_6px_0_0_#121212]">
      <div className="p-2 rounded-2xl bg-[#FFF2E8] dark:bg-[#3A2410] border-2 border-black dark:border-[#5A3A1A] text-[#FA541C] shrink-0 mt-0.5">
        <Sparkles size={16} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-['Syne'] font-extrabold text-sm text-black dark:text-[#F5EEE6]">
            {isDemoMode ? 'Curated Civic Dispatches • Demo Mode' : 'Hyperlocal Civic Radar • Live Feed'}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-[#D4FF00] text-black font-black uppercase border border-black">
            {isDemoMode ? 'DEMO' : 'LIVE'}
          </span>
        </div>
        <p className="mt-1 leading-relaxed text-black/75 dark:text-[#F5EEE6]/60 font-medium">
          {statusMessage ||
            (isDemoMode
              ? 'Feed records are deterministic mock records modeled on Pune municipal announcements to test the responsive layout, carousel, and flashcard deck. Set SERPAPI_API_KEY in .env for live local updates.'
              : 'Displaying authentic civic news aggregated via SerpApi Google News engine.')}
        </p>
      </div>
    </div>
  );
};

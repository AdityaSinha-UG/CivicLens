import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-[#FFF9F4] rounded-xl border border-[#E5D3C2] p-5 shadow-xs animate-pulse flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="w-24 h-5 rounded-full bg-[#E5D3C2]/60" />
              <div className="w-16 h-3 rounded bg-[#E5D3C2]/40" />
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-1 space-y-2">
                <div className="h-5 w-4/5 rounded bg-[#E5D3C2]/70" />
                <div className="h-4 w-full rounded bg-[#E5D3C2]/40" />
                <div className="h-4 w-3/4 rounded bg-[#E5D3C2]/40" />
              </div>
              <div className="w-20 h-20 rounded-lg bg-[#E5D3C2]/50 shrink-0" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E5D3C2]/60 flex justify-between items-center">
            <div className="w-32 h-4 rounded bg-[#E5D3C2]/50" />
            <div className="w-24 h-4 rounded bg-[#E5D3C2]/60" />
          </div>
        </div>
      ))}
    </div>
  );
};

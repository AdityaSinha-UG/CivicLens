import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white rounded-3xl border-2 border-black p-6 shadow-[0_8px_0_0_#121212] animate-pulse flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="w-28 h-6 rounded-full bg-black/10" />
              <div className="w-20 h-4 rounded-full bg-black/10" />
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-1 space-y-2.5">
                <div className="h-6 w-5/6 rounded-lg bg-black/15" />
                <div className="h-4 w-full rounded-md bg-black/10" />
                <div className="h-4 w-3/4 rounded-md bg-black/10" />
              </div>
              <div className="w-24 h-24 rounded-2xl bg-[#FFF2E8] border-2 border-black/20 shrink-0" />
            </div>
          </div>

          <div className="mt-5 pt-4 border-t-2 border-black/10 flex justify-between items-center">
            <div className="w-36 h-4 rounded-md bg-black/10" />
            <div className="w-28 h-4 rounded-md bg-black/15" />
          </div>
        </div>
      ))}
    </div>
  );
};

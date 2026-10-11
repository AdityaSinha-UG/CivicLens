import React from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';
import { Button } from '../common/Button';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'An unexpected error occurred while fetching civic news.',
  onRetry,
}) => {
  return (
    <div className="bg-white border-2 border-black rounded-3xl p-8 text-center my-6 shadow-[0_10px_0_0_#121212] max-w-xl mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-[#FEE2E2] border-2 border-black text-[#DC2626] flex items-center justify-center mx-auto mb-4 shadow-[0_3px_0_0_#121212]">
        <AlertTriangle size={26} />
      </div>

      <h3 className="font-['Syne'] text-xl font-extrabold text-black">
        Unable to Load Civic Reports
      </h3>

      <p className="text-xs sm:text-sm text-black/75 mt-2 leading-relaxed font-medium">
        {message}
      </p>

      <div className="mt-6 flex justify-center">
        <Button
          variant="primary"
          size="sm"
          onClick={onRetry}
          icon={<RotateCw size={14} />}
          className="bg-black text-[#D4FF00] hover:bg-[#DC2626] hover:text-white font-black uppercase text-xs tracking-wider"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};

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
    <div className="bg-[#FFF9F4] border border-[#E8B4AF] rounded-xl p-8 text-center my-6 shadow-xs max-w-xl mx-auto">
      <div className="w-12 h-12 rounded-full bg-[#FCEBE9] text-[#9A2E22] flex items-center justify-center mx-auto mb-3">
        <AlertTriangle size={24} />
      </div>

      <h3 className="font-serif text-lg font-bold text-[#292923]">
        Unable to Load Civic Reports
      </h3>

      <p className="text-xs sm:text-sm text-[#615E52] mt-2 leading-relaxed">
        {message}
      </p>

      <div className="mt-5 flex justify-center">
        <Button
          variant="primary"
          size="sm"
          onClick={onRetry}
          icon={<RotateCw size={14} />}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};

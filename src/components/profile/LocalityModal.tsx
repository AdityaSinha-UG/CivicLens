import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface LocalityModalProps {
  isOpen: boolean;
  currentLocality: string;
  onClose: () => void;
  onSelectLocality: (locality: string) => void;
}

const COMMON_LOCALITIES = [
  'Pune',
  'Shivajinagar (Pune)',
  'Kothrud (Pune)',
  'Hinjawadi (Pune)',
  'Viman Nagar (Pune)',
  'Hadapsar (Pune)',
  'Baner (Pune)',
  'Pimpri-Chinchwad',
];

export const LocalityModal: React.FC<LocalityModalProps> = ({
  isOpen,
  currentLocality,
  onClose,
  onSelectLocality,
}) => {
  const [customLocality, setCustomLocality] = useState(currentLocality);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLocality.trim()) {
      onSelectLocality(customLocality.trim());
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Your Locality"
      subtitle="Hyperlocal civic discovery is filtered by your active neighbourhood"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#292923] mb-1">
            Custom Locality / Ward
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customLocality}
              onChange={(e) => setCustomLocality(e.target.value)}
              placeholder="e.g. Pune, Kothrud"
              className="flex-1 px-3 py-2 rounded-lg border border-[#E5D3C2] bg-white text-sm text-[#292923] focus:outline-none focus:ring-2 focus:ring-[#315B48]"
            />
            <Button type="submit" variant="primary" size="sm">
              Apply
            </Button>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-bold text-[#615E52] uppercase tracking-wider block mb-2">
            Suggested Neighbourhoods
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {COMMON_LOCALITIES.map((loc) => {
              const isSelected = currentLocality.toLowerCase() === loc.toLowerCase();
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    onSelectLocality(loc);
                    onClose();
                  }}
                  className={`text-left px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#315B48] text-white border-[#315B48]'
                      : 'bg-[#FFF9F4] text-[#292923] border-[#E5D3C2] hover:bg-[#F6EDE4]'
                  }`}
                >
                  <span className="truncate">{loc}</span>
                  {isSelected && <Check size={12} className="shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </form>
    </Modal>
  );
};

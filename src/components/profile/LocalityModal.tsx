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
          <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
            Custom Locality / Ward
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customLocality}
              onChange={(e) => setCustomLocality(e.target.value)}
              placeholder="e.g. Pune, Kothrud"
              className="flex-1 px-3.5 py-2.5 rounded-2xl border-2 border-black bg-white text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
            <Button type="submit" variant="primary" size="sm" className="bg-black text-[#D4FF00] font-black uppercase">
              Apply
            </Button>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-black text-black/70 uppercase tracking-widest block mb-2">
            Suggested Neighbourhoods
          </span>
          <div className="grid grid-cols-2 gap-2">
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
                  className={`text-left px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-black text-[#D4FF00] border-black shadow-[0_2px_0_0_#121212]'
                      : 'bg-white text-black border-black/20 hover:border-black hover:bg-[#FFF2E8]'
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

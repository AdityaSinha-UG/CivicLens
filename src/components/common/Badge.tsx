import React from 'react';
import { CivicCategory } from '../../types/news';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'category' | 'source' | 'demo' | 'highlight' | 'neutral';
  category?: CivicCategory;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  category,
  className = '',
}) => {
  let colorStyles = 'bg-[#F5EAE0] text-[#615E52] border-[#E5D3C2]';

  if (variant === 'demo') {
    colorStyles = 'bg-[#FAF2E3] text-[#8C6415] border-[#D9A441]/40 font-semibold';
  } else if (variant === 'source') {
    colorStyles = 'bg-[#E8F0EC] text-[#315B48] border-[#315B48]/30 font-medium';
  } else if (variant === 'highlight') {
    colorStyles = 'bg-[#D9A441]/15 text-[#8C6415] border-[#D9A441]/40 font-semibold';
  } else if (variant === 'category' && category) {
    switch (category) {
      case 'Politics/Government':
        colorStyles = 'bg-[#EAE4DC] text-[#4A473D] border-[#CBB4A0]';
        break;
      case 'Infrastructure/Roads':
        colorStyles = 'bg-[#F2E8DC] text-[#784D2B] border-[#D8BC9D]';
        break;
      case 'Utilities':
        colorStyles = 'bg-[#E5EEF3] text-[#2C526A] border-[#B7D2E2]';
        break;
      case 'Disasters/Emergencies':
        colorStyles = 'bg-[#FCEBE9] text-[#9A2E22] border-[#E8B4AF] font-semibold';
        break;
      case 'Traffic/Transport':
        colorStyles = 'bg-[#E8F0EC] text-[#285741] border-[#B6D4C5]';
        break;
      case 'Public Safety':
        colorStyles = 'bg-[#EBE9F5] text-[#46387E] border-[#C7C0E4]';
        break;
      case 'Community/Other':
        colorStyles = 'bg-[#F6EFE6] text-[#635547] border-[#DFCFBE]';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border tracking-tight ${colorStyles} ${className}`}
    >
      {children}
    </span>
  );
};

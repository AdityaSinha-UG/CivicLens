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
  let colorStyles = 'bg-white text-black border-black';

  if (variant === 'demo') {
    colorStyles = 'bg-[#FFF2E8] text-[#FA541C] border-black font-black uppercase text-[10px] tracking-wider';
  } else if (variant === 'source') {
    colorStyles = 'bg-black text-[#D4FF00] border-black font-black uppercase text-[10px]';
  } else if (variant === 'highlight') {
    colorStyles = 'bg-[#D4FF00] text-black border-black font-black uppercase text-[10px]';
  } else if (variant === 'category' && category) {
    switch (category) {
      case 'Politics/Government':
        colorStyles = 'bg-[#EEF2FF] text-[#3730A3] border-black';
        break;
      case 'Infrastructure/Roads':
        colorStyles = 'bg-[#FEF3C7] text-[#92400E] border-black';
        break;
      case 'Utilities':
        colorStyles = 'bg-[#E0F2FE] text-[#0369A1] border-black';
        break;
      case 'Disasters/Emergencies':
        colorStyles = 'bg-[#FEE2E2] text-[#B91C1C] border-black font-black';
        break;
      case 'Traffic/Transport':
        colorStyles = 'bg-[#DCFCE7] text-[#15803D] border-black';
        break;
      case 'Public Safety':
        colorStyles = 'bg-[#F3E8FF] text-[#6B21A8] border-black';
        break;
      case 'Community/Other':
        colorStyles = 'bg-[#FFF7ED] text-[#C2410C] border-black';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black tracking-tight border-2 shadow-[0_2px_0_0_#121212] ${colorStyles} ${className}`}
    >
      {children}
    </span>
  );
};

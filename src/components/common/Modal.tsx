import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  let widthClass = 'max-w-md';
  if (maxWidth === 'sm') widthClass = 'max-w-sm';
  if (maxWidth === 'lg') widthClass = 'max-w-lg';
  if (maxWidth === 'xl') widthClass = 'max-w-xl';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[2px] transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={`w-full ${widthClass} bg-[#FFF9F4] rounded-xl border border-[#E5D3C2] shadow-xl overflow-hidden transition-all`}
      >
        <div className="flex items-start justify-between p-5 border-b border-[#E5D3C2] bg-[#F8EFE5]">
          <div>
            <h3 id="modal-title" className="font-serif text-lg font-bold text-[#292923]">
              {title}
            </h3>
            {subtitle && <p className="text-xs text-[#615E52] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#615E52] hover:text-[#292923] hover:bg-[#E5D3C2]/50 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

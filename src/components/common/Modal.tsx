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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={`w-full ${widthClass} max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] flex flex-col bg-white dark:bg-[#231A0F] rounded-3xl border-2 border-black dark:border-[#5A3A1A] shadow-[0_16px_0_0_#121212] overflow-hidden transition-all`}
      >
        <div className="shrink-0 flex items-start justify-between p-4 sm:p-6 border-b-2 border-black dark:border-[#5A3A1A] bg-[#FFF2E8] dark:bg-[#2E1F0D]">
          <div className="pr-2">
            <h3 id="modal-title" className="font-['Syne'] text-lg sm:text-xl font-black text-black dark:text-[#F5EEE6] leading-tight">
              {title}
            </h3>
            {subtitle && <p className="text-xs text-black/70 dark:text-[#F5EEE6]/60 font-semibold mt-0.5 leading-snug">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white dark:bg-[#3A2410] border border-black dark:border-[#5A3A1A] hover:bg-black dark:hover:bg-[#FA541C] hover:text-white dark:hover:text-black text-black dark:text-[#F5EEE6] transition-colors cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

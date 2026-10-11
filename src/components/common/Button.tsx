import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315B48] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBE5D6] disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-lg cursor-pointer';

  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles = 'bg-[#315B48] hover:bg-[#244637] text-white shadow-sm active:bg-[#1C362A]';
      break;
    case 'secondary':
      variantStyles = 'bg-[#D9A441] hover:bg-[#C59132] text-[#292923] font-semibold shadow-sm active:bg-[#B38025]';
      break;
    case 'outline':
      variantStyles = 'border border-[#E5D3C2] bg-[#FFF9F4] hover:bg-[#F6EDE4] text-[#292923] active:bg-[#EFE1D4]';
      break;
    case 'ghost':
      variantStyles = 'bg-transparent hover:bg-[#315B48]/10 text-[#292923] active:bg-[#315B48]/15';
      break;
    case 'danger':
      variantStyles = 'bg-[#A7382B] hover:bg-[#8F2F23] text-white shadow-sm';
      break;
  }

  let sizeStyles = '';
  switch (size) {
    case 'sm':
      sizeStyles = 'px-3 py-1.5 text-xs gap-1.5';
      break;
    case 'md':
      sizeStyles = 'px-4 py-2 text-sm gap-2';
      break;
    case 'lg':
      sizeStyles = 'px-5 py-2.5 text-base gap-2.5';
      break;
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};

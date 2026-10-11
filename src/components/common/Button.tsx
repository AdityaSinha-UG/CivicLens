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
    'inline-flex items-center justify-center font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-2xl cursor-pointer active:translate-y-[1px]';

  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles = 'bg-black hover:bg-[#1E1E1E] text-white border-2 border-black shadow-[0_4px_0_0_#121212]';
      break;
    case 'secondary':
      variantStyles = 'bg-[#D4FF00] hover:bg-white text-black border-2 border-black shadow-[0_4px_0_0_#121212] font-black';
      break;
    case 'outline':
      variantStyles = 'border-2 border-black bg-white hover:bg-black hover:text-white text-black shadow-[0_3px_0_0_#121212]';
      break;
    case 'ghost':
      variantStyles = 'bg-transparent hover:bg-black/10 text-black border-2 border-transparent';
      break;
    case 'danger':
      variantStyles = 'bg-[#DC2626] hover:bg-[#B91C1C] text-white border-2 border-black shadow-[0_3px_0_0_#121212]';
      break;
  }

  let sizeStyles = '';
  switch (size) {
    case 'sm':
      sizeStyles = 'px-3.5 py-1.5 text-xs gap-1.5';
      break;
    case 'md':
      sizeStyles = 'px-4.5 py-2.5 text-sm gap-2';
      break;
    case 'lg':
      sizeStyles = 'px-6 py-3 text-base gap-2.5';
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

import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'neutral' | 'neutral-grey' | 'outline';
  size?: 'small' | 'medium' | 'large';
  iconOnly?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  iconOnly = false,
  onClick,
  disabled = false,
  className = ''
}: ButtonProps) {
  const baseClasses = 'btn-base';
  
  const sizeClasses = {
    small: iconOnly ? 'btn-icon-small' : 'btn-small',
    medium: iconOnly ? 'btn-icon-medium' : 'btn-medium',
    large: iconOnly ? 'btn-icon-large' : 'btn-large'
  };

  const variantClasses = {
    primary: 'btn-primary',
    neutral: 'btn-neutral',
    'neutral-grey': 'btn-neutral-grey',
    outline: 'btn-outline'
  };

  const disabledClass = disabled ? 'btn-disabled' : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClass} ${className}`;

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    onClick?.(e);
  };

  return (
    <button 
      className={classes}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
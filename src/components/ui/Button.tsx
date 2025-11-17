import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] text-white hover:from-[#560BAD] hover:to-[#7209B7] shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-[#1A1A2E] text-white border-2 border-purple-500/30 hover:border-purple-400 hover:bg-[#16213E]',
    outline: 'bg-transparent text-white border-2 border-white/20 hover:border-white/40 hover:bg-white/5',
    ghost: 'bg-transparent text-gray-300 hover:text-white hover:bg-white/5'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

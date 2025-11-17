import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`
        bg-gradient-to-br from-[#1A1A2E] to-[#16213E]
        rounded-2xl border border-purple-500/20
        p-8
        ${hover ? 'hover:border-purple-400/60 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

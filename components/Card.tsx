
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white dark:bg-brand-charcoal border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export default Card;

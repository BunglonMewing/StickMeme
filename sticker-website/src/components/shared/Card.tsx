import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black ${className}`}>
      {children}
    </div>
  );
};

export default Card;

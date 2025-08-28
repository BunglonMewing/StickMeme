import React from 'react';

interface AvatarProps {
  src: string | null | undefined;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-24 w-24',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden flex-shrink-0`}>
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full"></div> // Placeholder for no image
      )}
    </div>
  );
};

export default Avatar;

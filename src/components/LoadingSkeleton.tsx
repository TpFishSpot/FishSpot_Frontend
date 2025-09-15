import { memo } from 'react';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'image' | 'button';
  lines?: number;
}

export const LoadingSkeleton = memo(({ 
  className = '', 
  variant = 'card', 
  lines = 3 
}: LoadingSkeletonProps) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';

  switch (variant) {
    case 'text':
      return (
        <div className={className}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={`${baseClasses} h-4 mb-2 ${
                i === lines - 1 ? 'w-3/4' : 'w-full'
              }`}
            />
          ))}
        </div>
      );

    case 'image':
      return <div className={`${baseClasses} ${className}`} />;

    case 'button':
      return <div className={`${baseClasses} h-10 w-24 ${className}`} />;

    case 'card':
    default:
      return (
        <div className={`p-4 ${className}`}>
          <div className={`${baseClasses} h-48 mb-4`} />
          <div className={`${baseClasses} h-6 mb-2`} />
          <div className={`${baseClasses} h-4 w-3/4 mb-2`} />
          <div className={`${baseClasses} h-4 w-1/2`} />
        </div>
      );
  }
});
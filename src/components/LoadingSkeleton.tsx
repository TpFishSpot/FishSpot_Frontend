import { memo } from 'react';
import { SpotCardSkeleton } from './ui/SpotCardSkeleton';
import { Skeleton } from './ui/Skeleton';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'image' | 'button' | 'spots';
  lines?: number;
  count?: number;
}

export const LoadingSkeleton = memo(({ 
  className = '', 
  variant = 'card', 
  lines = 3,
  count = 1
}: LoadingSkeletonProps) => {

  switch (variant) {
    case 'spots':
      return (
        <div className={`space-y-6 ${className}`}>
          {Array.from({ length: count }).map((_, i) => (
            <SpotCardSkeleton key={i} />
          ))}
        </div>
      );

    case 'text':
      return (
        <div className={className}>
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
              key={i}
              variant="text"
              className={`mb-2 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
            />
          ))}
        </div>
      );

    case 'image':
      return <Skeleton variant="rectangular" className={className} />;

    case 'button':
      return <Skeleton variant="rectangular" height={40} width={96} className={className} />;

    case 'card':
    default:
      return (
        <div className={`p-4 ${className}`}>
          <Skeleton variant="rectangular" height={192} className="mb-4" />
          <Skeleton variant="text" height={24} className="mb-2" />
          <Skeleton variant="text" className="w-3/4 mb-2" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      );
  }
});
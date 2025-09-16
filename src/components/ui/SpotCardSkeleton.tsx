import { Skeleton } from './Skeleton';

export const SpotCardSkeleton = () => {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" className="w-32" />
        <Skeleton variant="circular" width={40} height={40} />
      </div>
      
      <div className="space-y-2">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
      
      <div className="flex gap-2">
        <Skeleton variant="rectangular" className="w-16 h-6 rounded-full" />
        <Skeleton variant="rectangular" className="w-20 h-6 rounded-full" />
      </div>
      
      <div className="flex justify-between items-center pt-2">
        <Skeleton variant="text" className="w-24" />
        <div className="flex gap-2">
          <Skeleton variant="rectangular" width={32} height={32} className="rounded-lg" />
          <Skeleton variant="rectangular" width={32} height={32} className="rounded-lg" />
        </div>
      </div>
    </div>
  );
};
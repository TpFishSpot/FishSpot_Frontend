import { useState, useCallback, useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import { useHapticFeedback } from '../../hooks/ui/useHapticFeedback';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
}

export const PullToRefresh = ({ onRefresh, children, threshold = 100 }: PullToRefreshProps) => {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const { triggerImpactHaptic } = useHapticFeedback();

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (window.scrollY > 0 || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY.current;

    if (distance > 0) {
      setIsPulling(true);
      setPullDistance(Math.min(distance, threshold * 1.5));
      
      if (distance >= threshold && !isRefreshing) {
        triggerImpactHaptic();
      }
    }
  }, [threshold, isRefreshing, triggerImpactHaptic]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      triggerImpactHaptic();
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setIsPulling(false);
    setPullDistance(0);
  }, [pullDistance, threshold, isRefreshing, onRefresh, triggerImpactHaptic]);

  const progress = Math.min(pullDistance / threshold, 1);
  const shouldTrigger = progress >= 1;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {(isPulling || isRefreshing) && (
        <div 
          className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center bg-background/90 backdrop-blur-sm transition-all duration-200"
          style={{ 
            height: `${Math.max(pullDistance * 0.5, 40)}px`,
            transform: `translateY(-${Math.max(pullDistance * 0.5, 40)}px)`
          }}
        >
          <div className={`flex items-center space-x-2 ${shouldTrigger ? 'text-primary' : 'text-muted-foreground'}`}>
            <RotateCcw 
              className={`w-5 h-5 transition-transform duration-200 ${
                isRefreshing ? 'animate-spin' : shouldTrigger ? 'rotate-180' : ''
              }`}
            />
            <span className="text-sm font-medium">
              {isRefreshing ? 'Actualizando...' : shouldTrigger ? 'Suelta para actualizar' : 'Desliza para actualizar'}
            </span>
          </div>
        </div>
      )}
      
      <div 
        className="transition-transform duration-200"
        style={{ 
          transform: `translateY(${isPulling ? pullDistance * 0.3 : 0}px)` 
        }}
      >
        {children}
      </div>
    </div>
  );
};
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useIOSSwipeBack = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone ||
                         document.referrer.includes('android-app://');
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (!isStandalone || !isIOS) {
      return;
    }

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const edgeThreshold = 30;
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = Math.abs(touchEndY - touchStartY);
      
      const isRightSwipe = deltaX > swipeThreshold;
      const isFromLeftEdge = touchStartX < edgeThreshold;
      const isHorizontalSwipe = deltaY < swipeThreshold;
      
      if (isRightSwipe && isFromLeftEdge && isHorizontalSwipe) {
        if (window.history.length > 1) {
          navigate(-1);
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [navigate, location]);
};

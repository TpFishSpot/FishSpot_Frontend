import { useCallback } from 'react';

export const useHapticFeedback = () => {
  const triggerHaptic = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: 50,
        medium: 100,
        heavy: 200
      };
      navigator.vibrate(patterns[intensity]);
    }
  }, []);

  const triggerSelectionHaptic = useCallback(() => triggerHaptic('light'), [triggerHaptic]);
  const triggerImpactHaptic = useCallback(() => triggerHaptic('medium'), [triggerHaptic]);
  const triggerNotificationHaptic = useCallback(() => triggerHaptic('heavy'), [triggerHaptic]);

  return {
    triggerHaptic,
    triggerSelectionHaptic,
    triggerImpactHaptic,
    triggerNotificationHaptic
  };
};
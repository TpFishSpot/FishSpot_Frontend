import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'fishspot_has_seen_onboarding_v1';
const ONBOARDING_EVENT = 'fishspot_open_onboarding';

export const useOnboarding = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen onboarding
    try {
      const hasSeen = localStorage.getItem(STORAGE_KEY);
      if (!hasSeen) {
        // Small delay to let the app and map finish loading smoothly
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    } catch {
      // In case localStorage is disabled/restricted
    }
  }, []);

  useEffect(() => {
    // Listen for external trigger events (e.g. from navbar or menu)
    const handleOpen = () => setIsOpen(true);
    window.addEventListener(ONBOARDING_EVENT, handleOpen);
    return () => window.removeEventListener(ONBOARDING_EVENT, handleOpen);
  }, []);

  const closeOnboarding = useCallback((dontShowAgain = true) => {
    setIsOpen(false);
    if (dontShowAgain) {
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch {
        // Ignore localStorage errors
      }
    }
  }, []);

  const openOnboarding = useCallback(() => {
    setIsOpen(true);
  }, []);

  const resetOnboarding = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    setIsOpen(true);
  }, []);

  return {
    isOpen,
    openOnboarding,
    closeOnboarding,
    resetOnboarding,
  };
};

export const triggerOpenOnboarding = () => {
  window.dispatchEvent(new CustomEvent(ONBOARDING_EVENT));
};

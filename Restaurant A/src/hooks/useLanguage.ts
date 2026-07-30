import { useState, useEffect, useCallback } from 'react';

export type Language = 'fi' | 'en';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('fi');
  const [lastInteraction, setLastInteraction] = useState(Date.now());

  const updateInteraction = useCallback(() => {
    setLastInteraction(Date.now());
  }, []);

  const switchLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    updateInteraction();
  }, [updateInteraction]);

  // Auto-reset to Finnish after 1 minute of inactivity
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastInteraction = now - lastInteraction;
      
      // If more than 1 minute (60000ms) has passed and not already Finnish
      if (timeSinceLastInteraction > 60000 && language !== 'fi') {
        setLanguage('fi');
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [lastInteraction, language]);

  // Track user interactions to reset the timer
  useEffect(() => {
    const handleInteraction = () => {
      updateInteraction();
    };

    // Listen for various user interactions
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    document.addEventListener('scroll', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
    };
  }, [updateInteraction]);

  return {
    language,
    switchLanguage,
    updateInteraction
  };
};
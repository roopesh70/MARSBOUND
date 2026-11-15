import { useState, useEffect } from 'react';

export interface MobileDetectionState {
  isTouchDevice: boolean;
  isMobile: boolean;
  isPortrait: boolean;
  screenWidth: number;
  screenHeight: number;
}

export function useMobileDetection(): MobileDetectionState {
  const [state, setState] = useState<MobileDetectionState>(() => {
    if (typeof window === 'undefined') {
      return {
        isTouchDevice: false,
        isMobile: false,
        isPortrait: false,
        screenWidth: 1920,
        screenHeight: 1080
      };
    }

    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = isTouch || width < 1024;
    const isPortrait = height > width;

    return {
      isTouchDevice: isTouch,
      isMobile,
      isPortrait,
      screenWidth: width,
      screenHeight: height
    };
  });

  useEffect(() => {
    const checkState = () => {
      const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = isTouch || width < 1024;
      const isPortrait = height > width;

      setState({
        isTouchDevice: isTouch,
        isMobile,
        isPortrait,
        screenWidth: width,
        screenHeight: height
      });
    };

    window.addEventListener('resize', checkState);
    window.addEventListener('orientationchange', checkState);

    return () => {
      window.removeEventListener('resize', checkState);
      window.removeEventListener('orientationchange', checkState);
    };
  }, []);

  return state;
}

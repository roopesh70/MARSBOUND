import { useState, useEffect } from 'react';

export interface MobileDetectionState {
  isTouchDevice: boolean;
  isMobile: boolean;
  isPortrait: boolean;
  screenWidth: number;
  screenHeight: number;
}

function detectMobileState(): MobileDetectionState {
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
  const ua = navigator.userAgent || '';
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
  const isSmallScreen = Math.min(width, height) < 768;
  const isMobile = isTouch && (isMobileUA || isSmallScreen);

  let isPortrait = height > width;
  if (window.screen?.orientation?.type) {
    isPortrait = window.screen.orientation.type.includes('portrait');
  }

  return {
    isTouchDevice: isTouch,
    isMobile,
    isPortrait,
    screenWidth: width,
    screenHeight: height
  };
}

export function useMobileDetection(): MobileDetectionState {
  const [state, setState] = useState<MobileDetectionState>(detectMobileState);

  useEffect(() => {
    const checkState = () => {
      setState(detectMobileState());
    };

    window.addEventListener('resize', checkState);
    window.addEventListener('orientationchange', checkState);

    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener('change', checkState);
    }

    return () => {
      window.removeEventListener('resize', checkState);
      window.removeEventListener('orientationchange', checkState);
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener('change', checkState);
      }
    };
  }, []);

  return state;
}

import { useState, useEffect } from 'react';

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    windowWidth: number | null;
    windowHeight: number | null;
  }>({ windowWidth: null, windowHeight: null });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      function handleResize() {
        setWindowSize({
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight
        });
      }
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  return windowSize;
}

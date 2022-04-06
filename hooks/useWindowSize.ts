import { useEffect, useState } from 'react';

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    windowWidth: number | null;
    windowHeight: number | null;
  }>({ windowWidth: null, windowHeight: null });

  function handleResize() {
    setWindowSize({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    });
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  return windowSize;
}

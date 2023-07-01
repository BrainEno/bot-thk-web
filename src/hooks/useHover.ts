import { useEffect, useState } from 'react';

type ElRef = React.RefObject<HTMLElement>;

const useHover = (elRef: ElRef) => {
  const [hovered, setHovered] = useState(false);

  const enterHandler = () => setHovered(true);
  const leaveHandler = () => setHovered(false);

  useEffect(() => {
    const el = elRef.current;
    if (el && typeof window !== 'undefined') {
      el.addEventListener('mouseenter', enterHandler);
      el.addEventListener('mouseleave', leaveHandler);
      return () => {
        el.removeEventListener('mouseenter', enterHandler);
        el.removeEventListener('mouseleave', leaveHandler);
      };
    }
  }, [hovered, elRef]);

  return hovered;
};

export default useHover;

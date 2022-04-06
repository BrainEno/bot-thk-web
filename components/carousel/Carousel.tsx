import { useCallback, useEffect, useRef, useState } from 'react';
import { LeftOutlined,RightOutlined } from '@ant-design/icons';

import { ICarouselItem } from '../../types';

import { CarouselItem } from './CarouselItem';

const items: ICarouselItem[] = [
  {
    src: '/images/recent.jpg',
    title: 'Reacent Post',
    link: '/categories/recent-post',
    width: 2048,
    height: 1701
  },
  {
    src: '/images/featured.png',
    title: 'Featured',
    link: '/categories/featured',
    width: 1920,
    height: 1657
  },
  {
    src: '/images/trending.png',
    title: 'Trending',
    link: '/categories/trending',
    width: 1920,
    height: 1299
  }
];

const CarouselComponent = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = useCallback(() => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  }, [animating, activeIndex]);

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex: number) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const cycleInterval = useRef<null | NodeJS.Timer>(null);

  const clear = useCallback(() => {
    clearInterval(cycleInterval.current!);
  }, []);

  const set = useCallback(() => {
    clear();

    cycleInterval.current = setInterval(() => {
      next();
    }, 5000);
  }, [clear, next]);

  useEffect(() => {
    animating && set();
    return () => {
      clear();
    };
  }, [activeIndex, animating, set, clear]);

  return (
    <div className="carousel">
      <LeftOutlined onClick={previous} size={100} />
      <CarouselItem
        item={items[activeIndex]}
        items={items}
        goToIndex={goToIndex}
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
      />
      <RightOutlined onClick={next} size={100} />
    </div>
  );
};

export default CarouselComponent;

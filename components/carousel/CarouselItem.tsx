import Image from 'next/image';
import Link from 'next/link';

import useWindowSize from '../../hooks/useWindowSize';
import { ICarouselItem } from '../../types';

interface ICarouselItemProps {
  item: ICarouselItem;
  items: ICarouselItem[];
  goToIndex: (nextIndex: number) => void;
  onExiting?: () => void;
  onExited?: () => void;
}

export const CarouselItem: React.FC<ICarouselItemProps> = ({
  item,
  items,
  goToIndex
}) => {
  const { windowWidth } = useWindowSize();

  return (
    <>
      <Link href={item.link} passHref>
        <div
          style={{
            height: windowWidth! > 900 ? '600px' : '300px',
            width: '100%',
            position: 'relative'
          }}
          className="carousel-item"
        >
          <h1>{item.title}</h1>
          <ol className="indiactors-container">
            {items.map((_, index: number) => (
              <li
                className="carousel-indicators"
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  goToIndex(index);
                }}
              ></li>
            ))}
          </ol>
          {windowWidth && (
            <Image
              src={item.src}
              priority={true}
              loading="eager"
              alt="banner"
              layout="fill"
              objectFit="cover"
              objectPosition="50% 50%"
              className="slider-image"
            />
          )}
        </div>
      </Link>
    </>
  );
};

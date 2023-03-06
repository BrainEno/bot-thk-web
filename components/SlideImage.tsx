import Image from 'next/image';

import useWindowSize from '../hooks/useWindowSize';

const SlideImage = ({ imgSrc, alt }: { imgSrc: string; alt?: string }) => {
  const { windowWidth } = useWindowSize();

  return (
    <div
      className="banner-container"
      style={{
        height: windowWidth! > 900 ? '500px' : '300px',
        width: '100%',
        position: 'relative'
      }}
    >
      {windowWidth && (
        <Image
          className="banner-img"
          priority={true}
          src={imgSrc}
          layout="fill"
          alt={alt || 'banner'}
          objectFit="cover"
          objectPosition="50% 50%"
          quality={windowWidth! > 900 ? 75 : 45}
        />
      )}
    </div>
  );
};

export default SlideImage;

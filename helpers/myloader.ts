import { ImageLoader, ImageLoaderProps } from 'next/image';

const myLoader: ImageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

export default myLoader;

import { ImageLoader, ImageLoaderProps } from 'next/image';

const myLoader: ImageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  return `${process.env.NEXT_PUBLIC_API}${src}?w=${width}&q=${quality || 75}`;
};

export default myLoader;

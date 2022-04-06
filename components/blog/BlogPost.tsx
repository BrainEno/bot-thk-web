import React from 'react';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';

import myLoader from '../../helpers/myloader';
import useWindowSize from '../../hooks/useWindowSize';
import { IBlogWithStyle } from '../../types';

import { TagRow } from './index';

interface IBlogPostProps {
  post: IBlogWithStyle;
  tagsOnTop: boolean;
}

const BlogPost: React.FC<IBlogPostProps> = ({ post, tagsOnTop }) => {
  const { windowWidth } = useWindowSize();
  const style = windowWidth! > 900 ? { ...post.style } : {};

  return (
    <Link href="/blogs/[id]" as={`/blogs/${post._id}`} passHref>
      <div className="post overlay" style={style}>
        <Image
          src={`/blog/image/${post._id}`}
          layout="fill"
          objectFit="cover"
          alt="post image"
          loader={myLoader}
        />
        <div
          className="image-text"
          style={{
            justifyContent: tagsOnTop ? 'space-between' : 'flex-end'
          }}
        >
          <TagRow tags={post.tags} />
          <div>
            <h2 className="image-title">{post.title}</h2>
            <span className="image-date">
              {dayjs(post.createdAt, 'MMM,DD,YYYY', 'zh', true).format(
                'MMMM,DD,YYYY'
              )}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogPost;

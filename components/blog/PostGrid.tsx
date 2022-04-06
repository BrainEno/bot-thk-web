import React, { useMemo, useRef, useState } from 'react';

import { IBlog } from '../../types';
import { Pagination } from '../Common/Pagination';

import PostCard from './PostCard';

const PostGrid = ({ posts }: { posts: IBlog[] }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pageSize, setPageSize] = useState(9);
  const [current, setCurrent] = useState(1);

  const firstPostRef = useRef<null | HTMLDivElement>(null);
  let postRefPos;

  const paginatedPosts = useMemo(() => {
    const lastIndex = pageSize * current;
    const firstIndex = lastIndex - pageSize;

    return posts.slice(firstIndex, lastIndex);
  }, [current, pageSize, posts]);

  const handleSilder = () => {
    postRefPos = firstPostRef.current!.offsetTop;

    if (typeof window !== 'undefined') {
      window.scroll({
        top: postRefPos,
        left: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="grid-pagination-container">
      <section className="post-grid" ref={firstPostRef}>
        {paginatedPosts.map((post, index) => (
          <PostCard post={post} key={index} id={post._id} />
        ))}
      </section>
      <Pagination
        pageSize={pageSize}
        total={posts.length}
        defaultCurrent={current}
        onChange={(page: number) => {
          handleSilder();
          setCurrent(page);
        }}
      />
    </section>
  );
};

export default PostGrid;

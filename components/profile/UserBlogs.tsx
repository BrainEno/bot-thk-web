import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';

import { IBlog, IUser } from '../../types';
import AddBtn from '../Common/AddBtn';
import { Pagination } from '../Common/Pagination';
import MyBrand from '../MyBrand';

interface IUserBlogsProps {
  blogs: IBlog[];
  user: IUser;
}
const UserBlogs: React.FC<IUserBlogsProps> = ({ blogs, user }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pageSize, setPageSize] = useState(6);
  const [current, setCurrent] = useState(1);

  const paginatedBlogs = useMemo(() => {
    const lastIndex = pageSize * current;
    const firstIndex = lastIndex - pageSize;

    return blogs.slice(firstIndex, lastIndex);
  }, [current, pageSize, blogs]);

  return (
    <div className="dashboard-right-container">
      <div className="header-container">
        <div className="brand-container">
          <MyBrand width={45} height={45} />
        </div>
        <div className="info-container">
          <h2>{user.name}</h2>
          {blogs.length > 0 ? (
            <h5 className="userInfo-text">
              在 BOT THK 一共发布了 {blogs.length} 篇文章
            </h5>
          ) : (
            <h5 className="userInfo-text">还没有在 BOT THK 发布过文章</h5>
          )}
        </div>

        <AddBtn
          href={
            user && user.role === 1 ? '/admin/crud/blog' : '/user/crud/blog'
          }
          size={60}
        />
      </div>

      <div className="blog-card-container">
        {blogs.length > 0
          ? paginatedBlogs.map((b, i) => (
              <a
                key={i}
                href={
                  user && user.role === 1
                    ? `/admin/crud/${b._id}`
                    : `/user/crud/${b._id}`
                }
              >
                <div className="blog-card">
                  <h5>{b.title}</h5>
                  <span className="desc-text">
                    By: {user.name} | {dayjs(b.createdAt).format('MMM,DD-YYYY')}
                  </span>
                  <div>
                    <p>{b.description.replace(/<[^>]+>/g, '')}</p>
                  </div>
                </div>
              </a>
            ))
          : ''}
      </div>
      <Pagination
        pageSize={pageSize}
        total={blogs.length}
        defaultCurrent={current}
        onChange={setCurrent}
      />
    </div>
  );
};

export default UserBlogs;

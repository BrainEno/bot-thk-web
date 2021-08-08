import React, { useState, useMemo } from 'react'
import dayjs from 'dayjs'
import { Pagination } from 'antd'
import 'antd/dist/antd.css'
import MyBrand from '../MyBrand'
import { IBlog, IUser } from '../../types'

interface IUserBlogsProps {
    blogs: IBlog[]
    user: IUser
}
const UserBlogs: React.FC<IUserBlogsProps> = ({ blogs, user }) => {
    const [pageSize, setPageSize] = useState(6)
    const [current, setCurrent] = useState(1)

    const paginatedBlogs = useMemo(() => {
        const lastIndex = pageSize * current
        const firstIndex = lastIndex - pageSize

        return blogs.slice(firstIndex, lastIndex)
    }, [current, pageSize, blogs])

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
                        <h5 className="userInfo-text">
                            还没有在 BOT THK 发布过文章
                        </h5>
                    )}
                </div>
                <div className="btn-contaienr">
                    <h1>
                        <a
                            href={
                                user && user.role === 1
                                    ? '/admin/crud/blog'
                                    : '/user/crud/blog'
                            }
                        >
                            +
                        </a>
                    </h1>
                </div>
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
                                      By: {user.name} |{' '}
                                      {dayjs(b.createdAt).format('MMM,DD-YYYY')}
                                  </span>
                                  <div>
                                      <p>
                                          {b.description.replace(
                                              /<[^>]+>/g,
                                              ''
                                          )}
                                      </p>
                                  </div>
                              </div>
                          </a>
                      ))
                    : ''}
            </div>
            <div className="pagination-container">
                <Pagination
                    simple
                    showSizeChanger
                    onShowSizeChange={setPageSize}
                    pageSize={pageSize}
                    total={blogs.length}
                    defaultCurrent={current}
                    onChange={setCurrent}
                />
            </div>
        </div>
    )
}

export default UserBlogs

import React, { useMemo, useState } from 'react'

import { CurrentUserQuery, GetUserBlogsQuery } from '../../gql/sdk'
import AddBtn from '../Common/AddBtn'
import { Pagination } from '../Common/Pagination'
import MyBrand from '../MyBrand'

import { UserBlogCard } from './UserBlogCard'

const pageSize = 6

interface IUserBlogsProps {
    blogs: GetUserBlogsQuery['getUserBlogs']
    user: CurrentUserQuery['currentUser']
}
const UserBlogs: React.FC<IUserBlogsProps> = ({ blogs, user }) => {
    const [current, setCurrent] = useState(1)
    const [selectedId, setSelectedId] = useState('')

    const paginatedBlogs = useMemo(() => {
        const lastIndex = pageSize * current
        const firstIndex = lastIndex - pageSize

        return blogs?.slice(firstIndex, lastIndex)
    }, [current, blogs])

    return (
        <div className="dashboard-right-container">
            <div className="header-container">
                <div className="brand-container">
                    <MyBrand width={45} height={45} />
                </div>
                <div className="info-container">
                    <h2>{user?.name}</h2>
                    {blogs && blogs?.length > 0 ? (
                        <h5 className="userInfo-text">
                            在 BOT THK 一共发布了 {blogs.length} 篇文章
                        </h5>
                    ) : (
                        <h5 className="userInfo-text">
                            还没有在 BOT THK 发布过文章
                        </h5>
                    )}
                </div>

                <AddBtn
                    href={
                        user && user.role === '1'
                            ? '/admin/crud/blog'
                            : '/user/crud/blog'
                    }
                    size={60}
                />
            </div>

            <div className="blog-card-container">
                {blogs && blogs?.length
                    ? paginatedBlogs.map((b) => (
                          //   <a
                          //       key={i}
                          //       href={
                          //           user && user.role === '1'
                          //               ? `/admin/crud/${b._id}`
                          //               : `/user/crud/${b._id}`
                          //       }
                          //   >
                          //   </a>
                          <UserBlogCard
                              setSelectedId={setSelectedId}
                              isSelected={b._id === selectedId}
                              key={b._id}
                              username={user?.name || 'unkwnown'}
                              blog={b}
                          />
                      ))
                    : ''}
            </div>

            <Pagination
                pageSize={pageSize}
                total={blogs?.length ?? 0}
                defaultCurrent={current}
                onChange={setCurrent}
            />
        </div>
    )
}

export default UserBlogs

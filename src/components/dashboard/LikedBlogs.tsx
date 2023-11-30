import React, { useMemo, useState } from 'react'
import { GetUserLikedBlogsQuery } from '../../generated/graphql-request'
import { UserBlogCard } from './UserBlogCard'
import { Pagination } from '../common/Pagination'
import MyBrand from '../common/MyBrand'

interface LikedBlogsProps {
    blogs: GetUserLikedBlogsQuery['getUserLikedBlogs']
    username: string
}

const PAGE_SIZE = 9

const LikedBlogs = ({ blogs, username }: LikedBlogsProps) => {
    const [current, setCurrent] = useState(1)

    const paginatedBlogs = useMemo(() => {
        const lastIndex = PAGE_SIZE * current
        const firstIndex = lastIndex - PAGE_SIZE

        return blogs ? blogs.slice(firstIndex, lastIndex) : []
    }, [current, blogs])

    return (
        <div className="dashboard-right-container">
            <div className="header-container">
                <div className="brand-container">
                    <MyBrand width={45} height={45} />
                </div>
                <div className="info-container">
                    <h2>{username}</h2>
                    {blogs && blogs?.length > 0 ? (
                        <h5 className="userInfo-text">
                            您一共收藏了 {blogs.length} 篇文章
                        </h5>
                    ) : (
                        <h5 className="userInfo-text">还没有收藏文章</h5>
                    )}
                </div>
            </div>
            <div className="blog-card-container">
                {paginatedBlogs.map((b) => (
                    <UserBlogCard
                        key={b.slug}
                        username={b.author.name}
                        blog={b}
                        type="LIKED"
                    />
                ))}
            </div>
            <Pagination
                pageSize={PAGE_SIZE}
                total={blogs?.length ?? 0}
                defaultCurrent={current}
                onChange={setCurrent}
            />
        </div>
    )
}

export default LikedBlogs

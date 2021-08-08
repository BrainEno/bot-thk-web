import { Pagination } from 'antd'
import React, { useState, useMemo, useRef } from 'react'
import 'antd/dist/antd.css'
import PostCard from './PostCard'
import { IBlog } from '../../types'

const PostGrid = ({ posts }: { posts: IBlog[] }) => {
    const [pageSize, setPageSize] = useState(9)
    const [current, setCurrent] = useState(1)

    const firstPostRef = useRef<null | HTMLDivElement>(null)
    let postRefPos

    const paginatedPosts = useMemo(() => {
        const lastIndex = pageSize * current
        const firstIndex = lastIndex - pageSize

        return posts.slice(firstIndex, lastIndex)
    }, [current, pageSize, posts])

    const handleSilder = () => {
        postRefPos = firstPostRef.current!.offsetTop

        if (typeof window !== 'undefined') {
            window.scroll({
                top: postRefPos,
                left: 0,
                behavior: 'smooth',
            })
        }
    }

    return (
        <section className="grid-pagination-container">
            <section className="post-grid" ref={firstPostRef}>
                {paginatedPosts.map((post, index) => (
                    <PostCard post={post} key={index} id={post._id} />
                ))}
            </section>
            <div className="pagination-container">
                <Pagination
                    simple
                    showSizeChanger
                    pageSize={pageSize}
                    onShowSizeChange={setPageSize}
                    total={posts.length}
                    defaultCurrent={1}
                    onChange={(page: number) => {
                        handleSilder()
                        setCurrent(page)
                    }}
                />
            </div>
        </section>
    )
}

export default PostGrid

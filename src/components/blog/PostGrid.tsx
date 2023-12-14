import React, { memo, useCallback, useMemo, useRef, useState } from 'react'

import { PopulatedCardBlog } from '../../generated/graphql-request'
import { Pagination } from '../common/Pagination'

import PostWithInfo from './PostWithInfo'

const pageSize = 9

const PostGrid = ({ posts }: { posts: PopulatedCardBlog[] }) => {
    const [current, setCurrent] = useState(1)

    const firstPostRef = useRef<null | HTMLDivElement>(null)

    const paginatedPosts = useMemo(() => {
        const lastIndex = pageSize * current
        const firstIndex = lastIndex - pageSize

        return posts.slice(firstIndex, lastIndex)
    }, [current, posts])

    const handleSilder = useCallback(() => {
        if (firstPostRef.current) {
            const postPos = firstPostRef.current.offsetTop
            if (typeof window !== 'undefined') {
                window.scroll({
                    top: postPos,
                    left: 0,
                    behavior: 'smooth',
                })
            }
        }
    }, [])

    return (
        <section className="grid-pagination-container">
            <section className="post-grid" ref={firstPostRef}>
                {paginatedPosts.map((post) => (
                    <PostWithInfo post={post} key={post._id} />
                ))}
            </section>
            <Pagination
                pageSize={pageSize}
                total={posts.length}
                defaultCurrent={current}
                onChange={(page: number) => {
                    handleSilder()
                    setCurrent(page)
                }}
            />
        </section>
    )
}

export default memo(PostGrid)

import React from 'react'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'

import useWindowSize from '../../hooks/useWindowSize'
import { IBlogWithStyle } from '../../types'

import { TagRow } from './index'

interface IBlogPostProps {
    post: IBlogWithStyle
    tagsOnTop: boolean
}

const PostCard: React.FC<IBlogPostProps> = ({ post, tagsOnTop }) => {
    const { windowWidth } = useWindowSize()
    const style = windowWidth! > 900 ? { ...post.style } : {}

    return (
        <Link href="/blogs/[slug]" as={`/blogs/${post.slug}`}>
            <div className="post skeleton" style={style}>
                <Image
                    src={post.imageUri!}
                    fill
                    style={{
                        objectFit: 'cover',
                    }}
                    alt="post image"
                />
                <div
                    className="image-text"
                    style={{
                        justifyContent: tagsOnTop
                            ? 'space-between'
                            : 'flex-end',
                    }}
                >
                    <TagRow tags={post.tags} />
                    <div>
                        <h2 className="image-title">{post.title}</h2>
                        <span className="image-date">
                            {dayjs(
                                post.createdAt,
                                'MMM,DD,YYYY',
                                'zh',
                                true
                            ).format('MMMM,DD,YYYY')}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default PostCard

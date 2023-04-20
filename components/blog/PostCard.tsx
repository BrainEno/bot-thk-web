import React, { useMemo } from 'react'
import classNames from 'classnames'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'

import { IBlog } from '../../types'

import { TagRow } from './index'
import { ImgUseFor } from './PostMasonry'

interface PostCardProps {
    post: IBlog
    tagsOnTop: boolean
    index?: number
    imgFor?: ImgUseFor
}

const PostCard: React.FC<PostCardProps> = ({
    post,
    tagsOnTop,
    imgFor,
    index,
}) => {
    const IsExtraCls = imgFor && index !== undefined
    const extraClassName = useMemo(() => `${imgFor}_${index}`, [imgFor, index])

    return (
        <Link
            href="/blogs/[slug]"
            as={`/blogs/${post.slug}`}
            className={classNames('post skeleton overlay', {
                [extraClassName]: IsExtraCls,
            })}
        >
            <Image
                src={post.imageUri!}
                fill
                style={{
                    objectFit: 'cover',
                }}
                priority
                alt="post image"
            />
            <div
                className="image-text"
                style={{
                    justifyContent: tagsOnTop ? 'space-between' : 'flex-end',
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
        </Link>
    )
}

export default PostCard

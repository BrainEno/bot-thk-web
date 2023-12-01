import React, { memo, useMemo } from 'react'
import classNames from 'classnames'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'

import { TagRow } from './index'
import { ImgUseFor } from './PostMasonry'
import { PopulatedCardBlog } from '../../generated/graphql-request'

interface PostCardProps {
    post: Omit<PopulatedCardBlog, '_id' | 'author' | 'description'>
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
            href={{
                pathname: '/blogs/[slug]',
                query: { slug: post.slug },
            }}
            className={classNames('post skeleton overlay', {
                [extraClassName]: IsExtraCls,
            })}
        >
            <Image
                src={post.imageUri!}
                sizes="(max-width:900px) 400px,
                1350px"
                fill
                style={{
                    objectFit: 'cover',
                }}
                alt="post image"
            />
            <div
                className="image-text"
                style={{
                    justifyContent: tagsOnTop ? 'space-between' : 'flex-end',
                }}
            >
                <TagRow tags={post.tags || []} />
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

export default memo(PostCard)

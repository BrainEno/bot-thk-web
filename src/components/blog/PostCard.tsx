import React, { memo, useMemo } from 'react'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'

import { PopulatedCardBlog } from '../../generated/graphql-request'
import { getLocaleFormatedTime } from '../../helpers/date'

import { TagRow } from './index'
import { ImgUseFor } from './PostMasonry'

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
    const { i18n } = useTranslation('common')
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
                        {getLocaleFormatedTime(post.createdAt, i18n.language)}
                    </span>
                </div>
            </div>
        </Link>
    )
}

export default memo(PostCard)

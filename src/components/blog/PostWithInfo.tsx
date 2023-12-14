import React, { memo } from 'react'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import Link from 'next/link'

import { PopulatedCardBlog } from '../../generated/graphql-request'
import { getLocaleFormatedTime } from '../../helpers/date'

import { TagRow } from './index'

interface IPostCardProps {
    post: PopulatedCardBlog
}

const PostWithInfo: React.FC<IPostCardProps> = ({ post }) => {
    const { t, i18n } = useTranslation('common')

    return (
        <div className="post-container" id={post._id}>
            <Link
                href={{
                    pathname: '/blogs/[slug]',
                    query: { slug: post.slug },
                }}
            >
                <div className="post-img-wrapper skeleton">
                    <Image
                        src={post.imageUri!}
                        alt={post.slug}
                        sizes="(max-width: 900px) 305px,
                               350px"
                        fill
                        style={{
                            objectFit: 'cover',
                        }}
                        loading="lazy"
                        className="post-img"
                        quality={70}
                        crossOrigin="anonymous"
                    />
                </div>
            </Link>
            <TagRow tags={post.tags} />
            <section>
                <p className="post-title">{post.title}</p>
                <div className="author-text">
                    <span style={{ marginRight: 3.5 }}>{`${t('By')}:`}</span>
                    <Link href={`/profile/${post.author.username}`}>
                        {post.author.name}
                    </Link>
                    <span>
                        {' - '}
                        {getLocaleFormatedTime(post.createdAt, i18n.language)}
                    </span>
                </div>
                <div className="description-text">
                    {post.description?.replace(/<[^>]+>/g, '')}
                </div>
            </section>
            <p className="author-text">
                <Link
                    href={{
                        pathname: '/blogs/[slug]',
                        query: { slug: post.slug },
                    }}
                >
                    {`${t('Read More')}...`}
                </Link>
            </p>
        </div>
    )
}

export default memo(PostWithInfo)

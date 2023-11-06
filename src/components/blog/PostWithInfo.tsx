import React, { memo, useMemo } from 'react'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'

import useWindowSize from '../../hooks/useWindowSize'
import { IBlog } from '../../types'

import { TagRow } from './index'

interface IPostCardProps {
    post: IBlog
}

const PostWithInfo: React.FC<IPostCardProps> = ({ post }) => {
    const { windowWidth } = useWindowSize()
    const isDesktop = useMemo(
        () => windowWidth && windowWidth > 900,
        [windowWidth]
    )

    return (
        <div className="post-container" id={post._id}>
            {!isDesktop &&
            post.imageUri === process.env.NEXT_PUBLIC_DEFULT_IMAGE ? null : (
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
                        />
                    </div>
                </Link>
            )}
            <TagRow tags={post.tags} />
            <section>
                <p className="post-title">{post.title}</p>
                <div className="author-text">
                    <span> By: </span>
                    <Link href={post.author.profile!}>
                        {' ' + post.author.name + '  '}
                    </Link>
                    <span>
                        {' - '}
                        {dayjs(
                            post.createdAt,
                            'MMM,DD,YYYY',
                            'zh',
                            true
                        ).format('MMMM,DD,YYYY')}
                    </span>
                </div>
                <div className="description-text">
                    {post.description.replace(/<[^>]+>/g, '')}
                </div>
            </section>
            <p className="author-text">
                <Link
                    href={{
                        pathname: '/blogs/[slug]',
                        query: { slug: post.slug },
                    }}
                >
                    Read More...
                </Link>
            </p>
        </div>
    )
}

export default memo(PostWithInfo)

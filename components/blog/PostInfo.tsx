import React from 'react'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'

import { IBlog } from '../../types'

import { TagRow } from './index'

interface IPostCardProps {
    post: IBlog
}

const PostInfo: React.FC<IPostCardProps> = ({ post }) => {
    return (
        <div className="post-container">
            <Link href={`/blogs/${post.slug}`}>
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
            <TagRow tags={post.tags} />
            <section>
                <p className="post-title">{post.title}</p>
                <p className="author-text">
                    <span>
                        By:
                        <Link href={post.author.profile!} passHref>
                            {' ' + post.author.name + '  '}
                        </Link>
                    </span>
                    <span>
                        -
                        {dayjs(
                            post.createdAt,
                            'MMM,DD,YYYY',
                            'zh',
                            true
                        ).format('MMMM,DD,YYYY')}
                    </span>
                </p>
                <div className="description-text">
                    {post.description.replace(/<[^>]+>/g, '')}
                </div>
            </section>
            <p className="author-text">
                <Link href={`/blogs/${post.slug}`}>Read More...</Link>
            </p>
        </div>
    )
}

export default PostInfo

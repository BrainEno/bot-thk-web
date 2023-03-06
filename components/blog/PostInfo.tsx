import React from 'react'
import dayjs from 'dayjs'
import Link from 'next/link'

import useWindowSize from '../../hooks/useWindowSize'
import { IBlog } from '../../types'

import { TagRow } from './index'
import PostImg from './PostImg'

interface IPostCardProps {
    post: IBlog
}

const PostInfo: React.FC<IPostCardProps> = ({ post}) => {
    const { windowWidth } = useWindowSize()

    return (
        <div className="post-container">
            <Link href={`/blogs/${post.slug}`} passHref>
                <a>
                    <PostImg
                        width={windowWidth! > 900 ? '350px' : '305px'}
                        height={windowWidth! > 900 ? '350px' : '300px'}
                        src={post.imageUri!}
                        radius={5}
                    />
                </a>
            </Link>
            <TagRow tags={post.tags} />
            <section>
                <h2>{post.title}</h2>
                <p className="author-text">
                    <span>
                        By:
                        <Link href={post.author.profile!} passHref>
                            <a href="">{' ' + post.author.name + '  '}</a>
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
                <Link href={`/blogs/${post.slug}`} passHref>
                    <a>Read More...</a>
                </Link>
            </p>
        </div>
    )
}

export default PostInfo

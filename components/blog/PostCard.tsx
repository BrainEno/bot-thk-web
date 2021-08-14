import React from 'react'
import PostImg from './PostImg'
import dayjs from 'dayjs'
import { TagRow } from './index'
import Link from 'next/link'
import useWindowSize from '../../hooks/useWindowSize'
import { IBlog } from '../../types'

interface IPostCardProps {
    post: IBlog
    id: string
}

const PostCard: React.FC<IPostCardProps> = ({ post, id }) => {
    const { windowWidth } = useWindowSize()

    return (
        <div className="post-container" id={id}>
            <figure>
                <a href={`/blogs/${post._id}`}>
                    <PostImg
                        width={windowWidth! > 900 ? '350px' : '305px'}
                        height={windowWidth! > 900 ? '350px' : '300px'}
                        src={`/blog/image/${post._id}`}
                        radius={5}
                    />
                </a>
            </figure>
            <TagRow tags={post.tags} />
            <section>
                <h2>{post.title}</h2>
                <p className="author-text">
                    <span>
                        By:
                        <Link href={post.author.profile!}>
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
                <Link href={`/blogs/${post._id}`}>Read More...</Link>
            </p>
        </div>
    )
}

export default PostCard

import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'

import { PopulatedCardBlog } from '../../generated/graphql-request'
import { DEFAULT_IMAGE } from '../../pages/search'
import { DEFAULT_AVATAR } from '../dashboard/FollowInfoList'

interface BlogCardProps {
    blog: PopulatedCardBlog
}

const BlogCard = ({ blog }: BlogCardProps) => {
    return (
        <div className="blog-card">
            <div>
                <div className="card-info">
                    <Image
                        className="card-avatar"
                        src={blog?.author?.photo || DEFAULT_AVATAR}
                        alt="avatar"
                        width={24}
                        height={24}
                    />
                    <p className="card-author">{blog.author.name} · </p>
                    <span className="card-date">
                        {dayjs(blog.createdAt).format('MMM, DD,YYYY')}
                    </span>
                </div>
                <Link href={`/blogs/${blog.slug}`} className="card-title">
                    {blog.title}
                </Link>
                <p className="card-decription">{blog.description}</p>
                <div className="tag-row">
                    {blog.tags.map((t) => (
                        <Link
                            className="tag"
                            href={`/tags/${t.slug}`}
                            key={t.slug}
                        >
                            {t.name}
                        </Link>
                    ))}
                </div>
            </div>
            <Link href={`blogs/${blog.slug}`}>
                <Image
                    className="card-image"
                    src={blog.imageUri || DEFAULT_IMAGE}
                    width={112}
                    height={112}
                    alt="blog-image"
                    style={{ objectFit: 'cover' }}
                />
            </Link>
        </div>
    )
}

export default BlogCard

import React from 'react'
import { FiDelete, FiEdit } from 'react-icons/fi'
import { RxReader } from 'react-icons/rx'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { GetUserBlogsQuery } from '../../generated/graphql-request'

interface UserBlogCardProps {
    setSelectedId: (id: string) => void
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    username: string
    blog: GetUserBlogsQuery['getUserBlogs'][0]
}

export const UserBlogCard = ({
    username,
    blog,
    setSelectedId,
    setShowModal,
}: UserBlogCardProps) => {
    const router = useRouter()

    const handleEdit = (id: string) => {
        setSelectedId(id)
        router.push(`/dashboard/edit/${id}`)
    }

    const handleDeleteClick = (id: string) => () => {
        setSelectedId(id)
        setShowModal(true)
    }

    const handleRead = (slug: string) => () => {
        router.push(`/blogs/${slug}`)
    }

    return (
        <div className="blog-card">
            <Link href={`/blogs/${blog.slug}`} className="blog-title">
                <h5>{blog.title}</h5>
            </Link>
            <span className="desc-text">
                By: {username} | {dayjs(blog.createdAt).format('MMM,DD-YYYY')}
            </span>
            <div>
                <p>{(blog.description as string).replace(/<[^>]+>/g, '')}</p>
            </div>

            <div className="blog-icon-container">
                <FiEdit onClick={() => handleEdit(blog._id)} title="编辑" />
                <FiDelete onClick={handleDeleteClick(blog._id)} title="删除" />
                <RxReader onClick={handleRead(blog.slug)} title="查看" />
            </div>
        </div>
    )
}

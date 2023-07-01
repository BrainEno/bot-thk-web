import React from 'react'
import { FiDelete, FiEdit } from 'react-icons/fi'
import { RxReader } from 'react-icons/rx'
import dayjs from 'dayjs'
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
            <h5>{blog.title}</h5>
            <span className="desc-text">
                By: {username} | {dayjs(blog.createdAt).format('MMM,DD-YYYY')}
            </span>
            <div>
                <p>{(blog.description as string).replace(/<[^>]+>/g, '')}</p>
            </div>

            <div className="blog-icon-container">
                <FiEdit onClick={() => handleEdit(blog._id)} />
                <FiDelete onClick={handleDeleteClick(blog._id)} />
                <RxReader onClick={handleRead(blog.slug)} />
            </div>
        </div>
    )
}

import React from 'react'
import { FiDelete, FiEdit } from 'react-icons/fi'
import { RxReader } from 'react-icons/rx'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'

import { GetUserBlogsQuery } from '../../gqlSDK/sdk'

interface UserBlogCardProps {
    isSelected: boolean
    setSelectedId: (id: string) => void
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    username: string
    blog: GetUserBlogsQuery['getUserBlogs'][0]
}

export const UserBlogCard = ({
    username,
    blog,
    isSelected,
    setSelectedId,
    setShowModal,
}: UserBlogCardProps) => {
    const router = useRouter()

    const handleEdit = (id: string) => {
        router.push(`/dashboard/edit/${id}`)
    }

    const handleDeleteClick = (id: string) => () => {
        setSelectedId(id)
        setShowModal(true)
    }

    return (
        <div
            className={classNames('blog-card', { selected: isSelected })}
            onClick={() => setSelectedId(blog._id)}
        >
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
                <RxReader />
            </div>
        </div>
    )
}

import React from 'react'
import { FiDelete, FiEdit } from 'react-icons/fi'
import {MdOutlineArticle} from 'react-icons/md'
import classNames from 'classnames'
import dayjs from 'dayjs'

import { GetUserBlogsQuery } from '../../gqlSDK/sdk'

interface UserBlogCardProps {
    isSelected: boolean
    setSelectedId: (id: string) => void
    username: string
    blog: GetUserBlogsQuery['getUserBlogs'][0]
}

export const UserBlogCard = ({
    username,
    blog,
    isSelected,
    setSelectedId,
}: UserBlogCardProps) => {
    const handleEdit = (id: string) => {
        console.log('edit', id)
    }

    const handleDelete = (id: string) => {
        console.log('delete', id)
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
            {isSelected && (
                <div className="blog-icon-container">
                    <FiEdit onClick={() => handleEdit(blog._id)} />
                    <FiDelete onClick={() => handleDelete(blog._id)} />
                    <MdOutlineArticle/>
                </div>
            )}
        </div>
    )
}

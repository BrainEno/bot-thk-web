import React from 'react'
import { FiDelete, FiEdit, FiSlash } from 'react-icons/fi'
import { RxReader } from 'react-icons/rx'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import { GetUserBlogsQuery } from '../../generated/graphql-request'
import { getLocaleFormatedTime } from '../../helpers/date'
import { useToggleLikeMutation } from '../../hooks/mutation/useToggleLikeMutation'

import { RightSideStatus } from './UserDashboard'

interface UserBlogCardProps {
    setSelectedId?: (id: string) => void
    setShowModal?: React.Dispatch<React.SetStateAction<boolean>>
    username: string
    blog: GetUserBlogsQuery['getUserBlogs'][0]
    type: Omit<RightSideStatus, 'FOLLOWED' | 'FOLLOWING'>
}

export const UserBlogCard = ({
    username,
    blog,
    setSelectedId,
    setShowModal,
    type,
}: UserBlogCardProps) => {
    const { t, i18n } = useTranslation('dashboard')
    const { t: tc } = useTranslation('common')
    const router = useRouter()
    const toggleLikeMutation = useToggleLikeMutation()
    const queryClient = useQueryClient()

    const handleEdit = (id: string) => {
        setSelectedId?.(id)
        router.push({ pathname: '/dashboard/edit/[id]', query: { id } })
    }

    const handleDeleteClick = (id: string) => () => {
        setSelectedId?.(id)
        setShowModal?.(true)
    }

    const handleUnlike = (blogId: string) => () => {
        toggleLikeMutation.mutateAsync({ blogId }).then(() => {
            queryClient.invalidateQueries({ queryKey: ['userLikedBlogs'] })
        })
    }

    const handleRead = (slug: string) => () => {
        router.push({ pathname: '/blogs/[slug]', query: { slug } })
    }

    return (
        <div className="blog-card">
            <Link
                href={{ pathname: '/blogs/[slug]', query: { slug: blog.slug } }}
                className="blog-title"
            >
                <h5>{blog.title}</h5>
            </Link>
            <span className="desc-text">
                {tc('By')}: {username} |{' '}
                {getLocaleFormatedTime(blog.createdAt, i18n.language)}
            </span>
            <div>
                <p>{(blog.description as string).replace(/<[^>]+>/g, '')}</p>
            </div>

            <div className="blog-icon-container">
                {type === 'SELF' && (
                    <FiEdit
                        onClick={() => handleEdit(blog._id)}
                        title={t('edit')}
                    />
                )}
                {type === 'SELF' ? (
                    <FiDelete
                        onClick={handleDeleteClick(blog._id)}
                        title={t('delete')}
                    />
                ) : (
                    <FiSlash
                        title={t('unsave')}
                        onClick={handleUnlike(blog._id)}
                    />
                )}
                <RxReader onClick={handleRead(blog.slug)} title={t('view')} />
            </div>
        </div>
    )
}

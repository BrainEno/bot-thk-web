import React, { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'next-i18next'

import { GetUserBlogsQuery } from '../../generated/graphql-request'
import { sdk } from '../../generated/sdk'
import { getErrorMsg } from '../../helpers/getErrorMsg'
import AddBtn from '../common/AddBtn'
import { showAlert } from '../common/Alert'
import Modal from '../common/Modal'
import MyBrand from '../common/MyBrand'
import { Pagination } from '../common/Pagination'

import { UserBlogCard } from './UserBlogCard'

const PAGE_SIZE = 6

interface UserBlogsProps {
    blogs: GetUserBlogsQuery['getUserBlogs']
    username: string
}
const UserBlogs: React.FC<UserBlogsProps> = ({ blogs, username }) => {
    const { t, i18n } = useTranslation('dashboard')
    const isZh = i18n.language === 'zh'
    const [current, setCurrent] = useState(1)
    const [selectedId, setSelectedId] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [error, setError] = useState('')
    const queryClient = useQueryClient()

    const paginatedBlogs = useMemo(() => {
        const lastIndex = PAGE_SIZE * current
        const firstIndex = lastIndex - PAGE_SIZE

        return blogs?.slice(firstIndex, lastIndex)
    }, [current, blogs])

    const handleDeleteBlog = (id: string) => () => {
        sdk.DeleteBlogById({ blogId: id })
            .then((res) => {
                if (res.deleteBlogById) {
                    setError('')
                    queryClient.invalidateQueries({
                        queryKey: ['userBlogs'],
                    })
                    setShowModal(false)
                }
            })
            .catch((err) => {
                if (err) setError(getErrorMsg(err))
            })
    }

    return (
        <div className="dashboard-right-container">
            {showAlert(error, 'error')}
            {showModal && (
                <Modal
                    onClose={() => setShowModal(false)}
                    title={t('delete-post')}
                    closeOnClickOutside
                >
                    <p>
                        {isZh
                            ? '确认要删除该文章吗？'
                            : 'The Article will be completely deleted,are you sure?'}
                    </p>
                    <div className="Modal__footer">
                        <button onClick={handleDeleteBlog(selectedId)}>
                            {t('yes')}
                        </button>
                        <button
                            onClick={() => {
                                setShowModal(false)
                            }}
                        >
                            {t('no')}
                        </button>
                    </div>
                </Modal>
            )}
            <div className="header-container">
                <div className="brand-container">
                    <MyBrand width={45} height={45} />
                </div>
                <div className="info-container">
                    <h2>{username}</h2>
                    {blogs && blogs?.length > 0 ? (
                        <h5 className="userInfo-text">
                            {isZh
                                ? `在 BOT THK 一共发布了 ${blogs.length} 篇文章`
                                : `Has published ${blogs.length} ${
                                      blogs.length === 1
                                          ? 'article'
                                          : 'articles'
                                  } on BOT THK`}
                        </h5>
                    ) : (
                        <h5 className="userInfo-text">
                            {isZh
                                ? '还没有在 BOT THK 发布过文章'
                                : 'Haven’t published any articles on BOT THK yet'}
                        </h5>
                    )}
                </div>

                <AddBtn href={'/dashboard/new-blog'} size={60} />
            </div>

            <div className="blog-card-container">
                {blogs &&
                    blogs?.length &&
                    paginatedBlogs.map((b) => (
                        <UserBlogCard
                            setSelectedId={setSelectedId}
                            key={b._id}
                            username={username || 'unkwnown'}
                            blog={b}
                            setShowModal={setShowModal}
                            type="SELF"
                        />
                    ))}
            </div>

            <Pagination
                pageSize={PAGE_SIZE}
                total={blogs?.length ?? 0}
                defaultCurrent={current}
                onChange={setCurrent}
            />
        </div>
    )
}

export default UserBlogs

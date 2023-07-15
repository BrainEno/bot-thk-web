import React, { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import {
    CurrentUserQuery,
    GetUserBlogsQuery,
} from '../../generated/graphql-request'
import { sdk } from '../../generated/sdk'
import { getErrorMsg } from '../../helpers/getErrorMsg'
import AddBtn from '../Common/AddBtn'
import { showAlert } from '../Common/Alert'
import Modal from '../Common/Modal'
import { Pagination } from '../Common/Pagination'
import MyBrand from '../MyBrand'

import { UserBlogCard } from './UserBlogCard'

const PAGE_SIZE = 6

interface IUserBlogsProps {
    blogs: GetUserBlogsQuery['getUserBlogs']
    user: CurrentUserQuery['currentUser']
}
const UserBlogs: React.FC<IUserBlogsProps> = ({ blogs, user }) => {
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
                        queryKey: ['getUserBlogs'],
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
                    title={`删除文章`}
                    closeOnClickOutside
                >
                    <p>确认要删除该文章吗？</p>
                    <div className="Modal__footer">
                        <button onClick={handleDeleteBlog(selectedId)}>
                            确定
                        </button>
                        <button
                            onClick={() => {
                                setShowModal(false)
                            }}
                        >
                            退出
                        </button>
                    </div>
                </Modal>
            )}
            <div className="header-container">
                <div className="brand-container">
                    <MyBrand width={45} height={45} />
                </div>
                <div className="info-container">
                    <h2>{user?.name}</h2>
                    {blogs && blogs?.length > 0 ? (
                        <h5 className="userInfo-text">
                            在 BOT THK 一共发布了 {blogs.length} 篇文章
                        </h5>
                    ) : (
                        <h5 className="userInfo-text">
                            还没有在 BOT THK 发布过文章
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
                            key={b.slug}
                            username={user?.name || 'unkwnown'}
                            blog={b}
                            setShowModal={setShowModal}
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

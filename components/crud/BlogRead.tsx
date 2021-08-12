import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { getCookie, isAuth } from '../../actions/auth'
import { list, removeBlog } from '../../actions/blog'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { IBlog } from '../../types'

dayjs.extend(relativeTime)

const BlogRead = ({ username }: { username?: string }) => {
    const [blogs, setBlogs] = useState<IBlog[]>([])
    const [message, setMessage] = useState('')
    const token = getCookie('token')

    const loadBlogs = useCallback(() => {
        list(username).then((data) => {
            if (data.error) {
                console.log(data.error)
            } else {
                setBlogs(data)
            }
        })
    }, [username])

    const deleteBlogs = (id: string) => {
        removeBlog(id, token).then((data) => {
            if (data.error) {
                console.log(data.error)
            } else {
                setMessage(data.message)
                loadBlogs()
                setTimeout(() => {
                    setMessage('')
                }, 1000)
            }
        })
    }

    const deleteConfirm = (id: string) => {
        let answer = window.confirm('确定要删除这篇文章吗？')
        if (answer) {
            deleteBlogs(id)
        }
    }

    const showUpdateButton = (blog: IBlog) => {
        if (isAuth() && isAuth().role === 0) {
            return (
                <Link href={`/user/crud/${blog._id}`} passHref>
                    <button className="update-btn">
                        <EditOutlined />
                        更新
                    </button>
                </Link>
            )
        } else if (isAuth() && isAuth().role === 1) {
            return (
                <Link href={`/admin/crud/${blog._id}`} passHref>
                    <button className="update-btn">
                        <EditOutlined />
                        更新
                    </button>
                </Link>
            )
        }
    }

    const showAllBlogs = () => {
        return blogs.map((blog, i) => {
            return (
                <div key={i} className="blog-card">
                    <h5>{blog.title}</h5>
                    <p className="description-text">
                        By: {blog.author.name} | Updated:
                        {'  ' + dayjs(blog.updatedAt, 'zh', true).fromNow()}
                    </p>
                    <div>
                        <p>
                            {blog.description
                                .replace(/<[^>]+>/g, '')
                                .slice(0, 50) + '...'}
                        </p>
                    </div>
                    <div className="button-container">
                        <button
                            onClick={() => deleteConfirm(blog._id)}
                            className="del-btn"
                        >
                            <DeleteOutlined />
                            删除
                        </button>
                        {showUpdateButton(blog)}
                    </div>
                </div>
            )
        })
    }
    useEffect(() => {
        loadBlogs()
    }, [loadBlogs])

    return (
        <>
            {blogs.length > 0 ? (
                <div className="manage-blogs">
                    {message && (
                        <div className="alert alert-warning">{message}</div>
                    )}
                    <div className="blogs-container">{showAllBlogs()}</div>
                </div>
            ) : (
                <Link
                    href={isAuth() && isAuth().role === 1 ? 'admin' : '/user'}
                    passHref
                >
                    <h3 style={{ marginTop: '50px', cursor: 'pointer' }}>
                        还没有发布过文章，
                        <a
                            href={
                                isAuth() && isAuth().role === 1
                                    ? 'admin'
                                    : '/user'
                            }
                        >
                            返回上一页
                        </a>
                    </h3>
                </Link>
            )}
        </>
    )
}

export default BlogRead

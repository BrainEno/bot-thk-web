import { useEffect } from 'react'
import Link from 'next/link'
import { NextRouter, withRouter } from 'next/router'
import Avatar from './Avatar'
import { isAuth } from '../../actions/auth'
import { FormOutlined, HomeOutlined, EditOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useSelector, useDispatch } from 'react-redux'
import { loadUser, loadUserProfile } from '../../redux/actions'
import UserBlogs from './UserBlogs'

dayjs.extend(relativeTime)

const UserDashboard = ({ router }: { router: NextRouter }) => {
    const DefaultRootState = useSelector((state) => state)
    const { user, userProfile }: any = DefaultRootState

    const dispatch = useDispatch()

    useEffect(() => {
        ;async () => {
            dispatch(loadUser())
            dispatch(loadUserProfile())
        }
    }, [router, dispatch])

    return (
        <div className="user-dashboard">
            <div className="userInfo-container">
                <div className="userInfo">
                    <div className="avatar-container">
                        <a href={`/profile/${user.username}`}>
                            <Avatar
                                title="查看所有"
                                size={100}
                                radius={100}
                                src={`${process.env.NEXT_PUBLIC_API}/user/photo/${user.username}`}
                            />
                        </a>
                    </div>
                    <span>{user.name}</span>
                    <div>
                        <span className="userInfo-text">{user.email}</span>
                        {userProfile && (
                            <span className="userInfo-text">
                                Joined <b>BOT THK</b>
                                {dayjs(
                                    userProfile.user.createdAt,
                                    'zh'
                                ).fromNow()}
                            </span>
                        )}
                    </div>
                </div>

                <ul>
                    <li>
                        <Link href="/">
                            <HomeOutlined title="返回首页" />
                        </Link>
                        <Link href="/">
                            <span className="span-text">返回首页</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={
                                isAuth() && isAuth().role === 1
                                    ? '/admin/crud/blog'
                                    : '/user/crud/blog'
                            }
                        >
                            <FormOutlined title="新建文章" />
                        </Link>
                        <Link
                            href={
                                isAuth() && isAuth().role === 1
                                    ? '/admin/crud/blog'
                                    : '/user/crud/blog'
                            }
                        >
                            <span className="span-text">新建文章</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={
                                isAuth() && isAuth().role === 1
                                    ? '/admin/crud/blogs'
                                    : '/user/crud/blogs'
                            }
                        >
                            <EditOutlined title="编辑文章" />
                        </Link>
                        <Link
                            href={
                                isAuth() && isAuth().role === 1
                                    ? '/admin/crud/blogs'
                                    : '/user/crud/blogs'
                            }
                        >
                            <span className="span-text">编辑文章</span>
                        </Link>
                    </li>
                </ul>
            </div>

            <UserBlogs blogs={userProfile.blogs} user={user} />
        </div>
    )
}

export default withRouter(UserDashboard)

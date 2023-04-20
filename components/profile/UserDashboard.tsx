import { useEffect, useMemo } from 'react'
import { EditOutlined, FormOutlined, HomeOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { NextRouter, useRouter, withRouter } from 'next/router'

import { isAuth } from '../../actions/auth'
import { CurrentUserQuery, getSdkWithHooks } from '../../gql/sdk'
import { gqlClient } from '../../graphql/gqlClient'
import Avatar from '../Avatar'

import MenuItem from './MenuItem'
import UserBlogs from './UserBlogs'

dayjs.extend(relativeTime)

interface UserDashboardProps {
    router: NextRouter
    user: CurrentUserQuery['currentUser']
}

const sdk = getSdkWithHooks(gqlClient)

const UserDashboard = ({ user, router }: UserDashboardProps) => {
    console.log('user id', user?._id)
    const { data, error } = sdk.useGetUserBlogs(
        user && user._id ? 'profile/user-blogs' : null,
        {
            userId: user?._id,
        }
    )
    console.log(data, error)
    const userBlogs = data?.getUserBlogs
    useEffect(() => {
        if ((user && !user._id && error) || !data || !userBlogs)
            router.push('/signin')
    }, [data, error, router, user, userBlogs])

    return (
        <div className="user-dashboard">
            <div className="userInfo-container">
                <div className="userInfo">
                    <div className="avatar-container">
                        <a href={`/profile/${user?.username}`}>
                            <Avatar
                                title="查看所有"
                                size={100}
                                radius={100}
                                src={`${process.env.NEXT_PUBLIC_API}/user/photo/${user?.username}`}
                            />
                        </a>
                    </div>
                    <span>{user?.name}</span>
                    <div>
                        <span className="userInfo-text">{user?.email}</span>
                        {user && (
                            <span className="userInfo-text">
                                Joined <b>BOT THK</b>
                                {' ' + dayjs(user?.createdAt, 'zh').fromNow()}
                            </span>
                        )}
                    </div>
                </div>

                <ul>
                    <MenuItem
                        href="/"
                        title="返回首页"
                        renderIcon={(color) => (
                            <HomeOutlined style={{ color }} />
                        )}
                    />
                    <MenuItem
                        href={
                            isAuth() && isAuth().role === 1
                                ? '/admin/crud/blog'
                                : '/user/crud/blog'
                        }
                        title="新建文章"
                        renderIcon={(color) => (
                            <FormOutlined style={{ color }} />
                        )}
                    />
                    <MenuItem
                        href={
                            isAuth() && isAuth().role === 1
                                ? '/admin/crud/blog'
                                : '/user/crud/blog'
                        }
                        title="编辑文章"
                        renderIcon={(color) => (
                            <EditOutlined style={{ color }} />
                        )}
                    />
                </ul>
            </div>

            <UserBlogs blogs={userBlogs} user={user} />
        </div>
    )
}

export default withRouter(UserDashboard)

import { useEffect } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { NextRouter, withRouter } from 'next/router'

import { CurrentUserQuery, getSdkWithHooks } from '../../gqlSDK/sdk'
import { gqlClient } from '../../graphql/gqlClient'

import UserBlogs from './UserBlogs'
import UserInfo from './UserInfo'

dayjs.extend(relativeTime)

interface UserDashboardProps {
    router: NextRouter
    user: NonNullable<CurrentUserQuery['currentUser']>
}

const sdk = getSdkWithHooks(gqlClient)

const UserDashboard = ({ user, router }: UserDashboardProps) => {
    const { data, error } = sdk.useGetUserBlogs(
        user && user._id ? 'profile/user-blogs' : null,
        {
            userId: user?._id,
        }
    )
    const userBlogs = data?.getUserBlogs

    useEffect(() => {
        setTimeout(() => {
            if (!user && !data && error) router.push('/signin')
        }, 2000)
    }, [data, error, router, user])

    return (
        <div className="user-dashboard">
            {user && <UserInfo user={user} />}
            {user && userBlogs && <UserBlogs blogs={userBlogs} user={user} />}
        </div>
    )
}

export default withRouter(UserDashboard)

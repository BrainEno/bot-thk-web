import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { NextRouter, withRouter } from 'next/router'

import {
    CurrentUserQuery,
    GetUserBlogsDocument,
    GetUserBlogsQuery,
    GetUserBlogsQueryVariables,
} from '../../generated/graphql-request'
import { fetcher } from '../../graphql/gqlClient'

import UserBlogs from './UserBlogs'
import UserInfo from './UserInfo'

dayjs.extend(relativeTime)

interface UserDashboardProps {
    router: NextRouter
    user: NonNullable<CurrentUserQuery['currentUser']>
}

const UserDashboard = ({ user, router }: UserDashboardProps) => {
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const {
        data: userBlogs,
        error,
        isLoading,
    } = useQuery<GetUserBlogsQuery, Error, GetUserBlogsQuery['getUserBlogs']>(
        ['getUserBlogs'],
        fetcher<GetUserBlogsQuery, GetUserBlogsQueryVariables>(
            GetUserBlogsDocument,
            { userId: user._id }
        ),
        { enabled: !!(user && user._id), select: (res) => res.getUserBlogs }
    )

    useEffect(() => {
        if (!timer.current) {
            timer.current = setTimeout(() => {
                if (!user && !isLoading && error) router.push('/signin')
            }, 2000)
        }

        return () => {
            timer.current = null
        }
    }, [error, isLoading, router, user])

    return (
        <div className="user-dashboard">
            {user && <UserInfo user={user} />}
            {userBlogs && <UserBlogs blogs={userBlogs} user={user} />}
        </div>
    )
}

export default withRouter(UserDashboard)

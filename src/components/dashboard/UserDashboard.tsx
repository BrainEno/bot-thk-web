import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import dynamic from 'next/dynamic'
import { NextRouter, withRouter } from 'next/router'

import {
    CurrentUserQuery,
    GetUserBlogsDocument,
    GetUserBlogsQuery,
    GetUserBlogsQueryVariables,
    GetUserLikedBlogsDocument,
    GetUserLikedBlogsQuery,
    GetUserLikedBlogsQueryVariables,
} from '../../generated/graphql-request'
import { fetcher } from '../../graphql/gqlClient'
import { useFollowInfo } from '../../hooks/query/useFollowInfo'

import LikedBlogs from './LikedBlogs'

const FollowInfoList = dynamic(
    () => import('./FollowInfoList').then((mod) => mod.default),
    { ssr: false }
)
const UserBlogs = dynamic(
    () => import('./UserBlogs').then((mod) => mod.default),
    { ssr: false }
)
const UserInfo = dynamic(
    () => import('./UserInfo').then((mod) => mod.default),
    { ssr: false }
)

dayjs.extend(relativeTime)

interface UserDashboardProps {
    router: NextRouter
    user: NonNullable<CurrentUserQuery['currentUser']>
}

export type RightSideStatus = 'SELF' | 'FOLLOWER' | 'FOLLOWING' | 'LIKED'

const UserDashboard = ({ user, router }: UserDashboardProps) => {
    const [status, setStatus] = useState<RightSideStatus>('SELF')

    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const {
        data: userBlogs,
        error,
        isLoading,
    } = useQuery<GetUserBlogsQuery, Error, GetUserBlogsQuery['getUserBlogs']>({
        queryKey: ['userBlogs', user._id],
        queryFn: fetcher<GetUserBlogsQuery, GetUserBlogsQueryVariables>(
            GetUserBlogsDocument,
            { userId: user._id }
        ),
        enabled: !!(user && user._id),
        refetchOnReconnect: true,
        select: (res) => res.getUserBlogs,
    })

    const { data: userLikedBlogs } = useQuery<
        GetUserLikedBlogsQuery,
        Error,
        GetUserLikedBlogsQuery['getUserLikedBlogs']
    >({
        queryKey: ['userLikedBlogs', user._id],
        queryFn: fetcher<
            GetUserLikedBlogsQuery,
            GetUserLikedBlogsQueryVariables
        >(GetUserLikedBlogsDocument),
        enabled: !!(user && user._id),
        refetchOnReconnect: true,
        select: (res) => res.getUserLikedBlogs,
    })

    const { followers, followings } = useFollowInfo({
        enabled: !!(user && user.username),
        tag: user.name,
        username: user.username,
    })

    useEffect(() => {
        if (!timer.current) {
            timer.current = setTimeout(() => {
                if (!user && !isLoading && error)
                    router.push({ pathname: '/signin' })
            }, 2000)
        }

        return () => {
            timer.current = null
        }
    }, [error, isLoading, router, user])

    return (
        <div className="user-dashboard">
            <UserInfo user={user} status={status} setStatus={setStatus} />
            {status === 'SELF' && userBlogs && (
                <UserBlogs blogs={userBlogs} username={user.name} />
            )}
            {status === 'LIKED' && userLikedBlogs && (
                <LikedBlogs blogs={userLikedBlogs} username={user.name} />
            )}
            {(status === 'FOLLOWING' || status === 'FOLLOWER') && (
                <FollowInfoList
                    type={status}
                    followers={followers}
                    followings={followings}
                    hideFollowInfo={() => setStatus('SELF')}
                />
            )}
        </div>
    )
}

export default withRouter(UserDashboard)

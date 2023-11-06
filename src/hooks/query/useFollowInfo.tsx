import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import {
    GetFollowInfoDocument,
    GetFollowInfoQuery,
    GetFollowInfoQueryVariables,
} from '../../generated/graphql-request'
import { fetcher } from '../../graphql/gqlClient'

interface UseFollowInfoParams {
    username: string
    enabled?: boolean
    tag: string
}

type Users = NonNullable<GetFollowInfoQuery['getFollowInfo']>['followers']

export const useFollowInfo = ({
    enabled,
    username,
    tag,
}: UseFollowInfoParams) => {
    const [followers, setFollowers] = useState<Users>([])
    const [followings, setFollowings] = useState<Users>([])

    const { data: followInfo, isSuccess } = useQuery<
        GetFollowInfoQuery,
        Error,
        GetFollowInfoQuery['getFollowInfo']
    >({
        queryKey: ['getFollowInfo', tag],
        queryFn: fetcher<GetFollowInfoQuery, GetFollowInfoQueryVariables>(
            GetFollowInfoDocument,
            { username }
        ),
        enabled,
        select: (res) => res.getFollowInfo,
    })

    useEffect(() => {
        if (isSuccess && followInfo) {
            setFollowers(followInfo?.followers)
            setFollowings(followInfo?.followings)
        }
    }, [followInfo, isSuccess])

    return { followers, followings }
}

import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { User } from 'next-auth'
import { useClient } from 'urql'

import {
    BlogPublishedDocument,
    GetFollowInfoDocument,
    GetFollowInfoQuery,
    GetFollowInfoQueryVariables,
} from '../../generated/graphql-request'
import { fetcher } from '../../graphql/gqlClient'
import { useNotificationStore } from '../store/useNotificationStore'

export const useBlogPulished = (user?: User) => {
    const ref = useRef<any | null>(null)
    const client = useClient()
    const append = useNotificationStore((state) => state.append)

    const { data: followings } = useQuery<
        GetFollowInfoQuery,
        Error,
        NonNullable<GetFollowInfoQuery['getFollowInfo']>['followings']
    >(
        ['userGetFollowInfo'],
        fetcher<GetFollowInfoQuery, GetFollowInfoQueryVariables>(
            GetFollowInfoDocument,
            { username: user?.name }
        ),
        {
            enabled: !!(user && user.name),
            select: (data) => data.getFollowInfo!.followings,
        }
    )

    useEffect(() => {
        if (!user || !ref.current) return
        let blogPublishedSubscription = ref.current

        blogPublishedSubscription = client
            .subscription(BlogPublishedDocument, {
                followingIds: followings?.map((f) => f._id.toString()) ?? [],
            })
            .subscribe((res) => {
                if (res.data) {
                    const { dateString, message, id, linkString } =
                        res.data.blogPublished
                    const type = id.split('_')[0]
                    append({
                        message,
                        dateString,
                        id,
                        type,
                        linkString,
                        isViewed: false,
                    })
                }

                if (res.error) {
                    console.log('BlogPublised Subscription Error:', res.error)
                }
            })

        return () => {
            if (blogPublishedSubscription) {
                console.log('blogPublishedSubscription unsubscribed')
                blogPublishedSubscription.unsubscribe()
            }
        }
    }, [client, user])
}

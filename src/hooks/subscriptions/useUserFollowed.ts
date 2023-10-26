import { useEffect } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { isServer } from '@tanstack/react-query'
import { User } from 'next-auth'
import { useClient } from 'urql'

import { UserFollowedDocument } from '../../generated/graphql-request'
import { deepParse } from '../../helpers/deepParse'
import { useNotificationStore } from '../store/useNotificationStore'

export const useUserFollowed = (user?: User) => {
    const client = useClient()
    const append = useNotificationStore((state) => state.append)
    const userInLS = !isServer && secureLocalStorage.getItem('current-user')
    const prevName = deepParse(userInLS)?.state?.prevName || ''

    useEffect(() => {
        if (!user) return
        const userFollowedSubscription = client
            .subscription(UserFollowedDocument, {
                name: user?.name || prevName || '',
            })
            .subscribe((res) => {
                if (res.error) {
                    console.log('UserFollowed Subscription Error:', res.error)
                }

                if (res.data) {
                    const { dateString, message, id, linkString } =
                        res.data.userFollowed
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
            })

        return () => {
            if (userFollowedSubscription) {
                console.log('userFollowedSubscription unsubscribed')
                userFollowedSubscription.unsubscribe()
            }
        }
    }, [client, user])
}

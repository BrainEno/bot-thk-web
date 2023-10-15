import { useClient } from 'urql'
import { useNotificationStore } from '../store/useNotificationStore'
import { useEffect } from 'react'
import { UserFollowedDocument } from 'src/generated/graphql-request'
import { isServer } from '@tanstack/react-query'
import secureLocalStorage from 'react-secure-storage'
import { deepParse } from 'src/helpers/deepParse'
import { User } from 'next-auth'

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
            if (userFollowedSubscription) userFollowedSubscription.unsubscribe()
        }
    }, [client, user])
}

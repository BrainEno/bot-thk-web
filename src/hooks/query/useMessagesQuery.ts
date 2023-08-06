import { useEffect } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { useQuery } from '@tanstack/react-query'

import {
    MessagesDocument,
    MessagesQuery,
    MessagesQueryVariables,
} from '../../generated/gql/graphql'
import { sdk } from '../../generated/sdk'
import { fetcher } from '../../graphql/gqlClient'

interface MessagesParams {
    conversationId: string
    enabled?: boolean
}

export const useMessagesQuery = ({
    enabled,
    conversationId,
}: MessagesParams) => {
    const {
        data: messages,
        isSuccess,
        refetch,
    } = useQuery<MessagesQuery, Error, MessagesQuery['messages']>(
        ['messages'],
        fetcher<MessagesQuery, MessagesQueryVariables>(MessagesDocument, {
            conversationId,
        }),
        { enabled, retry: 3, select: (res) => res.messages }
    )

    const persisted = secureLocalStorage.getItem('current-user')
    const user = (persisted as any).state?.user

    useEffect(() => {
        if (!isSuccess) {
            if (user) sdk.RefreshToken(user._id).then(() => refetch())
        }
    }, [isSuccess, user, refetch])

    console.log('messages in hook', messages)

    return messages
}

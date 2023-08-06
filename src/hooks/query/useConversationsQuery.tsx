import { useEffect } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { useQuery } from '@tanstack/react-query'

import {
    ConversationsDocument,
    ConversationsQuery,
    ConversationsQueryVariables,
} from '../../generated/gql/graphql'
import { sdk } from '../../generated/sdk'
import { fetcher } from '../../graphql/gqlClient'

interface ConversationsParams {
    enabled?: boolean
}

export const useConversationsQuery = ({
    enabled,
}: ConversationsParams = {}) => {
    const {
        data: conversations,
        isSuccess,
        refetch,
    } = useQuery<
        ConversationsQuery,
        Error,
        ConversationsQuery['conversations']
    >(
        ['conversations'],
        fetcher<ConversationsQuery, ConversationsQueryVariables>(
            ConversationsDocument
        ),
        {
            enabled,
            select: (data) => data.conversations,
            // useErrorBoundary: true
        }
    )

    const persisted = secureLocalStorage.getItem('current-user')
    const user = (persisted as any).state?.user

    useEffect(() => {
        if (!isSuccess) {
            if (user)
                sdk.RefreshToken(user._id).then(() => {
                    refetch()
                })
        }
    }, [isSuccess, refetch, user])

    return { conversations, isSuccess }
}

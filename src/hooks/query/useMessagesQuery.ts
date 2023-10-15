import { useQuery } from '@tanstack/react-query'

import {
    MessagesDocument,
    MessagesQuery,
    MessagesQueryVariables,
} from '../../generated/gql/graphql'
import { fetcher } from '../../graphql/gqlClient'

interface MessagesParams {
    conversationId: string
    enabled?: boolean
}

export const useMessagesQuery = ({
    enabled,
    conversationId,
}: MessagesParams) => {
    const { data: messages } = useQuery<
        MessagesQuery,
        Error,
        MessagesQuery['messages']
    >(
        ['messages', conversationId],
        fetcher<MessagesQuery, MessagesQueryVariables>(MessagesDocument, {
            conversationId,
        }),
        {
            enabled,
            retryDelay: 2000,
            select: (res) => res.messages,
        }
    )

    return messages ?? []
}

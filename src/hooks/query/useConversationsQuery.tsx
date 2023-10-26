import { useQuery } from '@tanstack/react-query'

import {
    ConversationsDocument,
    ConversationsQuery,
    ConversationsQueryVariables,
} from '../../generated/gql/graphql'
import { fetcher } from '../../graphql/gqlClient'

interface ConversationsParams {
    enabled?: boolean
}

export const useConversationsQuery = ({
    enabled,
}: ConversationsParams = {}) => {
    const { data: conversations, isSuccess } = useQuery<
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
        }
    )

    return { conversations, isSuccess }
}

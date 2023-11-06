import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
    MarkConversationAsReadDocument,
    MarkConversationAsReadMutation,
    MarkConversationAsReadMutationVariables,
} from '../../generated/graphql-request'
import { fetcher } from '../../graphql/gqlClient'

export const useMarkConversationAsReadMutation = () => {
    const queryClient = useQueryClient()
    const markConversationAsReadMutation = useMutation<
        MarkConversationAsReadMutation,
        Error,
        MarkConversationAsReadMutationVariables
    >({
        mutationFn: async ({ conversationId, userId }) =>
            fetcher<
                MarkConversationAsReadMutation,
                MarkConversationAsReadMutationVariables
            >(MarkConversationAsReadDocument, {
                conversationId,
                userId,
            })(),
        onSuccess: (res) => {
            if (res.markConversationAsRead) {
                queryClient.invalidateQueries({ queryKey: ['conversations'] })
            }
        },
    })

    return markConversationAsReadMutation
}

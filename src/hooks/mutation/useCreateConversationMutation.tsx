import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
    CreateConversationDocument,
    CreateConversationMutation,
    CreateConversationMutationVariables,
} from '../../generated/gql/graphql'
import {} from '../../generated/graphql-request'
import { fetcher } from '../../graphql/gqlClient'

export const useCreateConversationMutation = (
    onSuccess?: (data: CreateConversationMutation) => void
) => {
    const queryClient = useQueryClient()

    const createConversationMutation = useMutation<
        CreateConversationMutation,
        Error,
        CreateConversationMutationVariables
    >({
        mutationFn: async ({ participantUserIds }) =>
            fetcher<
                CreateConversationMutation,
                CreateConversationMutationVariables
            >(CreateConversationDocument, {
                participantUserIds,
            })(),
        onSuccess: (res) => {
            if (res.createConversation) {
                queryClient.invalidateQueries({ queryKey: ['conversations'] })
            }

            if (onSuccess) onSuccess(res)
        },
    })

    return createConversationMutation
}

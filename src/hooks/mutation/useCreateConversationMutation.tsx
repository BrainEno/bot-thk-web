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
    >(
        async ({ participantIds }) =>
            fetcher<
                CreateConversationMutation,
                CreateConversationMutationVariables
            >(CreateConversationDocument, {
                participantIds,
            })(),
        {
            onSuccess: (res) => {
                if (res.createConversation) {
                    queryClient.invalidateQueries(['conversations'])
                }

                if (onSuccess) onSuccess(res)
            },
        }
    )

    return createConversationMutation
}

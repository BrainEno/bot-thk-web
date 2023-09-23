import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
    DeleteConversationDocument,
    DeleteConversationMutation,
    DeleteConversationMutationVariables,
} from '../../generated/gql/graphql'
import {} from '../../generated/graphql-request'
import { fetcher } from '../../graphql/gqlClient'

export const useDeleteConversationMutation = (
    onSuccess?: (data: DeleteConversationMutation) => void
) => {
    const queryClient = useQueryClient()

    const deleteConversationMutation = useMutation<
        DeleteConversationMutation,
        Error,
        DeleteConversationMutationVariables
    >(
        async ({ conversationId }) =>
            fetcher<
                DeleteConversationMutation,
                DeleteConversationMutationVariables
            >(DeleteConversationDocument, {
                conversationId,
            })(),
        {
            onSuccess: (res) => {
                if (res.deleteConversation) {
                    queryClient.invalidateQueries(['conversations'])
                }

                if (onSuccess) onSuccess(res)
            },
        }
    )

    return deleteConversationMutation
}

import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
    SendMessageDocument,
    SendMessageMutation,
    SendMessageMutationVariables,
} from '../../generated/gql/graphql'
import { fetcher } from '../../graphql/gqlClient'

export const useSendMessageMutation = (
    onSuccess?: (data: SendMessageMutation) => void
) => {
    const queryClient = useQueryClient()

    const sendMessageMutation = useMutation<
        SendMessageMutation,
        Error,
        SendMessageMutationVariables
    >(
        async ({ conversationId, senderId, body }) =>
            fetcher<SendMessageMutation, SendMessageMutationVariables>(
                SendMessageDocument,
                {
                    conversationId,
                    senderId,
                    body,
                }
            )(),
        {
            onSuccess: (res) => {
                if (res.sendMessage) {
                    queryClient.invalidateQueries(['messages'])
                }

                if (onSuccess) onSuccess(res)
            },
        }
    )

    return sendMessageMutation
}

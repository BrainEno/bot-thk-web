import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
    UpdateParticipantsDocument,
    UpdateParticipantsMutation,
    UpdateParticipantsMutationVariables,
} from '../../generated/graphql-request'
import { fetcher } from '../../graphql/gqlClient'

export const useUpdateParticipantsMuation = (
    onSuccess?: (data?: UpdateParticipantsMutation) => void
) => {
    const queryClient = useQueryClient()

    const updateParticipantsMutation = useMutation<
        UpdateParticipantsMutation,
        Error,
        UpdateParticipantsMutationVariables
    >(
        async ({
            conversationId,
            participantIds,
        }: UpdateParticipantsMutationVariables) =>
            fetcher<
                UpdateParticipantsMutation,
                UpdateParticipantsMutationVariables
            >(UpdateParticipantsDocument, { conversationId, participantIds })(),
        {
            onSuccess: (res) => {
                if (res.updateParticipants) {
                    queryClient.invalidateQueries(['conversations'])
                }

                if (onSuccess) onSuccess(res)
            },
        }
    )

    return updateParticipantsMutation
}

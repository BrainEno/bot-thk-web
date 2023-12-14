import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
    ToggleLikeDocument,
    ToggleLikeMutation,
    ToggleLikeMutationVariables,
} from '../../generated/graphql-request'
import { fetcher } from '../../graphql/gqlClient'

export const useToggleLikeMutation = () => {
    const queryClient = useQueryClient()

    const toggleLikeMutation = useMutation<
        ToggleLikeMutation,
        Error,
        ToggleLikeMutationVariables
    >({
        mutationFn: async ({ blogId }) =>
            fetcher<ToggleLikeMutation, ToggleLikeMutationVariables>(
                ToggleLikeDocument,
                {
                    blogId,
                }
            )(),
        onSuccess: (res) => {
            if (res.toggleLike) {
                queryClient.invalidateQueries({
                    queryKey: ['getBlogBySlug'],
                })
            }
        },
    })

    return toggleLikeMutation
}

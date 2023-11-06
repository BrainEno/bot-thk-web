import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
    UnFollowDocument,
    UnFollowMutation,
    UnFollowMutationVariables,
} from '../../generated/graphql-request'
import { fetcher } from '../../graphql/gqlClient'

export const useUnFollowMutation = () => {
    const queryClient = useQueryClient()

    const unFollowMutation = useMutation<
        UnFollowMutation,
        Error,
        UnFollowMutationVariables
    >({
        mutationFn: async ({ name }) =>
            fetcher<UnFollowMutation, UnFollowMutationVariables>(
                UnFollowDocument,
                {
                    name,
                }
            )(),
        onSuccess: (res) => {
            if (res.unFollow) {
                queryClient.invalidateQueries({ queryKey: ['getFollowInfo'] })
            }
        },
    })
    return unFollowMutation
}

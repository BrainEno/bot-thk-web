import { useMutation,useQueryClient } from '@tanstack/react-query'

import {
    FollowDocument,
    FollowMutation,
    FollowMutationVariables,
} from '../../generated/graphql-request'
import { fetcher } from '../../graphql/gqlClient'

export const useFollowMutation = () => {
    const queryClient = useQueryClient()

    const followMutation = useMutation<
        FollowMutation,
        Error,
        FollowMutationVariables
    >(
        async ({ followName }) =>
            fetcher<FollowMutation, FollowMutationVariables>(FollowDocument, {
                followName,
            })(),
        {
            onSuccess: (res) => {
                if (res.follow) {
                    queryClient.invalidateQueries(['getFollowInfo'])
                }
            },
        }
    )

    return followMutation
}

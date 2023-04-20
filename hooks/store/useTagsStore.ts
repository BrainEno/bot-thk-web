import { create } from 'zustand'

import { getSdk, ListTagsQuery } from '../../gql/sdk'
import { gqlClient } from '../../graphql/gqlClient'

interface TagState {
    tags: ListTagsQuery['listTags']
    list: () => void
}

const sdk = getSdk(gqlClient)


export const useTagStore = create<TagState>((set) => ({
    tags: [],
    list: async () => {
        const { listTags: tags } = await sdk.ListTags()
        set({ tags })
    },
}))

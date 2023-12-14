import { create } from 'zustand'

import { ListTagsQuery } from '../../generated/graphql-request'
import { sdk } from '../../generated/sdk'

interface TagState {
    tags: ListTagsQuery['listTags']
    list: () => void
}

export const useTagStore = create<TagState>((set) => ({
    tags: [],
    list: async () => {
        const { listTags: tags } = await sdk.ListTags()
        set({ tags })
    },
}))

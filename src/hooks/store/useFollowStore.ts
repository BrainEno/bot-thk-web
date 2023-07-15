import { create } from 'zustand'

import { GetFollowInfoQuery } from '../../generated/graphql-request'
import { sdk } from '../../generated/sdk'

interface FollowState {
    followers: NonNullable<GetFollowInfoQuery['getFollowInfo']>['followers']
    followings: NonNullable<GetFollowInfoQuery['getFollowInfo']>['followings']
    getFollowInfo: () => void
}

export const useFollowStore = create<FollowState>((set) => ({
    followings: [],
    followers: [],
    getFollowInfo: async () => {
        const { getFollowInfo: followInfo } = await sdk.GetFollowInfo()
        if (followInfo) {
            const { followers, followings } = followInfo
            set({ followers, followings })
        }
    },
}))

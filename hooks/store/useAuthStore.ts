import { create } from 'zustand'

import { CurrentUserQuery, getSdk } from '../../gql/sdk'
import { gqlClient } from '../../graphql/gqlClient'

const sdk = getSdk(gqlClient)

interface AuthState {
    user: CurrentUserQuery['currentUser'] | null
    auth: () => void
    logOut: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    auth: async () => {
        const { currentUser } = await sdk.CurrentUser()
        set({ user: currentUser })
    },
    logOut: () => {
        set({ user: null })
    },
}))


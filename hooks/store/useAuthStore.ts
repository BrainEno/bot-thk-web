import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { CurrentUserQuery, getSdk } from '../../gqlSDK/sdk'
import { gqlClient } from '../../graphql/gqlClient'

const sdk = getSdk(gqlClient)

type AuthStatus = 'unknown' | 'authenticated'
interface AuthState {
    user: CurrentUserQuery['currentUser'] | null
    status: AuthStatus
    auth: () => void
    logOut: () => void
}

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            status: 'unknown' as AuthStatus,
            auth: async () => {
                const { currentUser } = await sdk.CurrentUser()
                set({ user: currentUser })
            },
            logOut: () => {
                set({ user: null })
            },
        }),
        {
            name: 'current-user',
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state: AuthState) => ({ user: state.user }),
        }
    )
)

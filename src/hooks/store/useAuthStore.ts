import secureLocalStorage from 'react-secure-storage'
import { create } from 'zustand'
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware'

import { CurrentUserQuery } from '../../generated/graphql-request'
import { sdk } from '../../generated/sdk'

type AuthStatus = 'unknown' | 'authenticated'
interface AuthState {
    user: CurrentUserQuery['currentUser'] | null
    prevName: string
    status: AuthStatus
    setUser: () => Promise<void>
    logOut: () => Promise<void>
}

const secureStorage: StateStorage = {
    getItem: (name: string) => {
        return (secureLocalStorage.getItem(name) as any) || null
    },
    setItem: (key, value) => {
        secureLocalStorage.setItem(key, value)
    },
    removeItem: (name: string) => {
        secureLocalStorage.removeItem(name)
    },
}

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            prevName: '',
            status: 'unknown' as AuthStatus,
            setUser: async () => {
                try {
                    const { currentUser } = await sdk.CurrentUser()

                    if (currentUser) {
                        set({ user: currentUser })
                        set({ prevName: currentUser.name })
                    } else {
                        set({ user: null })
                        throw new Error('Not Authenticated Error')
                    }
                } catch (error) {
                    set({ user: null })
                }
            },
            logOut: async () => {
                await sdk.Logout()
                set({ user: null })
            },
        }),
        {
            name: 'current-user',
            storage: createJSONStorage(() => secureStorage),
            partialize: (state: AuthState) => ({
                user: state.user,
                prevName: state.prevName,
            }),
        }
    )
)

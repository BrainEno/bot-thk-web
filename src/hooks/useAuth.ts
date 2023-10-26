import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'

import { gqlClient } from '../graphql/gqlClient'

import { useAuthStore } from './store/useAuthStore'

const useAuth = (shouldRedirect: boolean) => {
    const { data: session } = useSession()
    const router = useRouter()
    const userId = useAuthStore((state) => state.user?._id)
    const setUser = useAuthStore((state) => state.setUser)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const logOut = useAuthStore((state) => state.logOut)

    useEffect(() => {
        if (session?.error === 'RefreshAccessTokenError') {
            signOut({ callbackUrl: '/signin', redirect: shouldRedirect })
        }

        if (session === null) {
            if (
                router.route.includes('dashboard') ||
                router.route.includes('conversation')
            ) {
                router.replace('/signin')
            }

            logOut()

            setIsAuthenticated(false)
        } else if (session !== undefined) {
            if (router.route === '/signin') {
                router.replace('/')
            }

            setIsAuthenticated(true)
            gqlClient.setHeaders({
                Authrization: `Bearer ${session?.access_token}`,
            })
            if (!userId || userId !== session.user.id) {
                setUser()
            }
        }
    }, [logOut, router, session, setUser, shouldRedirect, userId])

    return isAuthenticated
}

export default useAuth

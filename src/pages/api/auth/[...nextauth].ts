import { AuthOptions, User } from 'next-auth'
import { Session } from 'next-auth/core/types'
import { JWT } from 'next-auth/jwt/types'
import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'

import { sdk } from '../../../generated/sdk'
import { getErrorMsg } from '../../../helpers/getErrorMsg'

declare module 'next-auth/jwt/types' {
    interface JWT {
        access_token: string
        expires_at: number
        refresh_token: string
        userRole?: string
        error?: 'RefreshAccessTokenError'
    }
}

declare module 'next-auth/core/types' {
    interface Session {
        access_token: string
        expires_at: number
        refresh_token: string
        error?: 'RefreshAccessTokenError'
        user: User
    }

    interface User {
        access_token: string
        expires_at: number
        refresh_token: string
        id: string
        name?: string | null
        email?: string | null
        image?: string | null
        userRole?: string
        error?: 'RefreshAccessTokenError'
    }
}

async function refreshAccessToken({
    refreshToken,
    accessToken,
}: {
    refreshToken: string
    accessToken: string
}) {
    try {
        const tokenResponse = await sdk.RefreshToken({ refreshToken })

        return {
            refreshToken: tokenResponse.refreshToken.refreshToken,
            accessToken: tokenResponse.refreshToken.accessToken,
            expiresAt: tokenResponse.refreshToken.accessTokenExpiry,
        }
    } catch (error) {
        return {
            refreshToken,
            accessToken,
            error: 'RefreshAccessTokenError',
        }
    }
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials): Promise<User | null> => {
                try {
                    const res = await sdk.Login({
                        email: credentials?.email as string,
                        password: credentials?.password as string,
                    })

                    if (res.login.ok) {
                        const result = await fetch(
                            process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${res.login.accessToken}`,
                                },
                                body: JSON.stringify({
                                    query: `
                                            query CurrentUser {
                                                currentUser {
                                                    _id
                                                    username
                                                    name
                                                    email
                                                    profile
                                                    about
                                                    role
                                                    photo
                                                    createdAt
                                                    updatedAt
                                                    followingIds
                                                    followerIds
                                                 }
                                                }
                                                    `,
                                }),
                            }
                        )

                        const {
                            data: { currentUser: user },
                        } = await result.json()

                        console.log('credential user is:', user)

                        if (user)
                            return {
                                id: user._id,
                                name: user.name,
                                email: user.email,
                                image: user.photo,
                                userRole: user.role,
                                access_token: res.login.accessToken,
                                expires_at: res.login.accessTokenExpiry,
                                refresh_token: res.login.refreshToken,
                            }
                    }
                    return null
                } catch (err) {
                    throw new Error(getErrorMsg(err))
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/signin',
    },
    callbacks: {
        jwt: async ({ token, user }: { token: JWT; user: User }) => {
            if (user) {
                return {
                    ...token,
                    access_token: user.access_token,
                    expires_at: user.expires_at,
                    refresh_token: user.refresh_token,
                    sub: user.id,
                }
            }

            const shouldRefreshTime = Math.round(
                token.expires_at - 5 * 60 * 1000 - Date.now()
            )

            if (shouldRefreshTime > 0) {
                return token
            }

            try {
                const { accessToken, refreshToken, expiresAt } =
                    await refreshAccessToken({
                        refreshToken: token.refresh_token,
                        accessToken: token.access_token,
                    })

                return {
                    ...token,
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    expires_at: expiresAt!,
                }
            } catch (error) {
                console.error('Error refreshing access token', error)
                return { ...token, error: 'RefreshAccessTokenError' }
            }
        },
        session: async ({
            session,
            token,
        }: {
            session: Session
            token: JWT
        }) => {
            // console.log(session.access_token, token.access_token)
            session.access_token = token.access_token
            session.expires_at = token.expires_at
            session.error = token.error
            session.user = { ...session.user, id: token.sub || '' }
            return Promise.resolve(session)
        },
    },
}

export default NextAuth(authOptions)

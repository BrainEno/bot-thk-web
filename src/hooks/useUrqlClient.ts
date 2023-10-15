import { useMemo } from 'react'
import { devtoolsExchange } from '@urql/devtools'
import { AuthConfig, authExchange, AuthUtilities } from '@urql/exchange-auth'
import { cacheExchange } from '@urql/exchange-graphcache'
import { createClient as createSSEClient, RequestParams } from 'graphql-sse'
import { useSession } from 'next-auth/react'
import {
    createClient,
    fetchExchange,
    ssrExchange,
    subscriptionExchange,
} from 'urql'

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT as string

export const isServerSide = typeof window === 'undefined'

declare global {
    interface Window {
        __URQL_DATA__: any
    }
}

const ssr = ssrExchange({
    isClient: !isServerSide,
    initialState: !isServerSide ? window.__URQL_DATA__ : undefined,
})

const SSE_URL = `${GRAPHQL_ENDPOINT}/stream`

const useUrqlClient = (options?: RequestInit) => {
    const { data: session } = useSession()
    const token = session?.access_token
    // const handleError = useErrorHandler();
    const sseClient = useMemo(
        () =>
            createSSEClient({
                url: SSE_URL,
                credentials: 'include',
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                },
            }),
        [token]
    )

    return useMemo(() => {
        const client = createClient({
            url: GRAPHQL_ENDPOINT,
            exchanges: [
                devtoolsExchange,
                cacheExchange({}),
                authExchange(async (utils: AuthUtilities) => {
                    return {
                        addAuthToOperation(operation) {
                            if (!token) return operation
                            return utils.appendHeaders(operation, {
                                Authorization: `Bearer ${token}`,
                                credentials: 'include',
                                mode: 'cors',
                            })
                        },
                    } as AuthConfig
                }),
                fetchExchange,
                ssr,
                subscriptionExchange({
                    forwardSubscription(operation) {
                        return {
                            subscribe: (sink) => {
                                const dispose = sseClient.subscribe(
                                    operation as RequestParams,
                                    sink
                                )
                                return {
                                    unsubscribe: dispose,
                                }
                            },
                        }
                    },
                }),
            ],
            fetchOptions: () => {
                return {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : '',
                        ...(options?.headers ? options.headers : {}),
                        credentials: 'include',
                        mode: 'cors',
                    },
                }
            },
        })

        return client
    }, [options?.headers, sseClient, token])
}

export default useUrqlClient

import { createClient as createSSEClient, RequestParams } from 'graphql-sse'
import {
    cacheExchange,
    Client,
    fetchExchange,
    ssrExchange,
    subscriptionExchange,
} from 'urql'

const GRAPHQL_ENDPOINT = process.env
    .NEXT_PUBLIC_GRAPHQL_ENDPOINT as string

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
export const sseClient = createSSEClient({
    url: SSE_URL,
})

export const urqlClient = new Client({
    url: GRAPHQL_ENDPOINT,
    exchanges: [
        cacheExchange,
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
})

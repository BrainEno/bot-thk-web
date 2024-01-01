import { gql } from 'graphql-tag';
import { useMemo } from 'react'
// import { devtoolsExchange } from '@urql/devtools'
import { AuthConfig, authExchange, AuthUtilities } from '@urql/exchange-auth'
import { cacheExchange } from '@urql/exchange-graphcache'
import { createClient as createSSEClient, RequestParams } from 'graphql-sse'
import { useSession } from 'next-auth/react'
import {
    createClient,
    Exchange,
    fetchExchange,
    ssrExchange,
    subscriptionExchange,
} from 'urql'
import { ExecutionResult, getOperationAST } from 'graphql'
import { isLiveQueryOperationDefinitionNode } from "@n1ru4l/graphql-live-query";
import { applyAsyncIterableIteratorToSink, makeAsyncIterableIteratorFromSink } from '@n1ru4l/push-pull-async-iterable-iterator'
import { applyLiveQueryJSONDiffPatch } from '@n1ru4l/graphql-live-query-patch-jsondiffpatch'
import { createClient as createWSClient } from 'graphql-ws'

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
const WS_URL = process.env.NEXT_PUBLIC_WS_ENDPOINT as string

const useUrqlClient = (options?: RequestInit) => {
    const { data: session } = useSession()
    const token = session?.access_token

    const sseClient = useMemo(
        () =>
            createSSEClient({
                url: SSE_URL,
                credentials: 'include',
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                },
                singleConnection: true,
                lazy: true,
            }),
        [token]
    )

    const wsClient = useMemo(() => createWSClient({
        url: WS_URL,
    }), [])

    return useMemo(() => {
        const client = createClient({
            url: GRAPHQL_ENDPOINT,
            exchanges: [
                // devtoolsExchange,
                cacheExchange({}) as Exchange,
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
                }) as Exchange,
                fetchExchange,
                ssr,
                subscriptionExchange({
                    isSubscriptionOperation: ({ query, variables }) => {
                        const definition = getOperationAST(query)
                        const isSubscription = definition?.kind === 'OperationDefinition' &&
                            definition.operation === 'subscription';

                        const isLiveQuery = !!definition && isLiveQueryOperationDefinitionNode(definition, variables as any)
                        return isSubscription || isLiveQuery;
                    },
                    forwardSubscription(operation) {
                        const definition = getOperationAST(gql`${operation.query}`)
                        const isLiveQuery = !!definition && isLiveQueryOperationDefinitionNode(definition, operation.variables as any)
                        return isLiveQuery ? ({
                            subscribe: (sink) => {
                                const source = makeAsyncIterableIteratorFromSink<ExecutionResult>(
                                    sink => {
                                        return wsClient.subscribe<ExecutionResult>(
                                            { ...operation, query: operation.query! },
                                            {
                                                next: sink.next.bind(sink) as any,
                                                complete: sink.complete.bind(sink),
                                                error: sink.error.bind(sink)
                                            }
                                        )
                                    }
                                )

                                const wsDispose = applyAsyncIterableIteratorToSink(
                                    applyLiveQueryJSONDiffPatch(source),
                                    sink
                                )

                                return {
                                    unsubscribe: wsDispose,
                                }
                            }
                        }) : ({
                            subscribe: (sink) => {
                                const dispose = sseClient.subscribe(
                                    operation as RequestParams,
                                    sink
                                )

                                return {
                                    unsubscribe: dispose
                                }
                            }

                        })
                    },
                    enableAllOperations: true
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
    }, [options?.headers, sseClient, wsClient, token])
}

export default useUrqlClient

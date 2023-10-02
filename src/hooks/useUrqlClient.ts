import { useMemo } from 'react'
import { devtoolsExchange } from '@urql/devtools'
import { AuthConfig, authExchange, AuthUtilities } from '@urql/exchange-auth'
import { cacheExchange } from '@urql/exchange-graphcache'
import { createClient as createSSEClient, RequestParams } from 'graphql-sse'
import { useSession } from 'next-auth/react'
import {
    createClient,
    fetchExchange,
    gql,
    ssrExchange,
    subscriptionExchange,
    TypedDocumentNode,
} from 'urql'

import { ConversationPopulated } from '../components/chat/ConversationList'
import {
    ConversationsDocument,
    ConversationsQuery,
} from '../generated/graphql-request'

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
                cacheExchange({
                    updates: {
                        Query: {
                            conversations(result, args, cache, info) {
                                const conversations = ConversationsDocument
                                return conversations
                            },
                        },
                        Mutation: {
                            // sendMessage(
                            //     result,
                            //     args,
                            //     cache,
                            //     info
                            // ){
                              
                            // },
                            markConversationAsReadMutation(
                                _result,
                                { userId },
                                cache,
                                _info
                            ) {
                                const participantsFragment: TypedDocumentNode<{
                                    participants: ConversationPopulated['participants']
                                }> = gql`
                                    fragment Participants on Conversation {
                                        participants {
                                            user {
                                                _id
                                                username
                                            }
                                            hasSeenLatestMessage
                                        }
                                    }
                                `
                                if (!participantsFragment) return

                                const participants = [
                                    ...(participantsFragment as any)
                                        .participants,
                                ]
                                const userParticipantIdx =
                                    participants.findIndex(
                                        (p) => (p.user._id = userId)
                                    )

                                if (userParticipantIdx === -1) return

                                const userParticipant =
                                    participants[userParticipantIdx]

                                participants[userParticipantIdx] = {
                                    ...userParticipant,
                                    hasSeenLatestMessage: true,
                                }

                                cache.writeFragment(participantsFragment, {
                                    participants,
                                })
                            },
                        },
                        Subscription: {
                            conversationUpdated(
                                result: any,
                                { userId },
                                cache,
                                _info
                            ) {
                                if (!result.conversationUpdated) return

                                const {
                                    conversationUpdated: {
                                        conversation: updatedConversation,
                                        addedUserIds,
                                        removedUserIds,
                                    },
                                } = result

                                const { _id: updatedConversationId } =
                                    updatedConversation

                                if (removedUserIds && removedUserIds.length) {
                                    const isBeingRemoved = removedUserIds.find(
                                        (id: string) => id === userId
                                    )

                                    if (isBeingRemoved) {
                                        const conversations =
                                            ConversationsDocument

                                        cache.updateQuery(
                                            {
                                                query: conversations,
                                            },
                                            (data: any) => {
                                                if (data)
                                                    data.conversations =
                                                        data?.conversations.filter(
                                                            (c: any) =>
                                                                c._id !==
                                                                updatedConversationId
                                                        )
                                                return data
                                            }
                                        )
                                    }
                                }

                                if (addedUserIds && addedUserIds.length) {
                                    const isBeingAdded = addedUserIds.find(
                                        (id: string) => id === userId
                                    )

                                    if (isBeingAdded) {
                                        const conversations =
                                            ConversationsDocument

                                        cache.updateQuery(
                                            {
                                                query: conversations,
                                            },
                                            (data) => {
                                                if (data)
                                                    data.conversations = [
                                                        ...((data.conversations as ConversationsQuery['conversations']) ||
                                                            []),
                                                        updatedConversation,
                                                    ]
                                                return data
                                            }
                                        )

                                        return
                                    }
                                }
                            },
                            conversationDeleted(result, _args, cache, _info) {
                                const { conversationDeleted } = result
                                if (!conversationDeleted) return

                                const conversations = ConversationsDocument

                                cache.updateQuery(
                                    { query: conversations },
                                    (data: ConversationsQuery | null) => {
                                        if (data)
                                            data.conversations =
                                                data?.conversations?.filter(
                                                    (
                                                        c: ConversationPopulated
                                                    ) =>
                                                        c._id !==
                                                        (
                                                            conversationDeleted as ConversationPopulated
                                                        )._id
                                                )

                                        return data
                                    }
                                )
                            },
                            conversationCreated(result, _args, cache, _info) {
                                const { conversationCreated } = result
                                if (!conversationCreated) return

                                const conversations = ConversationsDocument

                                cache.updateQuery(
                                    { query: conversations },
                                    (data: ConversationsQuery | null) => {
                                        if (data)
                                            data.conversations = [
                                                conversationCreated as ConversationPopulated,
                                                ...((data.conversations as ConversationsQuery['conversations']) ||
                                                    []),
                                            ]
                                        return data
                                    }
                                )
                            },
                        },
                    },
                }),
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

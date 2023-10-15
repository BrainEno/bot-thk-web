import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import {
    ConversationUpdatedSubscription,
    ConversationUpdatedDocument,
    ConversationUpdatedSubscriptionVariables,
    ConversationsQuery,
    MessagesQuery,
} from 'src/generated/graphql-request'
import { useClient } from 'urql'

export const useConversationUpdated = (
    conversationId: string,
    userId: string,
    onViewConversation: (
        conversationId: string,
        hasSeenLatestMessage: boolean
    ) => void
) => {
    const router = useRouter()
    const client = useClient()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!userId) return
        const conversationUpdatedSubscription = client
            .subscription<
                ConversationUpdatedSubscription,
                ConversationUpdatedSubscriptionVariables
            >(ConversationUpdatedDocument, {})
            .subscribe((res) => {
                if (res.data) {
                    console.log(
                        'conversation updated data:',
                        res.data.conversationUpdated
                    )

                    const subscriptionData = res.data
                    const {
                        conversationUpdated: {
                            conversation: updatedConversation,
                            addedUserIds,
                            removedUserIds,
                        },
                    } = subscriptionData

                    const { _id: updatedConversationId, latestMessage } =
                        updatedConversation

                    if (removedUserIds && removedUserIds.length) {
                        const isBeingRemoved = removedUserIds.find(
                            (id: string) => id === userId
                        )

                        if (isBeingRemoved) {
                            const exisitingConversations =
                                queryClient.getQueryData<ConversationsQuery>([
                                    'conversations',
                                ])

                            if (exisitingConversations) {
                                queryClient.setQueryData<ConversationsQuery>(
                                    ['conversations'],
                                    (oldData) => {
                                        if (oldData) {
                                            const newConversations =
                                                oldData.conversations.filter(
                                                    (c) =>
                                                        c._id !==
                                                        updatedConversationId
                                                )
                                            oldData.conversations =
                                                newConversations
                                        }
                                        return oldData
                                    }
                                )
                            }

                            if (conversationId === updatedConversationId) {
                                router.push(`/dashboard`)
                            }

                            return
                        }
                    }

                    if (addedUserIds && addedUserIds.length) {
                        const isBeingAdded = addedUserIds.find(
                            (id) => id === userId
                        )

                        if (isBeingAdded) {
                            const exisitingConversations =
                                queryClient.getQueryData<
                                    ConversationsQuery['conversations']
                                >(['conversations'])

                            if (!exisitingConversations) return

                            queryClient.setQueryData<ConversationsQuery>(
                                ['conversations'],
                                (oldData) => {
                                    if (oldData) {
                                        console.log(
                                            'oldData in conversationUpdatedSub:',
                                            oldData
                                        )
                                        const newConversations = [
                                            updatedConversation,
                                            ...oldData.conversations,
                                        ]
                                        oldData.conversations =
                                            newConversations as ConversationsQuery['conversations']
                                    }
                                    return oldData
                                }
                            )

                            if (updatedConversationId === conversationId) {
                                onViewConversation(conversationId, false)
                                return
                            }

                            const existingMesssages = queryClient.getQueryData<
                                MessagesQuery['messages']
                            >([
                                'messages',
                            ]) as unknown as MessagesQuery['messages']

                            if (!existingMesssages) return

                            const hasLatestMessage = existingMesssages.find(
                                (m) => m._id === latestMessage?._id
                            )

                            if (latestMessage && !hasLatestMessage) {
                                queryClient.setQueryData<MessagesQuery>(
                                    ['messages'],
                                    (oldData) => {
                                        console.log(
                                            'messages oldData in converationUpdated:',
                                            oldData
                                        )
                                        if (oldData) {
                                            const newMessages = [
                                                latestMessage as MessagesQuery['messages'][0],
                                                ...oldData.messages,
                                            ]
                                            oldData.messages = newMessages
                                        }
                                        return oldData
                                    }
                                )
                            }
                        }
                    }

                    queryClient.invalidateQueries(['messages', conversationId])
                    queryClient.invalidateQueries(['conversations'])
                }
                if (res.error) {
                    console.log(
                        'ConversationUpdated Subscription Error:',
                        res.error
                    )
                }
            })

        return () => {
            if (
                conversationUpdatedSubscription &&
                conversationUpdatedSubscription.unsubscribe
            )
                conversationUpdatedSubscription.unsubscribe()
        }
    }, [client, conversationId, userId, onViewConversation])
}

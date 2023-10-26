import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useClient } from 'urql'

import {
    ConversationCreatedDocument,
    ConversationCreatedSubscription,
    ConversationCreatedSubscriptionVariables,
    ConversationsQuery,
} from '../../generated/graphql-request'

export const useConversationCreated = (isAuth: boolean) => {
    const client = useClient()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!isAuth) return
        const conversationCreatedSubscription = client
            .subscription<
                ConversationCreatedSubscription,
                ConversationCreatedSubscriptionVariables
            >(ConversationCreatedDocument, {})
            .subscribe((res) => {
                if (res.data) {
                    console.log(
                        'conversation created data:',
                        res.data.conversationCreated
                    )

                    const newConversation = res.data.conversationCreated

                    queryClient.setQueryData<ConversationsQuery>(
                        ['conversations'],
                        (oldData) => {
                            if (oldData) {
                                console.log('oldData in Created sub:', oldData)
                                oldData.conversations.unshift(
                                    newConversation as unknown as ConversationsQuery['conversations'][0]
                                )
                                console.log('new data:', oldData.conversations)
                            }
                            return oldData
                        }
                    )
                }

                if (res.error) {
                    console.log(
                        'ConversationCreated Subcription Error:',
                        res.error
                    )
                }
            })

        return () => {
            if (conversationCreatedSubscription) {
                console.log('conversationCreatedSubscription unsubscribed')
                conversationCreatedSubscription.unsubscribe()
            }
        }
    }, [client, queryClient, isAuth])
}

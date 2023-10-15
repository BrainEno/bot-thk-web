import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import {
    ConversationDeletedDocument,
    ConversationDeletedSubscription,
    ConversationDeletedSubscriptionVariables,
    ConversationsQuery,
} from 'src/generated/graphql-request'
import { useClient } from 'urql'

export const useConversationDeleted = (isAuth: boolean) => {
    const client = useClient()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!isAuth) return
        const conversationDeletedSubscription = client
            .subscription<
                ConversationDeletedSubscription,
                ConversationDeletedSubscriptionVariables
            >(ConversationDeletedDocument, {})
            .subscribe((res) => {
                console.log('ConversationDeletedSubscription Settled:', res)
                const subscriptionData = res.data

                if (!subscriptionData) return

                console.log(
                    'ConversationDeletedSubscription Data:',
                    subscriptionData
                )

                const existingConversations = queryClient.getQueryData<
                    ConversationsQuery['conversations']
                >(['conversations'])

                if (!existingConversations) return

                const {
                    conversationDeleted: { _id: deletedConversationId },
                } = subscriptionData

                queryClient.setQueryData<ConversationsQuery>(
                    ['conversations'],
                    (oldData) => {
                        if (oldData) {
                            const newConversations =
                                oldData.conversations.filter(
                                    (c) => c._id !== deletedConversationId
                                )

                            oldData.conversations = newConversations
                        }
                        return oldData
                    }
                )

                if (res.error) {
                    console.log(
                        'ConversationDleleted Subcription Error:',
                        res.error
                    )
                }
            })

        return () => {
            if (conversationDeletedSubscription)
                conversationDeletedSubscription.unsubscribe()
        }
    }, [client, isAuth])
}

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery, useSubscription } from 'urql'

import { ConversationContent } from '../../components/chat/ConversationContent'
import ConversationList from '../../components/chat/ConversationList'
import SkeletonLoader from '../../components/common/SkeletonLoader'
import {
    ConversationCreatedDocument,
    ConversationCreatedSubscription,
    ConversationCreatedSubscriptionVariables,
    ConversationDeletedDocument,
    ConversationDeletedSubscription,
    ConversationDeletedSubscriptionVariables,
    ConversationsDocument,
    ConversationUpdatedDocument,
    ConversationUpdatedSubscription,
    ConversationUpdatedSubscriptionVariables,
    MarkConversationAsReadDocument,
    MarkConversationAsReadMutation,
    MarkConversationAsReadMutationVariables,
} from '../../generated/graphql-request'
import { useAuthStore } from '../../hooks/store/useAuthStore'

const Conversations = () => {
    const [{ data, fetching }] = useQuery({ query: ConversationsDocument })
    const conversations = data?.conversations
    const userId = useAuthStore((state) => state.user?._id)
    const router = useRouter()
    const { conversationId } = router.query

    /**
     * Mutations
     */
    const [_res, markConversationAsReadMutation] = useMutation<
        MarkConversationAsReadMutation,
        MarkConversationAsReadMutationVariables
    >(MarkConversationAsReadDocument)

    /**
     * Subscriptions
     */
    useSubscription<
        ConversationUpdatedSubscription,
        ConversationUpdatedSubscription['conversationUpdated'],
        ConversationUpdatedSubscriptionVariables
    >({
        query: ConversationUpdatedDocument,
    })

    const [conversationDeletedResult, conversationDeletedSubscription] =
        useSubscription<
            ConversationDeletedSubscription,
            ConversationDeletedSubscription['conversationDeleted'],
            ConversationDeletedSubscriptionVariables
        >({
            query: ConversationDeletedDocument,
        })

    const [conversationCreatedResult, conversationCreatedSubscription] =
        useSubscription<
            ConversationCreatedSubscription,
            ConversationCreatedSubscription['conversationCreated'],
            ConversationCreatedSubscriptionVariables
        >({ query: ConversationCreatedDocument })

    const subscribeToNewConversations = () => {
        if (!conversationCreatedResult.data) return
    }

    const onViewConversation = async (
        conversationId: string,
        hasSeenLatestMessage: boolean
    ) => {
        router.push(`/conversation/${conversationId}`)
        if (hasSeenLatestMessage) return
        try {
            await markConversationAsReadMutation({
                userId,
                conversationId,
            })
        } catch (error) {
            console.log('onViewConversation error', error)
        }
    }

    useEffect(() => {
        subscribeToNewConversations()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="conversation-page">
            <div className="conversation">
                {fetching || !conversations ? (
                    <SkeletonLoader height={80} width={360} count={7} />
                ) : (
                    <ConversationList
                        userId={userId}
                        conversations={conversations}
                        onViewConversation={onViewConversation}
                    />
                )}
                <ConversationContent />
            </div>
        </div>
    )
}

export default Conversations

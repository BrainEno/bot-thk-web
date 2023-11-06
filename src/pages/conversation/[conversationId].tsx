import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import { ConversationContent } from '../../components/chat/ConversationContent'
import ConversationList from '../../components/chat/ConversationList'
import SkeletonLoader from '../../components/common/SkeletonLoader'
import ConversationModalProvider from '../../components/context/ModalContext'
import { useMarkConversationAsReadMutation } from '../../hooks/mutation/useMarkConversationAsReadMutation'
import { useConversationsQuery } from '../../hooks/query/useConversationsQuery'
import { useConversationUpdated } from '../../hooks/subscriptions/useConversationUpdated'

const Conversations = () => {
    const { data: session } = useSession()
    const userId = session?.user.id || ''
    const router = useRouter()
    const { conversationId } = router.query
    const { conversations } = useConversationsQuery({
        enabled: !!userId && !!conversationId,
    })

    const markConversationAsReadMutation = useMarkConversationAsReadMutation()

    const onViewConversation = async (
        conversationId: string,
        hasSeenLatestMessage: boolean
    ) => {
        router.push({
            pathname: '/conversation/[conversationId]',
            query: { conversationId },
        })
        if (hasSeenLatestMessage) return
        try {
            await markConversationAsReadMutation.mutateAsync({
                userId,
                conversationId,
            })
        } catch (error) {
            console.log('onViewConversation error', error)
        }
    }

    /**
     * Subscriptions
     */
    useConversationUpdated(conversationId as string, userId, onViewConversation)

    return (
        <div className="conversation-page">
            <ConversationModalProvider>
                <div className="conversation">
                    {!conversations ? (
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
            </ConversationModalProvider>
        </div>
    )
}

export default Conversations

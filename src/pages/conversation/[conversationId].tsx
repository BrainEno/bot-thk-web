import { useRouter } from 'next/router'

import { ConversationContent } from '../../components/chat/ConversationContent'
import ConversationList from '../../components/chat/ConversationList'
import SkeletonLoader from '../../components/common/SkeletonLoader'

import { useConversationsQuery } from 'src/hooks/query/useConversationsQuery'
import { useMarkConversationAsReadMutation } from 'src/hooks/mutation/useMarkConversationAsReadMutation'

import { useSession } from 'next-auth/react'
import { useConversationUpdated } from 'src/hooks/subscriptions/useConversationUpdated'
import ConversationModalProvider from 'src/components/context/ModalContext'

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
        router.push(`/conversation/${conversationId}`)
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

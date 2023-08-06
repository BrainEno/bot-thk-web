import { useRouter } from 'next/router'

import { ConversationContent } from '../../components/chat/ConversationContent'
import ConversationList from '../../components/chat/ConversationList'
import { useConversationsQuery } from '../../hooks/query/useConversationsQuery'
import { useAuthStore } from '../../hooks/store/useAuthStore'

const Conversations = () => {
    const router = useRouter()
    const conversationId = router.query.conversationId as string
    const user = useAuthStore((state) => state.user)
    const userId = user?._id?.toString()

    const { conversations } = useConversationsQuery({
        enabled: !!conversationId,
    })

    return (
        <div className="conversation-page">
            <div className="conversation">
                <ConversationList
                    conversations={conversations!}
                    curUserId={userId}
                />

                <ConversationContent
                    conversationId={conversationId}
                    curUserId={userId}
                />
            </div>
        </div>
    )
}

export default Conversations

import { useRouter } from 'next/router'

import { ConversationsQuery } from '../../generated/graphql-request'

import { ConversationListItem } from './ConversationListItem'

interface ConversationListProps {
    conversations: Partial<ConversationsQuery['conversations']>
}

const ConversationList = ({ conversations }: ConversationListProps) => {
    const router = useRouter()
    const conversationId = router.query.conversationId as string
    return (
        <div className="conversation-list">
            {conversations &&
                conversations.map((c) => (
                    <ConversationListItem
                        key={c?._id}
                        conversation={c!}
                        selectedConversationId={conversationId}
                    />
                ))}
        </div>
    )
}
export default ConversationList

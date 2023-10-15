import { useMessagesQuery } from '../../hooks/query/useMessagesQuery'

import { MessageItem } from './MessageItem'

interface ConversationMessagesProps {
    curUserId: string
    conversationId: string
}

export const ConversationMessages = ({
    curUserId,
    conversationId,
}: ConversationMessagesProps) => {
    const messages = useMessagesQuery({
        enabled: !!conversationId,
        conversationId,
    })
    return (
        <div className="messages">
            {messages &&
                messages.map((m) => (
                    <MessageItem
                        key={m._id}
                        message={m}
                        sentByMe={m.senderId === curUserId}
                    />
                ))}
        </div>
    )
}

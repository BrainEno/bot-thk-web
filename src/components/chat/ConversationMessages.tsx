import { useQuery } from 'urql'
import { useMessagesQuery } from '../../hooks/query/useMessagesQuery'

import { MessageItem } from './MessageItem'
import {
    MessagesQuery,
    MessagesQueryVariables,
} from '../../generated/graphql-request'
import { MessagesDocument } from '../../generated/gql/graphql'

interface ConversationMessagesProps {
    curUserId: string
    conversationId: string
}

export const ConversationMessages = ({
    curUserId,
    conversationId,
}: ConversationMessagesProps) => {
    // const messages = useMessagesQuery({
    //     enabled: !!conversationId,
    //     conversationId,
    // })
    const [{ data }] = useQuery<MessagesQuery, MessagesQueryVariables>({
        query: MessagesDocument,
        variables: { conversationId },
        pause: !conversationId,
    })

    return (
        <div className="messages">
            {data &&
                data?.messages &&
                data.messages.map((m) => (
                    <MessageItem
                        key={m._id}
                        message={m}
                        sentByMe={m.senderId === curUserId}
                    />
                ))}
        </div>
    )
}

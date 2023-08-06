import { ConversationsQuery } from '../../generated/graphql-request'

import { ConversationListItem } from './ConversationListItem'

interface ConversationListProps {
    conversations: Partial<ConversationsQuery['conversations']>
}

const ConversationList = ({
    conversations,
}: ConversationListProps) => {
    return (
        <div className="conversation-list">
            {conversations &&
                conversations.map((c) => (
                    <ConversationListItem key={c?._id} conversation={c!} />
                ))}
        </div>
    )
}
export default ConversationList

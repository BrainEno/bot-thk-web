import { useMemo } from 'react'
import classNames from 'classnames'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { ConversationsQuery } from '../../generated/gql/graphql'
import { useAuthStore } from '../../hooks/store/useAuthStore'
import { DEFAULT_AVATAR } from '../dashboard/FollowInfoList'

interface ConversationListItemProps {
    conversation: NonNullable<ConversationsQuery['conversations'][0]>
}

export const ConversationListItem = ({
    conversation,
}: ConversationListItemProps) => {
    const curUserId = useAuthStore((state) => state.user?._id)
    const router = useRouter()

    const otherParticipants = useMemo(
        () =>
            conversation.participants.filter((p) => p.userId !== curUserId) ||
            [],
        [conversation, curUserId]
    )

    const selectConversation = (id: string) => {
        router.push(`/conversation/${id}`)
    }

    return (
        <div
            key={conversation._id}
            onClick={() => selectConversation(conversation._id)}
            className={classNames('conversation-list-item', {
                selected: conversation._id === router.query.conversationId,
            })}
        >
            <div className="avatars">
                {otherParticipants.map((p, i) => (
                    <Image
                        key={p._id.toString()}
                        className="avatar"
                        alt={p.user.name}
                        src={p?.user?.photo || DEFAULT_AVATAR}
                        width={30}
                        height={30}
                        style={{
                            transform: `translateX(${i * 12}px)`,
                            zIndex: (otherParticipants.length - i) * 1,
                        }}
                    />
                ))}
            </div>
            <div>
                {otherParticipants.map((p, i) => (
                    <span key={p._id}>
                        {p.user.name}{' '}
                        {i === otherParticipants.length - 1 ? '' : ', '}
                    </span>
                ))}
            </div>
        </div>
    )
}

import { useEffect, useMemo } from 'react'
import { MdDeleteOutline } from 'react-icons/md'
import { useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { ConversationsQuery } from '../../generated/gql/graphql'
import { useDeleteConversationMutation } from '../../hooks/mutation/useDeleteConversationMutation'
import { useAuthStore } from '../../hooks/store/useAuthStore'
import { DEFAULT_AVATAR } from '../dashboard/FollowInfoList'

interface ConversationListItemProps {
    conversation: NonNullable<ConversationsQuery['conversations'][0]>
    selectedConversationId: string
}

export const ConversationListItem = ({
    conversation,
    selectedConversationId,
}: ConversationListItemProps) => {
    const queryClient = useQueryClient()
    const curUserId = useAuthStore((state) => state.user?._id)
    const router = useRouter()

    const otherParticipants = conversation.participants.filter(
        (p) => p.userId !== curUserId
    )

    const selectConversation = () => {
        queryClient.invalidateQueries(['messages'])
        router.push(`/conversation/${conversation._id}`)
    }

    const deleteConversationMutation = useDeleteConversationMutation()


    return (
        <div
            key={conversation._id}
            onClick={selectConversation}
            className={classNames('conversation-list-item', {
                selected: conversation._id === selectedConversationId,
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
            <button
                onClick={() =>
                    deleteConversationMutation.mutate({
                        conversationId: conversation._id,
                    })
                }
            >
                <MdDeleteOutline fontSize={20} />
            </button>
        </div>
    )
}

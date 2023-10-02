import { useState } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { MdDeleteOutline } from 'react-icons/md'
import { useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { ConversationsQuery } from '../../generated/gql/graphql'
import { useDeleteConversationMutation } from '../../hooks/mutation/useDeleteConversationMutation'
import { useAuthStore } from '../../hooks/store/useAuthStore'
import { DEFAULT_AVATAR } from '../dashboard/FollowInfoList'

import { ConversationPopulated } from './ConversationList'

interface ConversationListItemProps {
    conversation: NonNullable<ConversationsQuery['conversations'][0]>
    selectedConversationId: string
    userId: string
    onClick: () => void
    onEditConversation: () => void
    hasSeenLatestMessage?: boolean
    onDeleteConversation?: (conversationId: string) => void
    onLeaveConversation?: (conversation: ConversationPopulated) => void
}

export const ConversationListItem = ({
    conversation,
    selectedConversationId,
    userId,
    onClick,
    onDeleteConversation,
    onEditConversation,
    onLeaveConversation,
}: ConversationListItemProps) => {
    const [showOperations, setShowOperations] = useState(false)

    const otherParticipants = conversation.participants.filter(
        (p) => p.userId !== userId
    )

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault()
        setShowOperations(true)
    }


    return (
        <div
            key={conversation._id}
            onClick={onClick}
            onContextMenu={handleContextMenu}
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
            {showOperations && (
                <div className="operations">
                    <div
                        className="operation-edit"
                        onClick={(event) => {
                            event.stopPropagation()
                            onEditConversation()
                        }}
                    >
                        <AiOutlineEdit />
                    </div>
                    {conversation.participants.length > 2 ? (
                        <div
                            onClick={(event) => {
                                event.stopPropagation()
                                if (onLeaveConversation) {
                                    onLeaveConversation(conversation)
                                }
                            }}
                            className="operation-delete"
                        >
                            <MdDeleteOutline
                                className="delete-icon"
                                fontSize={20}
                            />
                        </div>
                    ) : (
                        <div
                            onClick={(event) => {
                                event.stopPropagation()
                                if (onDeleteConversation)
                                    onDeleteConversation(conversation._id)
                            }}
                            className="operation-delete"
                        >
                            <MdDeleteOutline
                                className="delete-icon"
                                fontSize={20}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

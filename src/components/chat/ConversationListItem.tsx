import { useEffect, useState } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { MdDeleteOutline } from 'react-icons/md'
import classNames from 'classnames'
import Image from 'next/image'
import { DEFAULT_AVATAR } from '../dashboard/FollowInfoList'
import { PopulatedConversation } from '../../generated/graphql-request'

interface ConversationListItemProps {
    conversation: PopulatedConversation
    userId: string
    onClick: () => void
    onEditConversation?: () => void
    hasSeenLatestMessage?: boolean
    selectedConversationId?: string
    onDeleteConversation?: (conversationId: string) => void
    onLeaveConversation?: (conversation: PopulatedConversation) => void
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
        setShowOperations(!showOperations)
    }

    const handleLeftClick = () => {
        onClick()
        if (showOperations) {
            setShowOperations(false)
        }
    }
    useEffect(() => {
        if (selectedConversationId !== conversation._id) {
            setShowOperations(false)
        }
    }, [selectedConversationId])

    return (
        <div
            key={conversation._id}
            onClick={handleLeftClick}
            onContextMenu={handleContextMenu}
            className={classNames('conversation-list-item', {
                selected: conversation._id === selectedConversationId,
            })}
        >
            <div className="avatars">
                {otherParticipants.length < 3 ? (
                    otherParticipants.map((p, i) => (
                        <Image
                            key={p._id.toString()}
                            className="avatar"
                            alt={p.user.name}
                            src={p?.user?.photo || DEFAULT_AVATAR}
                            width={40}
                            height={40}
                            style={{
                                transform: `translateX(${i * 12}px)`,
                                zIndex: (otherParticipants.length - i) * 1,
                            }}
                        />
                    ))
                ) : (
                    <>
                        {otherParticipants.slice(0, 2).map((p, i) => (
                            <Image
                                key={p._id.toString()}
                                className="avatar"
                                alt={p.user.name}
                                src={p?.user?.photo || DEFAULT_AVATAR}
                                width={40}
                                height={40}
                                style={{
                                    transform: `translateX(${i * 12}px)`,
                                    zIndex: (otherParticipants.length - i) * 1,
                                }}
                            />
                        ))}
                        <div className="avatar-size">
                            {otherParticipants.length}
                        </div>
                    </>
                )}
            </div>
            <div className="conversation-info">
                {otherParticipants.map((p, i) => (
                    <span className="username" key={p._id}>
                        {p.user.name}{' '}
                        {i === otherParticipants.length - 1 ? '' : ', '}
                    </span>
                ))}
                {conversation.latestMessage && (
                    <div className="latest-message">
                        <span className="sender">
                            {conversation.latestMessage.sender.name} :
                        </span>
                        <span className="content">
                            {conversation.latestMessage.body}
                        </span>
                    </div>
                )}
            </div>

            {showOperations && (
                <div className="operations">
                    <div
                        className="operation-edit"
                        onClick={(event) => {
                            event.stopPropagation()
                            if (onEditConversation) onEditConversation()
                        }}
                    >
                        <AiOutlineEdit className="edit-icon" fontSize={20} />
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

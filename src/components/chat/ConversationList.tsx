import { useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from 'urql'

import {
    ConversationsQuery,
    DeleteConversationDocument,
    DeleteConversationMutation,
    DeleteConversationMutationVariables,
    UpdateParticipantsDocument,
    UpdateParticipantsMutation,
    UpdateParticipantsMutationVariables,
} from '../../generated/graphql-request'
import { getErrorMsg } from '../../helpers/getErrorMsg'
import { showAlert } from '../common/Alert'

import { ConversationListItem } from './ConversationListItem'

export type ConversationPopulated = NonNullable<
    ConversationsQuery['conversations']
>[0]

interface ConversationListProps {
    userId: string
    conversations: Partial<ConversationsQuery['conversations']>
    onViewConversation: (
        conversationId: string,
        hasSeenLatestMessage: boolean
    ) => void
}

const ConversationList = ({
    userId,
    conversations,
    onViewConversation,
}: ConversationListProps) => {
    const [editingConversation, setEditingConversation] =
        useState<ConversationPopulated | null>(null)
    const [errorMsg, setErrorMsg] = useState('')

    const router = useRouter()
    const conversationId = router.query.conversationId as string

    /**
     * Mutations
     */
    const [updateParticipantsResult, updateParticipants] = useMutation<
        UpdateParticipantsMutation,
        UpdateParticipantsMutationVariables
    >(UpdateParticipantsDocument)

    const [deleteConversationResult, deleteConversation] = useMutation<
        DeleteConversationMutation,
        DeleteConversationMutationVariables
    >(DeleteConversationDocument)

    const onLeaveConversation = async (conversation: ConversationPopulated) => {
        const participantIds = conversation.participants
            .filter((p) => p.userId !== userId)
            .map((p) => p.userId)

        try {
            const { data, error } = await updateParticipants({
                participantIds,
                conversationId: conversation._id,
            })

            if (!data || error) {
                throw new Error('Failed to update participants')
            }
        } catch (error) {
            console.log('onUpdateConversation error', error)
            setErrorMsg(getErrorMsg(error))
        }
    }

    const onDeleteConversation = async (conversationId: string) => {
        try {
            deleteConversation({
                conversationId,
            }).then((res) => {
                if (res.data?.deleteConversation) router.push('/')
            })
        } catch (error) {
            console.log('onDeleteConversation error', error)
        }
    }

    const getUserParticipantObject = (
        conversation: ConversationsQuery['conversations'][0]
    ) => {
        return conversation.participants.find((p) => p.userId === userId)
    }

    const onEditConversation = (conversation: ConversationPopulated) => {
        setEditingConversation(conversation)
    }

    return (
        <div className="conversation-list">
            {showAlert(errorMsg, 'error')}
            {!!conversations.length &&
                conversations.map((conversation) => {
                    const participant = getUserParticipantObject(conversation!)
                    const hasSeenLatestMessage =
                        participant?.hasSeenLatestMessage || false

                    return (
                        <ConversationListItem
                            key={conversation?._id}
                            userId={userId}
                            conversation={conversation!}
                            onClick={() =>
                                onViewConversation(
                                    conversation?._id,
                                    hasSeenLatestMessage
                                )
                            }
                            onEditConversation={() =>
                                onEditConversation(conversation!)
                            }
                            onLeaveConversation={onLeaveConversation}
                            onDeleteConversation={onDeleteConversation}
                            selectedConversationId={conversationId}
                        />
                    )
                })}
        </div>
    )
}
export default ConversationList

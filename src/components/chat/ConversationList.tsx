import { useContext, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'

import {
    ConversationsQuery,
    PopulatedConversation,
    PopulatedParticipant,
} from '../../generated/graphql-request'
import { getErrorMsg } from '../../helpers/getErrorMsg'
import { transformDateFormatStringToNumber } from '../../helpers/transformDateFormatStringToNumber'
import { useDeleteConversationMutation } from '../../hooks/mutation/useDeleteConversationMutation'
import { useUpdateParticipantsMuation } from '../../hooks/mutation/useUpdateParticipantsMutation'
import { showAlert } from '../common/Alert'
import Modal from '../common/Modal'
import { IModalContext, ModalContext } from '../context/ModalContext'

import { ConversationListItem } from './ConversationListItem'
import ConversationModal from './ConversationModal'

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
    const queryClient = useQueryClient()
    const { modalOpen, openModal, closeModal } =
        useContext<IModalContext>(ModalContext)

    const [editingConversation, setEditingConversation] =
        useState<PopulatedConversation | null>(null)
    const [errorMsg, setErrorMsg] = useState('')
    const [showDelModal, setShowDelModal] = useState(false)
    const [conversationToDel, setConversationToDel] = useState('')

    const router = useRouter()
    const conversationId = router.query.conversationId as string
    // console.log(conversationId)
    /**
     * Mutations
     */
    const deleteConversationMutation = useDeleteConversationMutation()
    const updateParticipantsMutation = useUpdateParticipantsMuation()

    const handleConfirmDel = () => {
        deleteConversationMutation.mutate({
            conversationId: conversationToDel,
        })
        setShowDelModal(false)
        queryClient.invalidateQueries({
            queryKey: ['conversations', 'messages'],
        })
        router.push({ pathname: '/dashboard' })
    }

    const handleCancelDel = () => {
        setShowDelModal(false)
    }

    const onLeaveConversation = async (conversation: PopulatedConversation) => {
        const participantIds = conversation.participants
            .filter((p) => p.userId !== userId)
            .map((p) => p.userId)

        try {
            const res = await updateParticipantsMutation.mutateAsync({
                participantIds,
                conversationId: conversation._id,
            })

            if (!res.updateParticipants) {
                throw new Error('Failed to update participants')
            }
        } catch (error) {
            console.log('onUpdateConversation error', error)
            setErrorMsg(getErrorMsg(error))
        }
    }

    const onDeleteConversation = (conversationId: string) => {
        setConversationToDel(conversationId)
        setShowDelModal(true)
    }

    const getUserParticipantObject = (conversation: PopulatedConversation) => {
        return conversation.participants.find(
            (p) => p.userId === userId
        ) as PopulatedParticipant
    }

    const onEditConversation = (conversation: PopulatedConversation) => {
        setEditingConversation(conversation)
        openModal()
    }

    const toggleClose = () => {
        setEditingConversation(null)
        closeModal()
    }

    const sortedConversations = (
        [...conversations] as unknown as Array<PopulatedConversation>
    ).sort(
        (a, b) =>
            transformDateFormatStringToNumber(b!.updatedAt as string) -
            transformDateFormatStringToNumber(a!.updatedAt as string)
    ) as Array<PopulatedConversation>

    return (
        <div className="conversation-list">
            {showAlert(errorMsg, 'error')}
            {showDelModal && (
                <Modal
                    onClose={() => setShowDelModal(false)}
                    title={`删除会话`}
                    closeOnClickOutside
                >
                    <p>确定要删除会话吗？</p>
                    <div className="Modal__footer">
                        <button onClick={handleConfirmDel}>确定</button>
                        <button onClick={handleCancelDel}>取消</button>
                    </div>
                </Modal>
            )}
            <ConversationModal
                conversations={sortedConversations}
                isOpen={modalOpen}
                onClose={toggleClose}
                userId={userId}
                editingConversation={editingConversation}
                onViewConversation={onViewConversation}
                getUserParticipantObject={getUserParticipantObject}
            />
            {!!sortedConversations.length &&
                sortedConversations.map((conversation) => {
                    const participant = getUserParticipantObject(conversation!)
                    const hasSeenLatestMessage =
                        participant?.hasSeenLatestMessage || false

                    return (
                        <ConversationListItem
                            key={conversation?._id}
                            userId={userId}
                            conversation={
                                conversation as unknown as PopulatedConversation
                            }
                            onClick={() => {
                                onViewConversation(
                                    conversation?._id,
                                    hasSeenLatestMessage
                                )
                                queryClient.invalidateQueries({
                                    queryKey: ['messages'],
                                })
                            }}
                            onEditConversation={() =>
                                onEditConversation(
                                    conversation as unknown as PopulatedConversation
                                )
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

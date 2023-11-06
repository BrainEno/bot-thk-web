import { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'

import {
    PopulatedConversation,
    PopulatedParticipant,
    PopulatedUser,
    SearchUsersDocument,
    SearchUsersQuery,
    SearchUsersQueryVariables,
} from '../../generated/graphql-request'
import { fetcher } from '../../graphql/gqlClient'
import { useCreateConversationMutation } from '../../hooks/mutation/useCreateConversationMutation'
import { useUpdateParticipantsMuation } from '../../hooks/mutation/useUpdateParticipantsMutation'
import { showAlert } from '../common/Alert'
import Modal from '../common/Modal'

import { ConversationListItem } from './ConversationListItem'
import Participants from './Participants'
import UserList from './UserList'

interface ConversationModalProps {
    isOpen: boolean
    onClose: () => void
    userId: string
    conversations: Array<PopulatedConversation>
    editingConversation: PopulatedConversation | null
    onViewConversation: (
        conversationId: string,
        hasSeenLatestMessage: boolean
    ) => void
    getUserParticipantObject: (
        conversation: PopulatedConversation
    ) => PopulatedParticipant
}

const ConversationModal: React.FC<ConversationModalProps> = ({
    isOpen,
    onClose,
    userId,
    conversations,
    editingConversation,
    onViewConversation,
    getUserParticipantObject,
}) => {
    const [username, setUsername] = useState('')
    const [error, setError] = useState()
    const [info, setInfo] = useState('')
    const [participants, setParticipants] = useState<Array<PopulatedUser>>([])
    const [startSearch, setStartSearch] = useState(false)

    const [existingConversation, setExistingConversation] =
        useState<PopulatedConversation | null>(null)

    const router = useRouter()

    const {
        refetch: searchUsers,
        data: searchUsersData,
        error: searchUsersError,
    } = useQuery<SearchUsersQuery, Error, SearchUsersQuery['searchUsers']>({
        queryKey: ['searchUsers', username],
        queryFn: fetcher<SearchUsersQuery, SearchUsersQueryVariables>(
            SearchUsersDocument,
            { name: username }
        ),
        enabled: !userId && startSearch,
        refetchOnWindowFocus: false,
        select: (data) => data.searchUsers,
    })

    const createConversationMutation = useCreateConversationMutation()

    const updateParticipantsMutation = useUpdateParticipantsMuation()

    const onSubmit = () => {
        if (!participants.length) return

        const participantIds = participants.map((p) => p._id)

        const existing = findExistingConversation(participantIds)

        if (existing) {
            setInfo('Conversation already exists')
            setExistingConversation(existing)
            return
        }

        /**
         * Determine which function to call
         */
        editingConversation
            ? onUpdateConversation(editingConversation)
            : onCreateConversation()
    }

    /**
     * Verifies that a conversation with selected
     * participants does not already exist
     */
    const findExistingConversation = (participantIds: Array<string>) => {
        let existingConversation: PopulatedConversation | null = null

        for (const conversation of conversations) {
            const addedParticipants = conversation.participants.filter(
                (p) => p.user._id !== userId
            )

            if (addedParticipants.length !== participantIds.length) {
                continue
            }

            let allMatchingParticipants = false
            for (const participant of addedParticipants) {
                const foundParticipant = participantIds.find(
                    (p) => p === participant.user._id
                )

                if (!foundParticipant) {
                    allMatchingParticipants = false
                    break
                }

                /**
                 * If we hit here,
                 * all match
                 */
                allMatchingParticipants = true
            }

            if (allMatchingParticipants) {
                existingConversation = conversation
            }
        }

        return existingConversation
    }

    const onCreateConversation = async () => {
        const participantUserIds = [userId, ...participants.map((p) => p._id)]

        try {
            const data = await createConversationMutation.mutateAsync({
                participantUserIds,
            })

            if (!data?.createConversation || createConversationMutation.error) {
                throw new Error('Failed to create conversation')
            }

            const { createConversation: conversationId } = data
            router.push({
                pathname: '/conversation/[conversationId]',
                query: { conversationId },
            })

            /**
             * Clear state and close modal
             * on successful creation
             */
            setParticipants([])
            setUsername('')
            onClose()
        } catch (error: any) {
            console.log('createConversations error', error)
            setError(error?.message)
        }
    }

    const onUpdateConversation = async (
        conversation: PopulatedConversation
    ) => {
        const participantIds = participants.map((p) => p._id)

        try {
            const data = await updateParticipantsMutation.mutateAsync({
                conversationId: conversation._id,
                participantIds,
            })

            if (!data?.updateParticipants || updateParticipantsMutation.error) {
                throw new Error('Failed to update participants')
            }

            /**
             * Clear state and close modal
             * on successful update
             */
            setParticipants([])
            setUsername('')
            onClose()
        } catch (error) {
            console.log('onUpdateConversation error', error)
            console.error('Failed to update participants')
        }
    }

    const onSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setStartSearch(true)
        searchUsers()
        setStartSearch(false)
    }

    const addParticipant = (user: PopulatedUser) => {
        setParticipants((prev) => [...prev, user])
        setUsername('')
    }

    const removeParticipant = (userId: string) => {
        setParticipants((prev) => prev.filter((u) => u._id !== userId))
    }

    const onConversationClick = () => {
        if (!existingConversation) return

        const { hasSeenLatestMessage } =
            getUserParticipantObject(existingConversation)

        onViewConversation(existingConversation._id, hasSeenLatestMessage)
        onClose()
    }

    /**
     * If a conversation is being edited,
     * update participant state to be that
     * conversations' participants
     */
    useEffect(() => {
        if (editingConversation) {
            setParticipants(
                editingConversation.participants.map(
                    (p) => p.user as PopulatedUser
                )
            )
            return
        }
    }, [editingConversation])

    /**
     * Reset existing conversation state
     * when participants added/removed
     */
    useEffect(() => {
        setExistingConversation(null)
    }, [participants])

    /**
     * Clear participant state if closed
     */
    useEffect(() => {
        if (!isOpen) {
            setParticipants([])
        }
    }, [isOpen])

    if (searchUsersError) {
        console.error('Error searching for users')
        return null
    }

    return (
        <>
            {info && showAlert(info, 'info')}
            {error && showAlert(error, 'error')}
            {isOpen && (
                <Modal onClose={onClose} title="编辑聊天成员">
                    <div className="conversation-modal-body">
                        <form onSubmit={onSearch}>
                            <div className="search-users">
                                <input
                                    placeholder="添加成员"
                                    onChange={(event) =>
                                        setUsername(event.target.value)
                                    }
                                    value={username}
                                    className="search-input"
                                />
                                <button
                                    type="submit"
                                    disabled={!username}
                                    className="search-btn"
                                >
                                    <AiOutlineSearch size={24} />
                                </button>
                            </div>
                        </form>
                        {searchUsersData && (
                            <UserList
                                users={searchUsersData as PopulatedUser[]}
                                participants={participants}
                                addParticipant={addParticipant}
                            />
                        )}
                        {participants.length !== 0 && (
                            <>
                                <Participants
                                    participants={participants.filter(
                                        (p) => p._id !== userId
                                    )}
                                    removeParticipant={removeParticipant}
                                />
                                <div>
                                    {existingConversation && (
                                        <ConversationListItem
                                            userId={userId}
                                            conversation={
                                                existingConversation as unknown as PopulatedConversation
                                            }
                                            onClick={() =>
                                                onConversationClick()
                                            }
                                            selectedConversationId={''}
                                        />
                                    )}
                                </div>
                            </>
                        )}
                        <div className="conversation-modal-bottom">
                            <button
                                className="conversation-modal-btn submit"
                                onClick={onSubmit}
                            >
                                确认
                            </button>
                            <button
                                className="conversation-modal-btn cancel"
                                onClick={onClose}
                            >
                                取消
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    )
}
export default ConversationModal

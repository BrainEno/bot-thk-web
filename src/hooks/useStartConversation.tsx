import { useState } from 'react'
import { useRouter } from 'next/router'

import { useCreateConversationMutation } from './mutation/useCreateConversationMutation'
import { useConversationsQuery } from './query/useConversationsQuery'
import { useAuthStore } from './store/useAuthStore'

export const useStartConversation = () => {
    const curUserId = useAuthStore((state) => state.user?._id)
    const router = useRouter()
    const [error, setError] = useState('')
    const { conversations, isSuccess } = useConversationsQuery()

    const createConversationMutation = useCreateConversationMutation((data) => {
        const conversationId = data.createConversation
        router.push({
            pathname: '/conversation/[conversationId]',
            query: { conversationId },
        })
    })

    const createConversation = (userId: string) => {
        if (conversations && isSuccess) {
            const existConversation = conversations.find(
                (c) =>
                    userId !== curUserId &&
                    !!c.participants.find((p) => p.userId === userId) &&
                    c.participants.find((p) => p.userId === curUserId)
            )

            if (existConversation) {
                router.push({
                    pathname: '/conversation/[conversationId]',
                    query: { conversationId: existConversation._id.toString() },
                })
            } else {
                const participantUserIds = [userId, curUserId]
                createConversationMutation.mutate({ participantUserIds })
            }
        } else if (!isSuccess) {
            // console.log(isSuccess)
            setError('登录过期,请重新登录')
        } else {
            const participantUserIds = [userId, curUserId]
            createConversationMutation.mutate({ participantUserIds })
        }
        setError('')
    }

    return { createConversation, error }
}

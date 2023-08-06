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
        router.push(`/conversation/${conversationId}`)
    })

    const createConversation = (userId: string) => {
        console.log('in createConversation:  ', conversations, isSuccess)
        if (conversations && isSuccess) {
            const exist = conversations.find(
                (c) =>
                    userId !== curUserId &&
                    !!c.participants.find((p) => p.userId === userId) &&
                    !!c.participants.find((p) => p.userId === curUserId)
            )

            if (exist) {
                console.log('conversation id:', exist._id.toString())
                router.push(`/conversation/${exist._id.toString()}`)
            } else {
                const participantIds = [userId, curUserId]
                createConversationMutation.mutate({ participantIds })
            }
        } else if (!isSuccess) {
            console.log(isSuccess)
            setError('登录过期,请重新登录')
            setTimeout(() => {
                router.push('/signin')
            }, 2000)
        } else {
            const participantIds = [userId, curUserId]
            createConversationMutation.mutate({ participantIds })
        }
        setError('')
    }

    return { createConversation, error }
}

import { useState } from 'react'
import { BsSend } from 'react-icons/bs'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'

import { useSendMessageMutation } from '../../hooks/mutation/useSendMessageMutation'
import { useAuthStore } from '../../hooks/store/useAuthStore'

import { ConversationMessages } from './ConversationMessages'

export const ConversationContent = () => {
    const router = useRouter()
    const conversationId = router.query.conversationId as string

    const queryClient = useQueryClient()
    const curUserId = useAuthStore((state) => state.user?._id)
    const [body, setBody] = useState('')

    const sendMessageMutation = useSendMessageMutation((data) => {
        if (data.sendMessage) {
            console.log(data)
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBody(e.target.value)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        sendMessageMutation.mutate({
            conversationId,
            senderId: curUserId,
            body,
        })
        queryClient.invalidateQueries({
            queryKey: ['messages', conversationId],
        })
        setBody('')
    }

    return (
        <div className="conversation-content">
            <ConversationMessages
                conversationId={conversationId}
                curUserId={curUserId}
            />
            <form onSubmit={handleSubmit} className="conversation-form">
                <textarea
                    value={body}
                    onChange={handleChange}
                    className="conversation-input"
                    placeholder="Type something..."
                />
                <button type="submit" className="send-btn">
                    <BsSend />
                </button>
            </form>
        </div>
    )
}

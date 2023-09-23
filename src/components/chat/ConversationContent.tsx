import { useState } from 'react'
import { BsSend } from 'react-icons/bs'
import { useRouter } from 'next/router'

import { useSendMessageMutation } from '../../hooks/mutation/useSendMessageMutation'
import { useAuthStore } from '../../hooks/store/useAuthStore'

import { ConversationMessages } from './ConversationMessages'

export const ConversationContent = () => {
    const curUserId = useAuthStore((state) => state.user?._id)
    const [body, setBody] = useState('')
    const sendMessageMutation = useSendMessageMutation((data) => {
        if (data) {
            console.log(data)
        }
    })
    const router=useRouter()
    const conversationId=router.query.conversationId as string;
    console.log(conversationId)

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

import { useState } from 'react'
import { BsSend } from 'react-icons/bs'

import { useSendMessageMutation } from '../../hooks/mutation/useSendMessageMutation'
import { useMessagesQuery } from '../../hooks/query/useMessagesQuery'

import { MessageItem } from './MessageItem'

interface ConversationProps {
    conversationId: string
    curUserId: string
}

export const ConversationContent = ({
    conversationId,
    curUserId,
}: ConversationProps) => {
    const [body, setBody] = useState('')
    const sendMessageMutation = useSendMessageMutation((data) => {
        if (data) {
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
        setBody('')
    }

    const messages = useMessagesQuery({
        conversationId,
        enabled: !!conversationId,
    })

    return (
        <div className="conversation-content">
            <div className="messages">
                {messages &&
                    messages.map((m) => (
                        <MessageItem
                            key={m._id}
                            message={m}
                            sentByMe={m.senderId === curUserId}
                        />
                    ))}
            </div>
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

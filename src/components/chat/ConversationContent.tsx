import { useState } from 'react'
import { BsSend } from 'react-icons/bs'
import { useRouter } from 'next/router'

import { useSendMessageMutation } from '../../hooks/mutation/useSendMessageMutation'
import { useAuthStore } from '../../hooks/store/useAuthStore'

import { ConversationMessages } from './ConversationMessages'
import { useMutation } from 'urql'
import {
    SendMessageDocument,
    SendMessageMutation,
} from '../../generated/gql/graphql'
import { SendMessageMutationVariables } from '../../generated/graphql-request'

export const ConversationContent = () => {
    const curUserId = useAuthStore((state) => state.user?._id)
    const [body, setBody] = useState('')
    // const sendMessageMutation = useSendMessageMutation((data) => {
    //     if (data.sendMessage) {
    //       console.log(data)
    //     }
    // })

    const [res, sendMessageMutation] = useMutation<
        SendMessageMutation,
        SendMessageMutationVariables
    >(SendMessageDocument)

    const router = useRouter()
    const conversationId = router.query.conversationId as string

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBody(e.target.value)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        sendMessageMutation({
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

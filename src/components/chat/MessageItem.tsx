import 'dayjs/locale/zh'

import classNames from 'classnames'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'

import { MessagesQuery } from '../../generated/graphql-request'
import { DEFAULT_AVATAR } from '../dashboard/FollowInfoList'

interface MessageItemProps {
    message: NonNullable<MessagesQuery['messages']>[0]
    sentByMe: boolean
}

export const MessageItem = ({ message, sentByMe }: MessageItemProps) => {
    return (
        <div className="message-item">
            <span className={classNames('message-info', { 'by-me': sentByMe })}>
                <span className="sender-name">
                    {!sentByMe && message.sender.name + '  '}
                </span>
                <span className="sent-time">
                    {dayjs(message.createdAt).format('YY/MM/DD HH:MM')}
                </span>
            </span>

            <div className={classNames('message-row', { 'by-me': sentByMe })}>
                <Link
                    href={{
                        pathname: '/profile/[username]',
                        query: { username: message.sender.username },
                    }}
                    title={message.sender.name}
                >
                    <Image
                        className="avatar"
                        alt="avatar"
                        width={30}
                        height={30}
                        src={message.sender.photo || DEFAULT_AVATAR}
                    />
                </Link>
                <p className="message-bubble">{message.body}</p>
            </div>
        </div>
    )
}

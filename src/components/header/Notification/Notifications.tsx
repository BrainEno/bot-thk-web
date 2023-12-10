import { RefObject, useRef } from 'react'
import { BiCheck } from 'react-icons/bi'
import { LiaCheckDoubleSolid } from 'react-icons/lia'
import classNames from 'classnames'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'

import {
    INotification,
    useNotificationStore,
} from '../../../hooks/store/useNotificationStore'
import { useClickOutside } from '../../../hooks/useClickOutside'
import useHover from '../../../hooks/useHover'

dayjs.extend(relativeTime)

const Notification = ({ notification }: { notification: INotification }) => {
    const isFollowerType = notification.type === 'user'
    const authorName = `${notification.message.split('__')[0]}`
    const blogTitle = `${notification.message.split('__')[1]}`
    const authorNameLink = `${notification.linkString.split('__')[0]}`
    const blogTitleLink = `${notification.linkString.split('__')[1]}`

    const checkNotification = useNotificationStore(
        (state) => state.updateViewed
    )

    const msgRef = useRef<HTMLDivElement | null>(null)
    const checkHovered = useHover(msgRef)

    return (
        <div className={classNames('notification-container')}>
            <div className="notification-label">
                <p>{isFollowerType ? '新的关注' : '新的订阅'}</p>
                <p>{dayjs(notification.dateString, 'zh').fromNow()}</p>
            </div>

            <div className="notification-message" ref={msgRef}>
                {!notification.isViewed && <div className="new" />}
                {isFollowerType ? (
                    <span>
                        <Link href={`/profile/${notification.linkString}`}>
                            {notification.message}
                        </Link>{' '}
                        关注了你
                    </span>
                ) : (
                    <span>
                        <Link href={`/profile/${authorNameLink}`}>
                            {authorName}
                        </Link>
                        发布了新文章
                        <Link href={`/blogs/${blogTitleLink}`}>
                            {blogTitle}
                        </Link>
                    </span>
                )}
                {!notification.isViewed && (
                    <>
                        {checkHovered && (
                            <div
                                className="checkNew"
                                onClick={() =>
                                    checkNotification(notification.id)
                                }
                            >
                                <BiCheck size={16} color="#fff" />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

interface NotificationsProps {
    notifications: INotification[]
    isVisible: boolean
    close: () => void
    menuBtnRef: RefObject<HTMLButtonElement>
}

export const Notifications = ({
    notifications,
    isVisible,
    close,
    menuBtnRef,
}: NotificationsProps) => {
    const ref = useRef<HTMLDivElement | null>(null)
    useClickOutside(
        ref,
        (e) => {
            if (isVisible) e.preventDefault()
            close()
        },
        menuBtnRef
    )
    const checkAll = useNotificationStore((state) => state.checkAll)
    const isAnyNew = notifications.some((n) => !n.isViewed)

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="notifications"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    ref={ref}
                >
                    <div className="checkAll">
                        <div>所有消息</div>
                        {isAnyNew && (
                            <button onClick={checkAll}>
                                已读
                                <LiaCheckDoubleSolid
                                    style={{ marginLeft: 4 }}
                                    size={16}
                                    color="#fff"
                                />
                            </button>
                        )}
                    </div>
                    {notifications.map((n) => (
                        <Notification notification={n} key={n.id} />
                    ))}
                    {notifications.length === 0 && (
                        <p
                            className="notification-container"
                            style={{
                                textAlign: 'center',
                                marginBottom: '10px',
                                border: 'none',
                            }}
                        >
                            暂时没有新的提醒
                        </p>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

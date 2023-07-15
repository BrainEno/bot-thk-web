import classNames from 'classnames'
import dayjs from 'dayjs'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'

import { INotification } from '../../hooks/store/useNotificationStore'

const Notification = ({ notification }: { notification: INotification }) => {
    const isFollowerType = notification.type === 'user'
    const authorName = `${notification.message.split('__')[0]}`
    const blogTitle = `${notification.message.split('__')[1]}`
    const authorNameLink = `${notification.linkString.split('__')[0]}`
    const blogTitleLink = `${notification.linkString.split('__')[1]}`

    return (
        <div
            className={classNames('notification-container', {
                isViewed: notification.isViewed,
            })}
        >
            <div className="notification-label">
                <p>{isFollowerType ? '新的关注' : '新的订阅'}</p>
                <p>
                    {dayjs(
                        notification.dateString,
                        'YYYY/MMM/DD',
                        'zh',
                        true
                    ).format('YYYY-MM-DD')}
                </p>
            </div>

            <div className="notification-message">
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
            </div>
        </div>
    )
}

interface NotificationsProps {
    notifications: INotification[]
    isVisible: boolean
}

export const Notifications = ({
    notifications,
    isVisible,
}: NotificationsProps) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="notifications"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                >
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

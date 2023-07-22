import { useRef, useState } from 'react'
import { IoMdNotifications } from 'react-icons/io'
import classNames from 'classnames'

import { useNotificationStore } from '../../../hooks/store/useNotificationStore'
import { useClient } from '../../../hooks/useClient'

import { Notifications } from './Notifications'

interface MenuNotificationProps {
    isAuth: boolean
}

export const MenuNotification = ({ isAuth }: MenuNotificationProps) => {
    const ref = useRef<HTMLButtonElement | null>(null)
    const [showNotifications, setShowNotifications] = useState(false)
    const notifications = useNotificationStore((state) => state.notifications)
    const isClient = useClient()

    const notViewed = notifications.some((n) => n.isViewed === false)

    return (
        <div
            className="menu-notification"
            style={{ visibility: isAuth ? 'visible' : 'hidden' }}
        >
            <button
                ref={ref}
                className={classNames('notification-btn', {
                    clicked: showNotifications,
                })}
                onClick={() => setShowNotifications(!showNotifications)}
            >
                <IoMdNotifications size={28} />
                {isClient && notViewed && <div className="new" />}
            </button>
            <Notifications
                menuBtnRef={ref}
                isVisible={showNotifications}
                notifications={notifications}
                close={() => setShowNotifications(false)}
            />
        </div>
    )
}

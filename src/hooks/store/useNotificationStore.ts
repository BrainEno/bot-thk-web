import { produce } from 'immer'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface INotification {
    id: string
    type: string
    message: string
    linkString: string
    dateString: string
    isViewed: boolean
}

interface NotificationState {
    notifications: INotification[]
    append: (notification: INotification) => void
    updateViewed: (id: string) => void
}

export const useNotificationStore = create(
    persist<NotificationState>(
        (set) => ({
            notifications: [],
            append: (notification: INotification) =>
                set((state) => {
                    if (
                        state.notifications.findIndex(
                            (n) => n.id === notification.id
                        ) === -1
                    ) {
                        return {
                            notifications: Array.from(
                                new Set([notification, ...state.notifications])
                            ),
                        }
                    }

                    return state
                }),
            updateViewed: (id: string) =>
                set(
                    produce((state: NotificationState) => {
                        const index = state.notifications.findIndex(
                            (n) => n.id === id
                        )
                        if (index)
                            return [
                                (state.notifications[index].isViewed = true),
                            ]
                    })
                ),
        }),
        {
            name: 'notifications',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => state,
        }
    )
)

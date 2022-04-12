/**
 * notificationSlices.ts
 * 
 * Manages state for plant notifications.
 * @author Yousef
 */

import { StoreState } from "../store";
import { StoreSlice } from "../storeSlice";

export interface Notification {
    id: string;
    icon: string;
    label: string;
    plantID: string;
    date: string;
}

export type NotificationSlice = {
    notifications: {                                                                // Notifications, array per plant id
        [id: string]: Notification[]
    },
    addNotification: (notification: Notification) => void;                          // Adds a notification to state
    loadNotifications: (plantID: string, notifications: Notification[]) => void;    // loads multiple notifications
}

/**
 * Adds the specified notification to state.
 * @param notifications Notification[], the current notification state.
 * @param notification Notification, the notification to add.
 * @returns Notification[], the updated state.
 */
const addNotification = (notifications: Notification[], notification: Notification) => {
    return ([notification,...notifications]);
}

/**
 * Creates a notification store slice.
 * @param set, sets the store state.
 * @param get, reads the store state.
 * @returns the store slice.
 */
export const createNotificationSlice: StoreSlice<NotificationSlice> = (set, get) => ({
    notifications: {},
    addNotification: (notification: Notification) =>
        set((state: StoreState) => ({
            ...state,
            notifications: {
                ...state.notifications,
                [notification.plantID]: addNotification(state.notifications[notification.plantID] || [], notification)
            }
        })),
    loadNotifications: (plantID: string, notifications: Notification[]) =>
    set((state: StoreState) => ({
        ...state,
        notifications: {
            ...state.notifications,
            [plantID]: notifications
        }
    })),
})
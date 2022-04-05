import { uuid } from "lib/components/util/util";
import { notifications } from "../mock";
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
    notifications: {
        [id: string]: Notification[]
    },
    addNotification: (notification: Notification) => void;
    loadNotifications: (plantID: string, notifications: Notification[]) => void; 
}

const addNotification = (notifications: Notification[], notification: Notification) => {
    return ([notification,...notifications]);
}

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
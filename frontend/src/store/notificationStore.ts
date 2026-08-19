import { create } from "zustand";

interface Notification {
  id: number;
  message: string;
}

interface NotificationStore {
  notifications: Notification[];

  addNotification: (notification: Notification) => void;

  clearNotifications: () => void;
}

export const useNotificationStore =
  create<NotificationStore>((set) => ({
    notifications: [],

    addNotification: (notification) =>
      set((state) => ({
        notifications: [
          ...state.notifications,
          notification,
        ],
      })),

    clearNotifications: () =>
      set({
        notifications: [],
      }),
  }));
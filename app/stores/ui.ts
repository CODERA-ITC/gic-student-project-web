import { defineStore } from "pinia";

// Types
export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "project"
  | "approval"
  | "comment";
export type ThemeType = "dark" | "light";

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  duration?: number;
  read?: boolean;
  action?: string;
  avatar?: string;
  thumbnail?: string;
  channel?: string;
  isRead?: boolean;
}

export interface UiModals {
  filterPanel: boolean;
  projectCreate: boolean;
  projectEdit: boolean;
  studentProfile: boolean;
}

export interface UiState {
  isLoading: boolean;
  loadingMessage: string;
  modals: UiModals;
  notifications: Notification[];
  theme: ThemeType;
  sidebarOpen: boolean;
  searchActive: boolean;
  searchQuery: string;
}

export const DEFAULT_AVATAR_URL =
  "https://img.icons8.com/nolan/1200/user-default.jpg";

/**
 * UI Store - Global UI state management
 * Handles UI state like loading, modals, notifications, etc.
 */
export const useUiStore = defineStore("ui", {
  state: (): UiState => ({
    // Loading states
    isLoading: false,
    loadingMessage: "",

    // Modal states
    modals: {
      filterPanel: false,
      projectCreate: false,
      projectEdit: false,
      studentProfile: false,
    },

    // Notification states
    notifications: [
      {
        id: 1,
        title:
          "Noobie GMK uploaded: Binance ជើងក្រោះប្រាប់ពាសំលេង ការបោះផ្សាយថ្មី #binnance",
        message: "New video from Noobie GMK",
        type: "project" as NotificationType,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NoobieGMK",
        thumbnail: "https://picsum.photos/seed/binance1/120/90",
        channel: "Noobie GMK",
        isRead: false,
        duration: 0, // Don't auto-remove
      },
      {
        id: 2,
        title:
          "Noobie GMK uploaded: Binance Launch New P2P Trading Zone New User #binance",
        message: "New video about P2P trading",
        type: "project" as NotificationType,
        timestamp: new Date(
          Date.now() - 13 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NoobieGMK",
        thumbnail: "https://picsum.photos/seed/binance2/120/90",
        channel: "Noobie GMK",
        isRead: false,
        duration: 0,
      },
      {
        id: 3,
        title: "Noobie GMK uploaded: Apro (AT) តម្រូវ Oracle លើ Binance",
        message: "New cryptocurrency analysis",
        type: "approval" as NotificationType,
        timestamp: new Date(
          Date.now() - 14 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NoobieGMK",
        thumbnail: "https://picsum.photos/seed/apro/120/90",
        channel: "Noobie GMK",
        isRead: false,
        duration: 0,
      },
      {
        id: 4,
        title: "M.Megamind is live: ម៉ូដែលអេលេសភិកសំរាប់ការសិក្សាអិនធឺណិត",
        message: "Live stream started",
        type: "info" as NotificationType,
        timestamp: new Date(
          Date.now() - 21 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Megamind",
        thumbnail: "https://picsum.photos/seed/live1/120/90",
        channel: "M.Megamind",
        isRead: false,
        duration: 0,
      },
      {
        id: 5,
        title:
          "Noobie GMK uploaded: លើក EV ពីដំបូងទេ? ណាខ្លះជាសំលេង? | Tesla Drive",
        message: "Tesla electric vehicle review",
        type: "project" as NotificationType,
        timestamp: new Date(
          Date.now() - 21 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NoobieGMK",
        thumbnail: "https://picsum.photos/seed/tesla/120/90",
        channel: "Noobie GMK",
        isRead: false,
        duration: 0,
      },
    ],

    // Theme
    theme: "dark",

    // Sidebar
    sidebarOpen: false,

    // Search
    searchActive: false,
    searchQuery: "",
  }),

  getters: {
    hasNotifications: (state: UiState): boolean =>
      state.notifications.length > 0,

    hasActiveModals: (state: UiState): boolean =>
      Object.values(state.modals).some((v: boolean) => v),
  },

  actions: {
    // Loading actions
    setLoading(isLoading: boolean, message: string = ""): void {
      this.isLoading = isLoading;
      this.loadingMessage = message;
    },

    // Modal actions
    openModal(modalName: keyof UiModals): void {
      if (modalName in this.modals) {
        this.modals[modalName] = true;
      }
    },

    closeModal(modalName: keyof UiModals): void {
      if (modalName in this.modals) {
        this.modals[modalName] = false;
      }
    },

    toggleModal(modalName: keyof UiModals): void {
      if (modalName in this.modals) {
        this.modals[modalName] = !this.modals[modalName];
      }
    },

    closeAllModals(): void {
      Object.keys(this.modals).forEach((key) => {
        this.modals[key as keyof UiModals] = false;
      });
    },

    // Notification actions
    addNotification(notification: Partial<Notification>): number {
      const id = Date.now();
      const defaultNotification: Notification = {
        id,
        title: "Notification",
        message: "",
        type: "info", // info, success, warning, error, project, approval, comment
        timestamp: new Date().toISOString(),
        duration: 3000,
        ...notification,
      } as Notification;
      this.notifications.push(defaultNotification);

      if (defaultNotification.duration && defaultNotification.duration > 0) {
        setTimeout(() => {
          this.removeNotification(id);
        }, defaultNotification.duration);
      }

      return id;
    },

    removeNotification(id: number): void {
      const index = this.notifications.findIndex((n) => n.id === id);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    },

    // Search actions
    setSearchActive(active: boolean): void {
      this.searchActive = active;
    },

    setSearchQuery(query: string): void {
      this.searchQuery = query;
    },

    clearSearch(): void {
      this.searchQuery = "";
      this.searchActive = false;
    },

    // Theme actions
    toggleTheme(): void {
      this.theme = this.theme === "dark" ? "light" : "dark";
    },

    setTheme(theme: ThemeType): void {
      this.theme = theme;
    },
  },
});

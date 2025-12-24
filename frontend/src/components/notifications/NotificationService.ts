import { Store } from 'react-notifications-component';
import type { iNotification } from 'react-notifications-component';

/**
 * Notification Types
 */
export type NotificationType = 'success' | 'danger' | 'info' | 'warning' | 'default';

/**
 * Notification Options Interface
 */
interface NotificationOptions {
    title: string;
    message: string;
    type?: NotificationType;
    duration?: number;
    insert?: 'top' | 'bottom';
    container?: 'top-left' | 'top-right' | 'top-center' | 'center' | 'bottom-left' | 'bottom-right' | 'bottom-center';
}

/**
 * Default notification configuration
 */
const defaultConfig: Partial<iNotification> = {
    insert: 'top',
    container: 'top-right',
    animationIn: ['animate__animated', 'animate__slideInRight'],
    animationOut: ['animate__animated', 'animate__slideOutRight'],
    slidingEnter: {
        duration: 300,
        timingFunction: 'ease-out',
        delay: 0,
    },
    slidingExit: {
        duration: 300,
        timingFunction: 'ease-out',
        delay: 0,
    },
    dismiss: {
        duration: 4000,
        onScreen: true,
        pauseOnHover: true,
        showIcon: true,
    },
};

/**
 * Show a notification
 */
export const showNotification = (options: NotificationOptions): string => {
    return Store.addNotification({
        ...defaultConfig,
        title: options.title,
        message: options.message,
        type: options.type || 'default',
        insert: options.insert || 'top',
        container: options.container || 'top-right',
        dismiss: {
            ...defaultConfig.dismiss,
            duration: options.duration || 3000,
        },
    });
};

/**
 * Show a success notification (green)
 */
export const showSuccess = (title: string, message: string): string => {
    return showNotification({ title, message, type: 'success' });
};

/**
 * Show an error notification (red)
 */
export const showError = (title: string, message: string): string => {
    return showNotification({ title, message, type: 'danger' });
};

/**
 * Show an info notification (green - same as success for simplicity)
 */
export const showInfo = (title: string, message: string): string => {
    return showNotification({ title, message, type: 'success' });
};

/**
 * Remove a notification by ID
 */
export const removeNotification = (id: string): void => {
    Store.removeNotification(id);
};

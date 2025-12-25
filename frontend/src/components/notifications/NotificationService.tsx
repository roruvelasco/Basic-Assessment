import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
    id: number;
    message: string;
    type: NotificationType;
}

interface NotificationContextType {
    showSuccess: (title: string, message: string) => void;
    showError: (title: string, message: string) => void;
    showInfo: (title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

// slide from right
function SlideTransition(props: React.ComponentProps<typeof Slide>) {
    return <Slide {...props} direction="left" />;
}

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notification, setNotification] = useState<Notification | null>(null);
    const [open, setOpen] = useState(false);

    const showNotification = useCallback((type: NotificationType, title: string, message: string) => {
        setNotification({
            id: Date.now(),
            message: title ? `${title}: ${message}` : message,
            type,
        });
        setOpen(true);
    }, []);

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    const showSuccess = useCallback((title: string, message: string) => {
        showNotification('success', title, message);
    }, [showNotification]);

    const showError = useCallback((title: string, message: string) => {
        showNotification('error', title, message);
    }, [showNotification]);

    const showInfo = useCallback((title: string, message: string) => {
        showNotification('success', title, message);
    }, [showNotification]);

    return (
        <NotificationContext.Provider value={{ showSuccess, showError, showInfo }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                TransitionComponent={SlideTransition}
                key={notification?.id}
            >
                <Alert
                    onClose={handleClose}
                    severity={notification?.type || 'info'}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {notification?.message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};

// hook for components
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};

// standalone functions for non-component usage
let notificationFunctions: NotificationContextType | null = null;

export const setNotificationFunctions = (fns: NotificationContextType) => {
    notificationFunctions = fns;
};

export const showSuccess = (title: string, message: string) => {
    notificationFunctions?.showSuccess(title, message);
};

export const showError = (title: string, message: string) => {
    notificationFunctions?.showError(title, message);
};

export const showInfo = (title: string, message: string) => {
    notificationFunctions?.showInfo(title, message);
};

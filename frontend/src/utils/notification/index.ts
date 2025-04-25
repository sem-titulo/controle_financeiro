import { ReactNode } from 'react';
import { toast } from 'react-toastify';

// https://fkhadra.github.io/react-toastify/api/toast

interface IToast {
    message?: string | ReactNode;
    type?: 'success' | 'info' | 'warning' | 'error';
    position?:
        | 'top-right'
        | 'top-center'
        | 'top-left'
        | 'bottom-right'
        | 'bottom-center'
        | 'bottom-left';
}

export function showNotification({ message, type, position }: IToast) {
    toast(message, {
        type,
        position,
    });
}

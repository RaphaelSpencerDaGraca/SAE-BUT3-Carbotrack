//frontend\src\components\ui\alert.tsx
import React, { HTMLAttributes } from 'react';

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
    type: 'error' | 'success' | 'info';
    message: string;
}

const Alert: React.FC<AlertProps> = ({ type, message, className = '', ...props }) => {
    const alertClasses = {
        error: 'bg-red-50 border-red-500 text-red-700',
        success: 'bg-green-50 border-green-500 text-green-700',
        info: 'bg-blue-50 border-blue-500 text-blue-700',
    };

    return (
        <div
            className={`p-4 border-l-4 rounded-md ${alertClasses[type]} ${className}`}
            {...props}
        >
            {message}
        </div>
    );
};

export default Alert;
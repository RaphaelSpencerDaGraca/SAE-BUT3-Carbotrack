import React from 'react';

interface AlertProps {
    type: 'error' | 'success' | 'info';
    message: string;
}

const Alert: React.FC<AlertProps> = ({ type, message }) => {
    const colors = {
        error: 'bg-red-100 text-red-800',
        success: 'bg-green-100 text-green-800',
        info: 'bg-blue-100 text-blue-800',
    };

    return (
        <div className={`p-4 rounded-lg ${colors[type]}`}>
            {message}
        </div>
    );
};

export default Alert;

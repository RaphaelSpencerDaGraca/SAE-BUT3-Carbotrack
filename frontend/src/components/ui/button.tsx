import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
    return (
        <button
            className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
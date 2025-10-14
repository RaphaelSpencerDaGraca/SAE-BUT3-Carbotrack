import React, { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    placeholder: string;
    label?: string;
}

const InputField: React.FC<InputFieldProps> = ({ name, placeholder, label, className = '', ...props }) => {
    return (
        <div className="space-y-1">
            {label && <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>}
            <input
                name={name}
                placeholder={placeholder}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
                {...props}
            />
        </div>
    );
};

export default InputField;
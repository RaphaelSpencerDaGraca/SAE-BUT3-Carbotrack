import React from 'react';

interface InputFieldProps {
    type: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
                                                   type,
                                                   name,
                                                   value,
                                                   onChange,
                                                   placeholder,
                                                   required = false,
                                               }) => {
    return (
        <div>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
};

export default InputField;

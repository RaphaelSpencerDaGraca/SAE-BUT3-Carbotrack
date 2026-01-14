// frontend/src/components/ui/inputField.tsx
import React, { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    placeholder: string;
    label?: string;
}

const InputField: React.FC<InputFieldProps> = ({
                                                   name,
                                                   placeholder,
                                                   label,
                                                   className = "",
                                                   ...props
                                               }) => {
    return (
        <div className="space-y-1">
            {label && (
                <label
                    htmlFor={props.id ?? name}
                    className="block text-sm font-medium text-white/80"
                >
                    {label}
                </label>
            )}
            <input
                id={props.id ?? name}
                name={name}
                placeholder={placeholder}
                className={[
                    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5",
                    "text-white placeholder:text-white/40",
                    "outline-none transition",
                    "focus:border-green-400/40 focus:ring-2 focus:ring-green-400/20",
                    "disabled:opacity-60",
                    className,
                ].join(" ")}
                {...props}
            />
        </div>
    );
};

export default InputField;
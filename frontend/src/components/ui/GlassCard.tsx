import React, { ReactNode } from "react";

type GlassCardProps = {
    children: ReactNode;
    className?: string;
};

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "" }) => {
    return (
        <div
            className={[
                "rounded-2xl border border-white/10 bg-white/[0.06] p-6",
                "shadow-[0_20px_60px_-20px_rgba(0,0,0,0.65)] backdrop-blur-xl",
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
};

export default GlassCard;

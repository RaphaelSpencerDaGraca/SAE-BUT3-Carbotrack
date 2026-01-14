import React from "react";

type PageHeaderProps = {
    title: string;
    subtitle?: string;
    rightSlot?: React.ReactNode; // bouton / filtre / actions
};

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, rightSlot }) => {
    return (
        <div className="mb-8 flex items-start justify-between gap-4">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1>
                {subtitle && <p className="mt-2 text-sm text-white/70">{subtitle}</p>}
            </div>
            {rightSlot && <div className="shrink-0">{rightSlot}</div>}
        </div>
    );
};

export default PageHeader;

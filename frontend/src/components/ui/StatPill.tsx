import React from "react";

type StatPillProps = {
    label: string;
    value: string;
};

const StatPill: React.FC<StatPillProps> = ({ label, value }) => {
    return (
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-xs text-white/60">{label}</div>
            <div className="mt-1 text-base font-semibold text-white">{value}</div>
        </div>
    );
};

export default StatPill;
import React, { ReactNode } from "react";

type AppShellProps = {
    children: ReactNode;
    className?: string;
};

const AppShell: React.FC<AppShellProps> = ({ children, className = "" }) => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-gray-950 text-white">
            {/* background premium */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900" />
                <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-green-500/12 blur-[90px]" />
                <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-emerald-400/10 blur-[90px]" />
                <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />
            </div>

            <main className={`relative mx-auto w-full max-w-6xl px-6 py-10 ${className}`}>
                {children}
            </main>
        </div>
    );
};

export default AppShell;

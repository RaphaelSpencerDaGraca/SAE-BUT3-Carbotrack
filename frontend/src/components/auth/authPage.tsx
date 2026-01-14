// frontend/src/components/auth/authPage.tsx
import React, { ReactNode } from "react";

interface AuthPageProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
    illustrationSrc?: string;
    illustrationAlt?: string;
    highlights?: string[];
}

const AuthPage: React.FC<AuthPageProps> = ({
                                               title,
                                               subtitle,
                                               children,
                                               illustrationSrc = "/auth-illustration.svg",
                                               illustrationAlt = "",
                                               highlights = [],
                                           }) => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-gray-950 text-white">
            {/* Background: gradient + spotlight + subtle grid */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900" />
                <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-green-500/15 blur-[90px]" />
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

            <div className="relative mx-auto grid min-h-screen max-w-6xl items-stretch lg:grid-cols-2">
                {/* Left panel */}
                <div className="hidden lg:flex flex-col justify-between p-10">
                    <div className="max-w-md">
                        <div className="flex items-center gap-3">
                            <img
                                src="/logo.png"
                                alt="Carbotrack"
                                className="h-10 w-10 rounded-xl ring-1 ring-white/10"
                            />
                            <div>
                                <div className="text-sm text-white/70">Carbotrack</div>
                                <div className="text-base font-semibold text-white">
                                    Suivez votre empreinte
                                </div>
                            </div>
                        </div>

                        <h1 className="mt-10 text-5xl font-semibold tracking-tight">
                            {title}
                        </h1>

                        {subtitle && (
                            <p className="mt-4 text-base leading-relaxed text-white/70">
                                {subtitle}
                            </p>
                        )}

                        {!!highlights.length && (
                            <div className="mt-8 space-y-3">
                                {highlights.map((h, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur"
                                    >
                                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_0_4px_rgba(34,197,94,0.12)]" />
                                        <span className="text-sm text-white/80">{h}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <img
                            src={illustrationSrc}
                            alt={illustrationAlt}
                            className="mt-10 w-full max-w-md opacity-95"
                        />
                    </div>

                    <p className="text-xs text-white/40">
                        © {new Date().getFullYear()} Carbotrack — Tous droits réservés.
                    </p>
                </div>

                {/* Right panel */}
                <div className="flex items-center justify-center px-6 py-10 lg:px-10">
                    <div className="w-full max-w-md">
                        {/* Mobile header */}
                        <div className="mb-8 lg:hidden">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/logo.png"
                                    alt="Carbotrack"
                                    className="h-11 w-11 rounded-2xl ring-1 ring-white/10"
                                />
                                <div>
                                    <div className="text-sm text-white/70">Carbotrack</div>
                                    <div className="text-lg font-semibold">{title}</div>
                                </div>
                            </div>
                            {subtitle && (
                                <p className="mt-2 text-sm text-white/70">{subtitle}</p>
                            )}
                        </div>

                        {/* Premium card */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:p-8">
                            {children}
                        </div>

                        <p className="mt-6 text-center text-xs text-white/45">
                            En vous connectant, vous acceptez nos conditions d’utilisation.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;

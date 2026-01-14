// frontend/src/pages/mode2vie.tsx
import { LifestyleForm } from "../components/calcLifestyle/LifestyleForm";
import { useProduits } from "../hooks/useProduits";
import { useTranslation } from "@/language/useTranslation";

const GlassCard = ({
                       children,
                       className = "",
                   }: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div
        className={[
            "rounded-2xl border border-white/10 bg-white/[0.06]",
            "shadow-[0_20px_60px_-20px_rgba(0,0,0,0.65)] backdrop-blur-xl",
            className,
        ].join(" ")}
    >
        {children}
    </div>
);

const LifestylePage = () => {
    const { produits, loading, error } = useProduits();
    const { t } = useTranslation();

    // On garde les états, mais en les mettant sur le même background premium
    if (loading) {
        return (
            <div className="relative min-h-screen overflow-hidden bg-gray-950 text-white">
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

                <div className="relative flex h-[60vh] items-center justify-center px-4">
                    <div className="text-sm font-semibold text-white/70">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400/70 animate-pulse" />
                {t("lifestyle.loading")}
            </span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative min-h-screen overflow-hidden bg-gray-950 text-white">
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

                <div className="relative mx-auto mt-16 max-w-lg px-4">
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-center text-red-200 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.65)]">
                        <p className="text-sm font-semibold">{t("lifestyle.errorPrefix")}</p>
                        <p className="mt-2 text-sm text-red-200/80">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-gray-950 text-white">
            {/* Background premium (cohérent avec le reste) */}
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

            <main className="relative mx-auto max-w-4xl px-4 pb-24 pt-10">
                {/* Header */}
                <header className="mb-10 text-center space-y-4">
                    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-200">
                        {t("lifestyle.section.calculator")}
                    </div>

                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                        {t("lifestyle.title")}
                    </h1>

                    <p className="mx-auto max-w-2xl text-base sm:text-lg text-white/65">
                        {t("lifestyle.subtitle")}
                    </p>
                </header>

                {/* Main content */}
                <div className="grid gap-8">
                    <GlassCard className="p-5 md:p-6">
                        <LifestyleForm produits={produits} />
                    </GlassCard>
                </div>

                {/* Info section */}
                <section className="mt-10">
                    <GlassCard className="p-5 md:p-6">
                        <div className="flex items-start gap-4">
                            <div className="hidden sm:flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-white/90 mb-2">
                                    {t("lifestyle.info.title")}
                                </h2>
                                <p className="text-white/65 leading-relaxed text-sm md:text-base">
                                    {t("lifestyle.info.text1")}
                                </p>
                            </div>
                        </div>
                    </GlassCard>
                </section>
            </main>
        </div>
    );
};

export default LifestylePage;
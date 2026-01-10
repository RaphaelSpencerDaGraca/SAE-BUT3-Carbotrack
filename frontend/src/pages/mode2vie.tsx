// frontend/src/pages/mode2vie.tsx
import { LifestyleForm } from "../components/calcLifestyle/LifestyleForm";
import { useProduits } from "../hooks/useProduits";
import { useTranslation } from "@/language/useTranslation";

const LifestylePage = () => {
    const { produits, loading, error } = useProduits();
    const { t } = useTranslation();

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="animate-pulse text-brand-400 font-medium">{t("lifestyle.loading")}</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto mt-10 max-w-lg rounded-lg border border-red-900/50 bg-red-900/10 p-4 text-center text-red-400">
                {t("lifestyle.errorPrefix")} {error}
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
            {/* Background Glow Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-brand-900/20 blur-[100px] rounded-full pointer-events-none opacity-50" />
            
            <div className="relative mx-auto max-w-4xl px-4 pb-24 pt-12">
                <header className="mb-10 text-center space-y-4">
                    <div className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-400 backdrop-blur-sm">
                        {t("lifestyle.section.calculator")}
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                        {t("lifestyle.title")}
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-slate-400">
                        {t("lifestyle.subtitle")}
                    </p>
                </header>

                <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                    <div className="lg:col-span-2">
                        <LifestyleForm produits={produits} />
                    </div>
                </div>

                <section className="mt-12 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6 md:p-8">
                    <div className="flex items-start gap-4">
                         <div className="hidden sm:flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                         </div>
                         <div>
                            <h2 className="text-lg font-semibold text-slate-100 mb-2">
                                {t("lifestyle.info.title")}
                            </h2>
                            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                                {t("lifestyle.info.text1")}
                            </p>
                         </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default LifestylePage;
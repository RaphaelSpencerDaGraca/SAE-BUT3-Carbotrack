// frontend/src/pages/mode2vie.tsx
import { LifestyleForm } from "../components/calcLifestyle/LifestyleForm";
import { useProduits } from "../hooks/useProduits";
import { useTranslation } from "@/language/useTranslation";

const LifestylePage = () => {
    const { produits, loading, error } = useProduits();
    const { t } = useTranslation();

    if (loading) {
        return <div className="text-brand-100">{t("lifestyle.loading")}</div>;
    }

    if (error) {
        return (
            <div className="text-red-500">
                {t("lifestyle.errorPrefix")}
                {error}
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 px-4 pb-24 pt-6">
            <div className="mx-auto max-w-3xl space-y-6">
                <header className="space-y-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        {t("lifestyle.section.calculator")}
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight text-brand-100">
                        {t("lifestyle.title")}
                    </h1>
                    <p className="text-sm text-slate-400 max-w-2xl">
                        {t("lifestyle.subtitle")}
                    </p>
                </header>

                <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
                    <LifestyleForm produits={produits} />
                </section>

                <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-400">
                    <h2 className="text-lg font-medium text-slate-100 mb-3">
                        {t("lifestyle.info.title")}
                    </h2>
                    <p className="mb-2">
                        {t("lifestyle.info.text1")}
                    </p>
                </section>
            </div>
        </main>
    );
};

export default LifestylePage;

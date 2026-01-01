//frontend\src\pages\dashboard.tsx
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "@/language/useTranslation";

type StatCardProps = {
    label: string;
    value: string;
    helper: string;
};

const StatCard = ({ label, value, helper }: StatCardProps) => {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-xs text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-50">{value}</p>
            <p className="mt-1 text-xs text-emerald-300">{helper}</p>
        </div>
    );
};

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { t } = useTranslation();

    const rawName =
        (user as any)?.pseudo ??
        (user as any)?.name ??
        (user as any)?.email ??
        t("common.user");

    const firstName =
        typeof rawName === "string" ? rawName.split(" ")[0] : t("common.user");

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 px-4 pb-24 pt-6">
            <div className="mx-auto max-w-5xl space-y-6">
                <header className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            {t("dashboard.title")}
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                            {t("dashboard.greeting")}, {firstName} 👋
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">{t("dashboard.subtitle")}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={logout}
                            className="inline-flex items-center justify-center rounded-full border border-red-500/60 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-200 shadow-sm hover:bg-red-500/20"
                        >
                            {t("common.logout")}
                        </button>
                    </div>
                </header>

                <section className="grid gap-4 md:grid-cols-3">
                    <StatCard
                        label={t("dashboard.stats.vehicles.label")}
                        value="3"
                        helper={t("dashboard.stats.vehicles.helper")}
                    />
                    <StatCard
                        label={t("dashboard.stats.trips.label")}
                        value="24"
                        helper={t("dashboard.stats.trips.helper")}
                    />
                    <StatCard
                        label={t("dashboard.stats.co2.label")}
                        value="142 kg"
                        helper={t("dashboard.stats.co2.helper")}
                    />
                </section>

                <section className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                        <div className="flex items-center justify-between gap-2">
                            <h2 className="text-sm font-medium text-slate-100">
                                {t("dashboard.latestTrips.title")}
                            </h2>
                            <button className="text-xs text-emerald-300 hover:underline">
                                {t("dashboard.latestTrips.cta")}
                            </button>
                        </div>

                        <p className="mt-3 text-sm text-slate-400">
                            {t("dashboard.latestTrips.text")}
                        </p>

                        <ul className="mt-4 space-y-2 text-xs text-slate-400">
                            <li>{t("dashboard.latestTrips.item.placeholder1")}</li>
                            <li>{t("dashboard.latestTrips.item.placeholder2")}</li>
                        </ul>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                        <h2 className="text-sm font-medium text-slate-100">
                            {t("dashboard.nextSteps.title")}
                        </h2>
                        <ol className="mt-3 space-y-2 list-decimal list-inside text-sm text-slate-400">
                            <li>{t("dashboard.nextSteps.step1")}</li>
                            <li>{t("dashboard.nextSteps.step2")}</li>
                            <li>{t("dashboard.nextSteps.step3")}</li>
                        </ol>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Dashboard;

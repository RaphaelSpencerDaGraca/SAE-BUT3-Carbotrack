// frontend/src/pages/trips.tsx
import { useTranslation } from "@/language/useTranslation";

type Trip = {
    id: number;
    date: string;
    from: string;
    to: string;
    distanceKm: number;
    vehicleName: string;
    co2Kg: number;
    tagKey?: string;
};

const MOCK_TRIPS: Trip[] = [
    {
        id: 1,
        date: "2025-01-10",
        from: "Paris",
        to: "Orléans",
        distanceKm: 132,
        vehicleName: "Clio Diesel",
        co2Kg: 24.5,
        tagKey: "trips.tag.homeToMission"
    },
    {
        id: 2,
        date: "2025-01-12",
        from: "Orléans",
        to: "Paris",
        distanceKm: 135,
        vehicleName: "Clio Diesel",
        co2Kg: 25.1,
        tagKey: "trips.tag.return"
    },
    {
        id: 3,
        date: "2025-01-15",
        from: "Paris",
        to: "IUT Paris",
        distanceKm: 8,
        vehicleName: "Tram / Métro",
        co2Kg: 1.2,
        tagKey: "trips.tag.daily"
    }
];

const TripsPage = () => {
    const { t } = useTranslation();

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 px-4 pb-24 pt-6">
            <div className="mx-auto max-w-5xl space-y-6">
                <header className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            {t("trips.title")}
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                            {t("trips.header")}
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">
                            {t("trips.subtitle")}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200 shadow-sm hover:bg-emerald-500/20"
                    >
                        {t("trips.action.newTrip")}
                    </button>
                </header>

                <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                    <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium text-slate-400">
              {t("trips.filters.label")}
            </span>

                        <button className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200 hover:border-emerald-400 hover:text-emerald-200">
                            {t("trips.filters.last7Days")}
                        </button>
                        <button className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200 hover:border-emerald-400 hover:text-emerald-200">
                            {t("trips.filters.thisMonth")}
                        </button>
                        <button className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200 hover:border-emerald-400 hover:text-emerald-200">
                            {t("trips.filters.all")}
                        </button>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-800 bg-slate-900/40">
                    <div className="border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                        <h2 className="text-sm font-medium text-slate-100">
                            {t("trips.list.title")}
                        </h2>
                        <span className="text-xs text-slate-500">
              {MOCK_TRIPS.length} {t("trips.list.countSuffix")}
            </span>
                    </div>

                    {MOCK_TRIPS.length === 0 ? (
                        <div className="px-4 py-10 text-center text-sm text-slate-400">
                            {t("trips.list.empty")}
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-800">
                            {MOCK_TRIPS.map((trip) => (
                                <li
                                    key={trip.id}
                                    className="px-4 py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
                                >
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-slate-100">
                                            {trip.from} → {trip.to}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {trip.date} · {trip.distanceKm} km · {trip.vehicleName}
                                        </p>
                                        {trip.tagKey && (
                                            <span className="inline-flex rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                        {t(trip.tagKey)}
                      </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between gap-4">
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400">
                                                {t("trips.list.co2Label")}
                                            </p>
                                            <p className="text-sm font-semibold text-emerald-300">
                                                {trip.co2Kg.toFixed(1)} kg
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-200 hover:border-slate-500">
                                                {t("trips.actions.edit")}
                                            </button>
                                            <button className="rounded-full border border-red-500/60 bg-red-500/10 px-3 py-1 text-[11px] text-red-200 hover:bg-red-500/20">
                                                {t("trips.actions.delete")}
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
};

export default TripsPage;

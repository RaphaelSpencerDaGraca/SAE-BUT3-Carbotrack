//frontend\src\pages\vehicles.tsx
import type { Vehicle } from '../../../shared/vehicle.type.ts';
import { useEffect, useState } from 'react';

import { useTranslation } from "@/language/useTranslation";

type SummaryCardProps = {
    label: string;
    value: string;
    helper: string;
};

type VehicleRowProps = {
    vehicle: Vehicle;
    fuelLabel: (fuel: Vehicle["fuelType"]) => string;
};

const SummaryCard = ({ label, value, helper }: SummaryCardProps) => {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-xs text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-50">{value}</p>
            <p className="mt-1 text-xs text-emerald-300">{helper}</p>
        </div>
    );
};

const VehicleRow = ({ vehicle, fuelLabel }: VehicleRowProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between">
            <div>
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-100">{vehicle.name}</p>
                    {vehicle.plate && (
                        <span className="rounded-full border border-slate-700 bg-slate-900/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300">
              {vehicle.plate}
            </span>
                    )}
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    {vehicle.type && (
                        <span className="rounded-full bg-slate-800/80 px-2 py-0.5">
              {vehicle.type}
            </span>
                    )}
                    <span className="rounded-full bg-slate-800/80 px-2 py-0.5">
            {fuelLabel(vehicle.fuelType)}
          </span>
                    {vehicle.consumptionLPer100 && (
                        <span className="rounded-full bg-slate-800/80 px-2 py-0.5">
              {vehicle.consumptionLPer100} L / 100 km
            </span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
                <button className="rounded-full border border-slate-700 px-3 py-1 text-slate-200 hover:bg-slate-800">
                    {t("vehicles.actions.edit")}
                </button>
                <button className="rounded-full border border-red-700/70 bg-red-950/40 px-3 py-1 text-red-200 hover:bg-red-900/60">
                    {t("vehicles.actions.delete")}
                </button>
            </div>
        </div>
    );
};

const VehiclesPage = () => {
    const { t } = useTranslation();

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorKey, setErrorKey] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchVehicles = async () => {
            try {
                setLoading(true);
                setErrorKey(null);

                const res = await fetch(`/api/vehicles`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    signal: controller.signal
                });

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                const data = (await res.json()) as Vehicle[];
                setVehicles(data);
            } catch (err: any) {
                if (err?.name === "AbortError") {
                    return;
                }
                console.error("Erreur lors du chargement des véhicules :", err);
                setErrorKey("vehicles.error.unableToLoad");
                setVehicles([]);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();

        return () => controller.abort();
    }, []);

    const vehicleCount = vehicles.length;
    const distinctTypes = new Set(vehicles.map((v) => v.type || "Autre")).size;
    const distinctFuels = new Set(vehicles.map((v) => fuelLabel(v.fuelType, t))).size;

    const statusText = loading
        ? t("vehicles.list.status.loading")
        : errorKey
            ? t("vehicles.list.status.error")
            : vehicleCount === 0
                ? t("vehicles.list.status.empty")
                : `${vehicleCount} ${
                    vehicleCount > 1
                        ? t("vehicles.list.status.count.plural")
                        : t("vehicles.list.status.count.singular")
                }`;

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 px-4 pb-24 pt-6">
            <div className="mx-auto max-w-5xl space-y-6">
                <header className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            {t("vehicles.title")}
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                            {t("vehicles.header")}
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">
                            {t("vehicles.subtitle")}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200 shadow-sm hover:bg-emerald-500/20"
                    >
                        {t("vehicles.action.newVehicle")}
                    </button>
                </header>

                <section className="grid gap-4 md:grid-cols-3">
                    <SummaryCard
                        label={t("vehicles.summary.vehicles.label")}
                        value={loading ? "..." : vehicleCount.toString()}
                        helper={t("vehicles.summary.vehicles.helper")}
                    />
                    <SummaryCard
                        label={t("vehicles.summary.types.label")}
                        value={loading ? "..." : distinctTypes.toString()}
                        helper={t("vehicles.summary.types.helper")}
                    />
                    <SummaryCard
                        label={t("vehicles.summary.fuels.label")}
                        value={loading ? "..." : distinctFuels.toString()}
                        helper={t("vehicles.summary.fuels.helper")}
                    />
                </section>

                <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-sm font-medium text-slate-100">
                            {t("vehicles.list.title")}
                        </h2>
                        <p className="text-xs text-slate-500">{statusText}</p>
                    </div>

                    <div className="mt-4 divide-y divide-slate-800">
                        {loading && (
                            <p className="py-3 text-sm text-slate-400">
                                {t("vehicles.list.status.loading")}
                            </p>
                        )}

                        {!loading && errorKey && (
                            <p className="py-3 text-sm text-red-300">
                                {t(errorKey)}
                            </p>
                        )}

                        {!loading && !errorKey && vehicles.length === 0 && (
                            <p className="py-3 text-sm text-slate-400">
                                {t("vehicles.list.status.empty")}
                            </p>
                        )}

                        {!loading &&
                            !errorKey &&
                            vehicles.map((vehicle) => (
                                <VehicleRow
                                    key={vehicle.id}
                                    vehicle={vehicle}
                                    fuelLabel={(fuel) => fuelLabel(fuel, t)}
                                />
                            ))}
                    </div>
                </section>
            </div>
        </main>
    );
};

const fuelLabel = (fuel: Vehicle["fuelType"], t: (key: string) => string): string => {
    switch (fuel) {
        case "essence":
            return t("vehicles.fuel.essence");
        case "diesel":
            return t("vehicles.fuel.diesel");
        case "electrique":
            return t("vehicles.fuel.electrique");
        case "hybride":
            return t("vehicles.fuel.hybride");
        case "gpl":
            return t("vehicles.fuel.gpl");
        default:
            return t("vehicles.fuel.other");
    }
};

export default VehiclesPage;

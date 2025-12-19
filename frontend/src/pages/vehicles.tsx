// frontend/src/pages/vehicles.tsx

import type { Vehicle } from "../../../shared/vehicle.type.ts";
import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import { getVehicles, createVehicle } from "@/services/vehicleService";
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

    // --- état formulaire ---
    const [isCreating, setIsCreating] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: "",
        plate: "",
        type: "",
        fuelType: "essence" as Vehicle["fuelType"],
        consumptionLPer100: ""
    });

    useEffect(() => {
        let cancelled = false;

        async function fetchVehicles() {
            try {
                setLoading(true);
                setErrorKey(null);

                const data = await getVehicles();
                if (!cancelled) {
                    setVehicles(data);
                }
            } catch (err: any) {
                if (cancelled) return;
                console.error("Erreur lors du chargement des véhicules :", err);
                setErrorKey("vehicles.error.unableToLoad");
                setVehicles([]);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchVehicles();

        return () => {
            cancelled = true;
        };
    }, []);

    const vehicleCount = vehicles.length;
    const distinctTypes = new Set(vehicles.map((v) => v.type || "Autre")).size;
    const distinctFuels = new Set(vehicles.map((v) => fuelLabel(v.fuelType, t))).size;

    const statusText =
        loading
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

    // --- HANDLE CHANGE ---
    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    // --- SUBMIT ---
    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!form.name.trim()) {
            setFormError("Le nom du véhicule est obligatoire.");
            return;
        }

        if (!form.fuelType) {
            setFormError("Le type de carburant est obligatoire.");
            return;
        }

        try {
            setSaving(true);
            setFormError(null);

            const payload = {
                name: form.name.trim(),
                plate: form.plate.trim() || undefined,
                type: form.type.trim() || undefined,
                fuelType: form.fuelType,
                consumptionLPer100:
                    form.consumptionLPer100 === ""
                        ? undefined
                        : Number(form.consumptionLPer100)
            };

            const newVehicle = await createVehicle(payload);

            setVehicles((prev) => [newVehicle, ...prev]);

            setForm({
                name: "",
                plate: "",
                type: "",
                fuelType: "essence",
                consumptionLPer100: ""
            });

            setIsCreating(false);
        } catch (err) {
            console.error("Erreur lors de la création :", err);
            setFormError("vehicles.error.createFail");
        } finally {
            setSaving(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 px-4 pb-24 pt-6">
            <div className="mx-auto max-w-5xl space-y-6">
                {/* Header */}
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
                        onClick={() => {
                            setIsCreating((prev) => !prev);
                            setFormError(null);
                        }}
                        className="inline-flex items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200 shadow-sm hover:bg-emerald-500/20"
                    >
                        {isCreating
                            ? t("vehicles.action.cancelNewVehicle") ?? "Annuler"
                            : t("vehicles.action.newVehicle")}
                    </button>
                </header>

                {/* Formulaire de création */}
                {isCreating && (
                    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-medium text-slate-100">
                                {t("vehicles.form.title") ?? "Ajouter un véhicule"}
                            </h2>
                            {formError && (
                                <p className="text-xs text-red-300">
                                    {formError}
                                </p>
                            )}
                        </div>

                        <form
                            className="grid gap-4 md:grid-cols-2"
                            onSubmit={handleSubmit}
                        >
                            {/* Nom */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    {t("vehicles.form.name") ?? "Nom du véhicule"}
                                </label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                                    placeholder="Ex : Clio Diesel"
                                />
                            </div>

                            {/* Immatriculation */}
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    {t("vehicles.form.plate") ?? "Immatriculation"}
                                </label>
                                <input
                                    name="plate"
                                    value={form.plate}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                                    placeholder="AB-123-CD"
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    {t("vehicles.form.type") ?? "Type de véhicule"}
                                </label>
                                <input
                                    name="type"
                                    value={form.type}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                                    placeholder="Citadine, SUV, etc."
                                />
                            </div>

                            {/* Carburant */}
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    {t("vehicles.form.fuelType") ?? "Type de carburant"}
                                </label>
                                <select
                                    name="fuelType"
                                    value={form.fuelType}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                                >
                                    <option value="essence">{t("vehicles.fuel.essence") ?? "Essence"}</option>
                                    <option value="diesel">{t("vehicles.fuel.diesel") ?? "Diesel"}</option>
                                    <option value="electrique">
                                        {t("vehicles.fuel.electrique") ?? "Électrique"}
                                    </option>
                                    <option value="hybride">{t("vehicles.fuel.hybride") ?? "Hybride"}</option>
                                    <option value="gpl">{t("vehicles.fuel.gpl") ?? "GPL"}</option>
                                </select>
                            </div>

                            {/* Consommation */}
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    {t("vehicles.form.consumption") ?? "Conso (L / 100 km)"}
                                </label>
                                <input
                                    name="consumptionLPer100"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={form.consumptionLPer100}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                                    placeholder="Ex : 6.2"
                                />
                            </div>

                            {/* Boutons */}
                            <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreating(false);
                                        setFormError(null);
                                    }}
                                    className="rounded-full border border-slate-700 px-4 py-1.5 text-xs text-slate-200 hover:bg-slate-800"
                                >
                                    {t("common.cancel") ?? "Annuler"}
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-medium text-emerald-950 hover:bg-emerald-400 disabled:opacity-60"
                                >
                                    {saving
                                        ? t("common.saving") ?? "Enregistrement…"
                                        : t("vehicles.form.submit") ?? "Enregistrer"}
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                {/* Cartes de synthèse */}
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

                {/* Liste des véhicules */}
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
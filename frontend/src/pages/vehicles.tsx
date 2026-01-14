// frontend/src/pages/vehicles.tsx

import type { Vehicle } from "../../../shared/vehicle.type.ts";
import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
    getVehicles,
    createVehicle,
    estimateConsumption,
    deleteVehicle,
} from "@/services/vehicleService";
import { useTranslation } from "@/language/useTranslation";

type SummaryCardProps = {
    label: string;
    value: string;
    helper: string;
};

type VehicleRowProps = {
    vehicle: Vehicle;
    fuelLabel: (fuel: Vehicle["fuelType"]) => string;
    onDelete: (id: Vehicle["id"]) => void;
    t: (key: string) => string;
};

const GlassCard = ({
                       children,
                       className = "",
                   }: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div
        className={[
            "rounded-2xl border border-white/10 bg-white/[0.06] p-5",
            "shadow-[0_20px_60px_-20px_rgba(0,0,0,0.65)] backdrop-blur-xl",
            className,
        ].join(" ")}
    >
        {children}
    </div>
);

const SummaryCard = ({ label, value, helper }: SummaryCardProps) => {
    return (
        <GlassCard className="p-4">
            <p className="text-xs text-white/55">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{value}</p>
            <p className="mt-1 text-xs text-emerald-300">{helper}</p>
        </GlassCard>
    );
};

const VehicleRow = ({ vehicle, fuelLabel, onDelete, t }: VehicleRowProps) => {
    return (
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-white truncate">{vehicle.name}</p>
                        {vehicle.plate && (
                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/70">
                {vehicle.plate}
              </span>
                        )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/65">
                        {vehicle.type && (
                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                {vehicle.type}
              </span>
                        )}
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
              {fuelLabel(vehicle.fuelType)}
            </span>
                        {vehicle.consumptionLPer100 && (
                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                {vehicle.consumptionLPer100} L / 100 km
              </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                    <button
                        type="button"
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                    >
                        {t("vehicles.actions.edit")}
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(vehicle.id)}
                        className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 font-medium text-red-200 transition hover:bg-red-500/15"
                    >
                        {t("vehicles.actions.delete")}
                    </button>
                </div>
            </div>
        </div>
    );
};

const VehiclesPage = () => {
    const { t } = useTranslation();

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorKey, setErrorKey] = useState<string | null>(null);
    const [estimating, setEstimating] = useState(false);

    // --- état formulaire ---
    const [isCreating, setIsCreating] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: "",
        plate: "",
        type: "",
        fuelType: "essence" as Vehicle["fuelType"],
        consumptionLPer100: "",
    });

    const [, setLastUnit] = useState<"L/100km" | "kWh/100km" | null>(null);

    useEffect(() => {
        let mounted = true;

        async function load() {
            try {
                setLoading(true);
                setErrorKey(null);

                const data = await getVehicles();
                if (!mounted) return;

                setVehicles(data);
            } catch (err) {
                console.error("Erreur lors du chargement des véhicules :", err);
                if (!mounted) return;
                setErrorKey("vehicles.error.unableToLoad");
                setVehicles([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();
        return () => {
            mounted = false;
        };
    }, []);

    const vehicleCount = vehicles.length;
    const distinctTypes = useMemo(
        () => new Set(vehicles.map((v) => v.type || "Autre")).size,
        [vehicles]
    );
    const distinctFuels = useMemo(
        () => new Set(vehicles.map((v) => fuelLabel(v.fuelType, t))).size,
        [vehicles, t]
    );

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
            [name]: value,
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
                    form.consumptionLPer100 === "" ? undefined : Number(form.consumptionLPer100),
            };

            const newVehicle = await createVehicle(payload);

            setVehicles((prev) => [newVehicle, ...prev]);

            setForm({
                name: "",
                plate: "",
                type: "",
                fuelType: "essence",
                consumptionLPer100: "",
            });

            setIsCreating(false);
        } catch (err) {
            console.error("Erreur lors de la création :", err);
            setFormError("vehicles.error.createFail");
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteVehicle(id: Vehicle["id"]) {
        const ok = window.confirm("Supprimer ce véhicule ?");
        if (!ok) return;

        try {
            await deleteVehicle(id);
            setVehicles((prev) => prev.filter((v) => v.id !== id));
        } catch (e: any) {
            console.error("Erreur suppression véhicule:", e);
            alert("Suppression impossible (trajets liés ?) ou erreur serveur.");
        }
    }

    async function handleEstimate() {
        if (!form.name.trim() || !form.fuelType) return;

        try {
            setEstimating(true);
            setFormError(null);

            const data = await estimateConsumption(form.name.trim(), form.fuelType);
            setLastUnit(data.unit);

            setForm((prev) => ({
                ...prev,
                name: data.matchedLabel || prev.name,
                type: data.type ? data.type : prev.type,
                consumptionLPer100: String(data.consumptionLPer100Max),
            }));
        } catch (err) {
            console.warn("Estimation conso impossible:", err);
        } finally {
            setEstimating(false);
        }
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-gray-950 text-white">
            {/* Background premium */}
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

            <main className="relative px-4 pb-24 pt-8">
                <div className="mx-auto max-w-5xl space-y-6">
                    {/* Header */}
                    <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-white/45">
                                {t("vehicles.title")}
                            </p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                                {t("vehicles.header")}
                            </h1>
                            <p className="mt-2 text-sm text-white/65">{t("vehicles.subtitle")}</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setIsCreating((prev) => !prev);
                                setFormError(null);
                            }}
                            className={[
                                "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
                                isCreating
                                    ? "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                                    : "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-[0_10px_30px_-12px_rgba(16,185,129,0.55)] hover:brightness-110",
                                "transition",
                            ].join(" ")}
                        >
                            {isCreating
                                ? t("vehicles.action.cancelNewVehicle") ?? "Annuler"
                                : t("vehicles.action.newVehicle")}
                        </button>
                    </header>

                    {/* Formulaire de création */}
                    {isCreating && (
                        <GlassCard className="space-y-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-sm font-semibold text-white">
                                        {t("vehicles.form.title") ?? "Ajouter un véhicule"}
                                    </h2>
                                    <p className="mt-1 text-xs text-white/55">
                                        Remplis les infos, et on peut auto-estimer la conso via le dataset.
                                    </p>
                                </div>
                                {formError && (
                                    <p className="text-xs text-red-300">{typeof formError === "string" ? t(formError) : formError}</p>
                                )}
                            </div>

                            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                                {/* Nom */}
                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-xs font-medium text-white/70">
                                        {t("vehicles.form.name") ?? "Nom du véhicule"}
                                    </label>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        onBlur={() => {
                                            if (form.consumptionLPer100 === "") handleEstimate();
                                        }}
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-green-400/40 focus:ring-2 focus:ring-green-400/20"
                                        placeholder="Ex : Clio Diesel"
                                    />
                                </div>

                                {/* Immatriculation */}
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-white/70">
                                        {t("vehicles.form.plate") ?? "Immatriculation"}
                                    </label>
                                    <input
                                        name="plate"
                                        value={form.plate}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-green-400/40 focus:ring-2 focus:ring-green-400/20"
                                        placeholder="AB-123-CD"
                                    />
                                </div>

                                {/* Type */}
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-white/70">
                                        {t("vehicles.form.type") ?? "Type de véhicule"}
                                    </label>
                                    <input
                                        name="type"
                                        value={form.type}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-green-400/40 focus:ring-2 focus:ring-green-400/20"
                                        placeholder="Citadine, SUV, etc."
                                    />
                                </div>

                                {/* Carburant */}
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-white/70">
                                        {t("vehicles.form.fuelType") ?? "Type de carburant"}
                                    </label>
                                    <select
                                        name="fuelType"
                                        value={form.fuelType}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-green-400/40 focus:ring-2 focus:ring-green-400/20"
                                    >
                                        <option className="bg-gray-950" value="essence">
                                            {t("vehicles.fuel.essence") ?? "Essence"}
                                        </option>
                                        <option className="bg-gray-950" value="diesel">
                                            {t("vehicles.fuel.diesel") ?? "Diesel"}
                                        </option>
                                        <option className="bg-gray-950" value="electrique">
                                            {t("vehicles.fuel.electrique") ?? "Électrique"}
                                        </option>
                                        <option className="bg-gray-950" value="hybride">
                                            {t("vehicles.fuel.hybride") ?? "Hybride"}
                                        </option>
                                        <option className="bg-gray-950" value="gpl">
                                            {t("vehicles.fuel.gpl") ?? "GPL"}
                                        </option>
                                    </select>
                                </div>

                                {/* Consommation */}
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-white/70">
                                        {t("vehicles.form.consumption") ?? "Conso (L / 100 km)"}
                                    </label>

                                    <div className="flex gap-2">
                                        <input
                                            name="consumptionLPer100"
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={form.consumptionLPer100}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-green-400/40 focus:ring-2 focus:ring-green-400/20"
                                            placeholder="Ex : 6.2"
                                        />

                                        <button
                                            type="button"
                                            onClick={handleEstimate}
                                            disabled={estimating || !form.name.trim()}
                                            className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-white/80 transition hover:bg-white/10 disabled:opacity-60"
                                            title="Auto-remplir depuis le dataset"
                                        >
                                            {estimating ? "Auto…" : "Auto"}
                                        </button>
                                    </div>
                                </div>

                                {/* Boutons */}
                                <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCreating(false);
                                            setFormError(null);
                                        }}
                                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                                    >
                                        {t("common.cancel") ?? "Annuler"}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(16,185,129,0.55)] transition hover:brightness-110 disabled:opacity-60"
                                    >
                                        {saving
                                            ? t("common.saving") ?? "Enregistrement…"
                                            : t("vehicles.form.submit") ?? "Enregistrer"}
                                    </button>
                                </div>
                            </form>
                        </GlassCard>
                    )}

                    {/* Cartes de synthèse */}
                    <section className="grid gap-4 md:grid-cols-3">
                        <SummaryCard
                            label={t("vehicles.summary.vehicles.label")}
                            value={loading ? "…" : vehicleCount.toString()}
                            helper={t("vehicles.summary.vehicles.helper")}
                        />
                        <SummaryCard
                            label={t("vehicles.summary.types.label")}
                            value={loading ? "…" : distinctTypes.toString()}
                            helper={t("vehicles.summary.types.helper")}
                        />
                        <SummaryCard
                            label={t("vehicles.summary.fuels.label")}
                            value={loading ? "…" : distinctFuels.toString()}
                            helper={t("vehicles.summary.fuels.helper")}
                        />
                    </section>

                    {/* Liste des véhicules */}
                    <GlassCard>
                        <div className="flex items-center justify-between gap-2">
                            <h2 className="text-sm font-semibold text-white/90">
                                {t("vehicles.list.title")}
                            </h2>
                            <p className="text-xs text-white/55">{statusText}</p>
                        </div>

                        <div className="mt-4 space-y-3">
                            {loading && (
                                <p className="py-2 text-sm text-white/60">
                                    {t("vehicles.list.status.loading")}
                                </p>
                            )}

                            {!loading && errorKey && (
                                <p className="py-2 text-sm text-red-300">{t(errorKey)}</p>
                            )}

                            {!loading && !errorKey && vehicles.length === 0 && (
                                <p className="py-2 text-sm text-white/60">
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
                                        onDelete={handleDeleteVehicle}
                                        t={t}
                                    />
                                ))}
                        </div>
                    </GlassCard>
                </div>
            </main>
        </div>
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

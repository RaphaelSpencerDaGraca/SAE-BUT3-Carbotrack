import { useEffect, useState } from "react";
import type { Trip } from "../../../../shared/trip.type";
import type { Vehicle } from "../../../../shared/vehicle.type";
import { useTranslation } from "@/language/useTranslation";
import { PUBLIC_TRANSPORTS } from "../../types/trips";
import { createVehicle } from "@/services/vehicleService";

type CreateTripPayload = {
    date: string;
    fromCity: string;
    toCity: string;
    distanceKm: number;
    vehicleId: string;
    tag?: string;
    co2Kg: number;
};

type Props = {
    open: boolean;
    onClose: () => void;
    vehicles?: Vehicle[];
    onSubmit: (payload: CreateTripPayload) => Promise<void>;
    saving?: boolean;
    submitError?: string | null;
    initialTrip?: Trip | null;
    onVehicleCreated?: () => void;
};

export default function TripFormModal({
                                          open,
                                          onClose,
                                          vehicles = [],
                                          onSubmit,
                                          saving = false,
                                          submitError = null,
                                          initialTrip = null,
                                          onVehicleCreated,
                                      }: Props) {
    const { t } = useTranslation();

    // --- LOGIQUE SPÉCIALE (Transport vs Perso) ---
    const [entryMode, setEntryMode] = useState<'PERSONAL' | 'PUBLIC'>('PERSONAL');
    const [selectedTransportKey, setSelectedTransportKey] = useState(PUBLIC_TRANSPORTS[0].key);

    // --- STATE FORMULAIRE ---
    const [form, setForm] = useState({
        date: "",
        fromCity: "",
        toCity: "",
        distanceKm: "",
        vehicleId: "",
        tag: "",
    });

    const [localError, setLocalError] = useState<string | null>(null);

    // SUPPRESSION DU TRI : On utilise directement 'vehicles'

    // Gestion touche Echap
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        if (open) window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    // Reset erreur à l'ouverture
    useEffect(() => {
        if (!open) return;
        setLocalError(null);
    }, [open]);

    // Gestion des changements de champs classiques
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    // Initialisation du formulaire
    useEffect(() => {
        if (!open) return;

        if (initialTrip) {
            setForm({
                date: String((initialTrip as any).date ?? ""),
                fromCity: String((initialTrip as any).fromCity ?? ""),
                toCity: String((initialTrip as any).toCity ?? ""),
                distanceKm: String((initialTrip as any).distanceKm ?? ""),
                vehicleId: String((initialTrip as any).vehicleId ?? ""),
                tag: String((initialTrip as any).tag ?? ""),
            });
            setEntryMode('PERSONAL');
        } else {
            const today = new Date().toISOString().split("T")[0];
            setForm({
                date: today,
                fromCity: "",
                toCity: "",
                distanceKm: "",
                // On prend le premier véhicule de la liste brute sans trier
                vehicleId: vehicles.length > 0 ? String(vehicles[0].id) : "",
                tag: "",
            });
            setEntryMode('PERSONAL');
        }
    }, [open, initialTrip, vehicles]);

    // --- CALCUL CO2 ---
    const calculateCo2 = (dist: number) => {
        if (!dist || dist <= 0) return 0;

        if (entryMode === 'PUBLIC') {
            const mode = PUBLIC_TRANSPORTS.find(t => t.key === selectedTransportKey);
            return mode ? (dist * mode.co2PerKm) / 1000 : 0;
        }

        // Mode Perso
        const v = vehicles.find((veh) => String(veh.id) === form.vehicleId);
        if (v && v.consumptionLPer100) {
            return (dist * v.consumptionLPer100 / 100) * 2.5;
        }
        return 0;
    };

    // --- SUBMIT ---
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLocalError(null);

        if (!form.date) return setLocalError("La date est obligatoire.");
        if (!form.fromCity.trim()) return setLocalError("La ville de départ est obligatoire.");
        if (!form.toCity.trim()) return setLocalError("La ville d’arrivée est obligatoire.");

        const distance = Number(form.distanceKm);
        if (!form.distanceKm || Number.isNaN(distance) || distance <= 0) {
            return setLocalError("La distance doit être un nombre > 0.");
        }

        if (entryMode === 'PERSONAL' && !form.vehicleId) {
            return setLocalError("Choisis un véhicule.");
        }

        try {
            let finalVehicleId = form.vehicleId;
            let finalCo2 = 0;

            if (entryMode === 'PUBLIC') {
                const mode = PUBLIC_TRANSPORTS.find(t => t.key === selectedTransportKey);
                if (!mode) return;

                finalCo2 = calculateCo2(distance);

                let targetVehicle = vehicles.find(v => v.name === mode.label);
                if (!targetVehicle) {
                    targetVehicle = await createVehicle({
                        name: mode.label,
                        type: 'Transport',
                        fuelType: 'autre',
                        consumptionLPer100: 0,
                        plate: ''
                    });
                    if (onVehicleCreated) onVehicleCreated();
                }

                if (targetVehicle) {
                    finalVehicleId = String(targetVehicle.id);
                }
            } else {
                finalCo2 = calculateCo2(distance);
            }

            await onSubmit({
                date: form.date,
                fromCity: form.fromCity.trim(),
                toCity: form.toCity.trim(),
                distanceKm: distance,
                vehicleId: finalVehicleId,
                tag: form.tag.trim() || undefined,
                co2Kg: finalCo2
            });

            if (!initialTrip) {
                const today = new Date().toISOString().split("T")[0];
                setForm({
                    date: today,
                    fromCity: "",
                    toCity: "",
                    distanceKm: "",
                    vehicleId: vehicles.length > 0 ? String(vehicles[0].id) : "",
                    tag: "",
                });
            }
        } catch (err) {
            console.error(err);
            setLocalError("Une erreur est survenue lors de la création.");
        }
    }

    const effectiveError = localError || submitError;

    if (!open) return null;

    const inputClass =
        "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-green-400/40 focus:ring-2 focus:ring-green-400/20 disabled:opacity-60";

    const labelClass = "mb-1 block text-xs font-medium text-white/70";

    return (
        <div className="fixed inset-0 z-50">
            {/* overlay */}
            <button
                type="button"
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                aria-label="Close"
            />

            {/* modal wrapper (center) */}
            <div className="relative mx-auto mt-20 w-[92%] max-w-xl">
                {/* modal */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-white shadow-[0_30px_90px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-white/45">
                                Trajets
                            </p>
                            <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                                {initialTrip ? "Modifier le trajet" : "Nouveau trajet"}
                            </h2>
                            <p className="mt-1 text-sm text-white/65">
                                Ajoute un trajet lié à un véhicule.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                        >
                            Fermer
                        </button>
                    </div>

                    {/* SÉLECTEUR D'ONGLETS */}
                    {!initialTrip && (
                        <div className="mt-5 flex rounded-xl border border-white/10 bg-white/5 p-1">
                            <button
                                type="button"
                                onClick={() => setEntryMode('PERSONAL')}
                                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                                    entryMode === 'PERSONAL'
                                        ? 'bg-white/10 text-white shadow-sm'
                                        : 'text-white/50 hover:text-white'
                                }`}
                            >
                                Mon Véhicule
                            </button>
                            <button
                                type="button"
                                onClick={() => setEntryMode('PUBLIC')}
                                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                                    entryMode === 'PUBLIC'
                                        ? 'bg-blue-500/20 text-blue-200 shadow-sm'
                                        : 'text-white/50 hover:text-white'
                                }`}
                            >
                                Transport Public
                            </button>
                        </div>
                    )}

                    {/* Error */}
                    {effectiveError && (
                        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                            {effectiveError}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className={labelClass} htmlFor="date">
                                    Date
                                </label>
                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            {/* SELECTEUR VEHICULE OU TRANSPORT */}
                            <div>
                                {entryMode === 'PERSONAL' ? (
                                    <>
                                        <label className={labelClass} htmlFor="vehicleId">
                                            Véhicule
                                        </label>
                                        <select
                                            id="vehicleId"
                                            name="vehicleId"
                                            value={form.vehicleId}
                                            onChange={handleChange}
                                            className={inputClass}
                                        >
                                            <option className="bg-gray-950" value="">
                                                — Choisir —
                                            </option>
                                            {/* UTILISATION DIRECTE DE vehicles SANS TRI */}
                                            {vehicles.map((v) => (
                                                <option key={v.id} className="bg-gray-950" value={String(v.id)}>
                                                    {v.name}
                                                </option>
                                            ))}
                                        </select>
                                        {vehicles.length === 0 && (
                                            <p className="mt-2 text-xs text-white/45">
                                                Aucun véhicule : ajoute-en un avant de créer un trajet.
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <label className={labelClass} htmlFor="transport">
                                            Type de transport
                                        </label>
                                        <select
                                            id="transport"
                                            value={selectedTransportKey}
                                            onChange={(e) => setSelectedTransportKey(e.target.value)}
                                            className={`${inputClass} focus:border-blue-400/40 focus:ring-blue-400/20`}
                                        >
                                            {PUBLIC_TRANSPORTS.map((t) => (
                                                <option key={t.key} className="bg-gray-950" value={t.key}>
                                                    {t.label} ({t.co2PerKm}g/km)
                                                </option>
                                            ))}
                                        </select>
                                    </>
                                )}
                            </div>

                            <div>
                                <label className={labelClass} htmlFor="fromCity">
                                    Départ
                                </label>
                                <input
                                    id="fromCity"
                                    name="fromCity"
                                    type="text"
                                    value={form.fromCity}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="Ex: Paris"
                                />
                            </div>

                            <div>
                                <label className={labelClass} htmlFor="toCity">
                                    Arrivée
                                </label>
                                <input
                                    id="toCity"
                                    name="toCity"
                                    type="text"
                                    value={form.toCity}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="Ex: Lyon"
                                />
                            </div>

                            <div>
                                <label className={labelClass} htmlFor="distanceKm">
                                    Distance (km)
                                </label>
                                <input
                                    id="distanceKm"
                                    name="distanceKm"
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={form.distanceKm}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="Ex: 465"
                                />
                            </div>

                            <div>
                                <label className={labelClass} htmlFor="tag">
                                    Tag (optionnel)
                                </label>
                                <input
                                    id="tag"
                                    name="tag"
                                    type="text"
                                    value={form.tag}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="Ex: boulot"
                                />
                            </div>
                        </div>

                        {/* ESTIMATION CO2 */}
                        <div className={`mt-1 flex items-center justify-between rounded-xl border border-white/5 px-4 py-2 ${
                            entryMode === 'PUBLIC' ? 'bg-blue-500/10 text-blue-200' : 'bg-green-500/10 text-green-200'
                        }`}>
                            <span className="text-xs font-medium">Impact CO2 estimé</span>
                            <span className="text-sm font-bold">
                                {calculateCo2(Number(form.distanceKm)).toFixed(2)} kg
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={saving}
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-60"
                            >
                                Annuler
                            </button>

                            <button
                                type="submit"
                                disabled={saving || (entryMode === 'PERSONAL' && vehicles.length === 0)}
                                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(16,185,129,0.55)] transition hover:brightness-110 disabled:opacity-60 ${
                                    entryMode === 'PUBLIC'
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                                        : 'bg-gradient-to-r from-green-600 to-emerald-600'
                                }`}
                            >
                                {saving ? "Enregistrement…" : initialTrip ? "Mettre à jour" : "Créer"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer hint */}
                <p className="mt-3 text-center text-xs text-white/40">
                    Astuce : Échap pour fermer le modal.
                </p>
            </div>
        </div>
    );
}
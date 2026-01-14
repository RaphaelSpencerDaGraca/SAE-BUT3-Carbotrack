// frontend/src/components/trips/TripFormModal.tsx
import { useEffect, useMemo, useState } from "react";
import type { Vehicle } from "../../../../shared/vehicle.type";
import type { Trip } from "../../../../shared/trip.type";

type CreateTripPayload = {
    date: string;
    fromCity: string;
    toCity: string;
    distanceKm: number;
    vehicleId: string;
    tag?: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    vehicles?: Vehicle[];
    onSubmit: (payload: CreateTripPayload) => Promise<void>;
    saving?: boolean;
    submitError?: string | null;
    initialTrip?: Trip | null;
};

export default function TripFormModal({
                                          open,
                                          onClose,
                                          vehicles = [],
                                          onSubmit,
                                          saving = false,
                                          submitError = null,
                                          initialTrip = null,
                                      }: Props) {
    const [form, setForm] = useState({
        date: "",
        fromCity: "",
        toCity: "",
        distanceKm: "",
        vehicleId: "",
        tag: "",
    });

    const [localError, setLocalError] = useState<string | null>(null);

    const vehiclesSorted = useMemo(() => {
        return [...vehicles].sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
    }, [vehicles]);

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        if (open) window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    useEffect(() => {
        if (!open) return;
        setLocalError(null);
    }, [open]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

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
        } else {
            setForm({
                date: "",
                fromCity: "",
                toCity: "",
                distanceKm: "",
                vehicleId: "",
                tag: "",
            });
        }
    }, [open, initialTrip]);

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

        if (!form.vehicleId) return setLocalError("Choisis un véhicule.");

        await onSubmit({
            date: form.date,
            fromCity: form.fromCity.trim(),
            toCity: form.toCity.trim(),
            distanceKm: distance,
            vehicleId: form.vehicleId,
            tag: form.tag.trim() || undefined,
        });

        // Reset après succès
        if (!initialTrip) {
            setForm({
                date: "",
                fromCity: "",
                toCity: "",
                distanceKm: "",
                vehicleId: "",
                tag: "",
            });
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

                            <div>
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
                                    {vehiclesSorted.map((v) => (
                                        <option key={v.id} className="bg-gray-950" value={String(v.id)}>
                                            {v.name}
                                        </option>
                                    ))}
                                </select>

                                {vehiclesSorted.length === 0 && (
                                    <p className="mt-2 text-xs text-white/45">
                                        Aucun véhicule : ajoute-en un avant de créer un trajet.
                                    </p>
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
                                disabled={saving || vehiclesSorted.length === 0}
                                className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(16,185,129,0.55)] transition hover:brightness-110 disabled:opacity-60"
                            >
                                {saving ? "Enregistrement…" : initialTrip ? "Mettre à jour" : "Créer"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* little hint footer (optional, subtle) */}
                <p className="mt-3 text-center text-xs text-white/40">
                    Astuce : Échap pour fermer le modal.
                </p>
            </div>
        </div>
    );
}

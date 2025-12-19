// frontend/src/components/trips/TripFormModal.tsx
import { useEffect, useMemo, useState } from "react";
import type { Vehicle } from "../../../../shared/vehicle.type";

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
};

export default function TripFormModal({
                                          open,
                                          onClose,
                                          vehicles = [],
                                          onSubmit,
                                          saving = false,
                                          submitError = null,
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

    if (!open) return null;

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

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
        setForm({
            date: "",
            fromCity: "",
            toCity: "",
            distanceKm: "",
            vehicleId: "",
            tag: "",
        });
    }

    const effectiveError = localError || submitError;

    return (
        <div className="fixed inset-0 z-50">
            {/* overlay */}
            <button
                type="button"
                onClick={onClose}
                className="absolute inset-0 bg-black/60"
                aria-label="Close"
            />

            {/* modal */}
            <div className="relative mx-auto mt-20 w-[92%] max-w-xl rounded-2xl border border-slate-800 bg-slate-950 p-4 text-slate-50 shadow-xl">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">Trajets</p>
                        <h2 className="mt-1 text-lg font-semibold">Nouveau trajet</h2>
                        <p className="mt-1 text-sm text-slate-400">Ajoute un trajet lié à un véhicule.</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:bg-slate-900"
                    >
                        Fermer
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
                    {effectiveError && (
                        <div className="rounded-xl border border-red-800 bg-red-950/40 px-3 py-2 text-sm text-red-200">
                            {effectiveError}
                        </div>
                    )}

                    <div className="grid gap-3 md:grid-cols-2">
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
                            <input
                                name="date"
                                type="date"
                                value={form.date}
                                onChange={handleChange}
                                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Véhicule</label>
                            <select
                                name="vehicleId"
                                value={form.vehicleId}
                                onChange={handleChange}
                                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                            >
                                <option value="">— Choisir —</option>
                                {vehiclesSorted.map((v) => (
                                    <option key={v.id} value={String(v.id)}>
                                        {v.name}
                                    </option>
                                ))}
                            </select>
                            {vehiclesSorted.length === 0 && (
                                <p className="mt-1 text-xs text-slate-500">
                                    Aucun véhicule : ajoute-en un avant de créer un trajet.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Départ</label>
                            <input
                                name="fromCity"
                                type="text"
                                value={form.fromCity}
                                onChange={handleChange}
                                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                                placeholder="Ex: Paris"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Arrivée</label>
                            <input
                                name="toCity"
                                type="text"
                                value={form.toCity}
                                onChange={handleChange}
                                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                                placeholder="Ex: Lyon"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Distance (km)</label>
                            <input
                                name="distanceKm"
                                type="number"
                                min="0"
                                step="0.1"
                                value={form.distanceKm}
                                onChange={handleChange}
                                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                                placeholder="Ex: 465"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Tag (optionnel)</label>
                            <input
                                name="tag"
                                type="text"
                                value={form.tag}
                                onChange={handleChange}
                                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                                placeholder="Ex: boulot"
                            />
                        </div>
                    </div>

                    <div className="mt-2 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full border border-slate-700 px-4 py-1.5 text-xs text-slate-200 hover:bg-slate-900"
                            disabled={saving}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={saving || vehiclesSorted.length === 0}
                            className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-medium text-emerald-950 hover:bg-emerald-400 disabled:opacity-60"
                        >
                            {saving ? "Enregistrement…" : "Créer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

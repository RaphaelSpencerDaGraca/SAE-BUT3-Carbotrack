// frontend/src/components/trips/TripFormModal.tsx
import { useEffect, useState } from "react";
import type { Vehicle } from "../../../../shared/vehicle.type";

type Props = {
    open: boolean;
    onClose: () => void;
    vehicles?: Vehicle[];
};

export default function TripFormModal({ open, onClose, vehicles = [] }: Props) {
    const [form, setForm] = useState({
        date: "",
        fromCity: "",
        toCity: "",
        distanceKm: "",
        vehicleId: "",
        tag: "",
    });

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        if (open) window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // UI only: tu verras le payload en console
        console.log("Trip payload:", form);
        onClose();
    }

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
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                            Trajets
                        </p>
                        <h2 className="mt-1 text-lg font-semibold">Nouveau trajet</h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Remplis les infos, on branchera l’enregistrement ensuite.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:bg-slate-900"
                    >
                        Fermer
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-300">
                            Date
                        </label>
                        <input
                            name="date"
                            type="date"
                            value={form.date}
                            onChange={handleChange}
                            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-300">
                            Véhicule
                        </label>
                        <select
                            name="vehicleId"
                            value={form.vehicleId}
                            onChange={handleChange}
                            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                        >
                            <option value="">(optionnel)</option>
                            {vehicles.map((v) => (
                                <option key={v.id} value={String(v.id)}>
                                    {v.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-300">
                            Ville de départ
                        </label>
                        <input
                            name="fromCity"
                            value={form.fromCity}
                            onChange={handleChange}
                            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                            placeholder="Paris"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-300">
                            Ville d’arrivée
                        </label>
                        <input
                            name="toCity"
                            value={form.toCity}
                            onChange={handleChange}
                            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                            placeholder="Orléans"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-300">
                            Distance (km)
                        </label>
                        <input
                            name="distanceKm"
                            type="number"
                            min="0"
                            step="0.1"
                            value={form.distanceKm}
                            onChange={handleChange}
                            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                            placeholder="132"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-300">
                            Tag
                        </label>
                        <input
                            name="tag"
                            value={form.tag}
                            onChange={handleChange}
                            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                            placeholder="Domicile → Mission"
                        />
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full border border-slate-700 px-4 py-1.5 text-xs text-slate-200 hover:bg-slate-900"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-medium text-emerald-950 hover:bg-emerald-400"
                        >
                            Enregistrer (test)
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

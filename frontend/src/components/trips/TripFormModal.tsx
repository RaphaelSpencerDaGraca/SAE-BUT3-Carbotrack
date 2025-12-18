import { useEffect, useMemo, useState } from "react";

export type TripFormValues = {
    date: string;          // YYYY-MM-DD
    fromCity: string;
    toCity: string;
    distanceKm: string;    // on garde string pour l'input, conversion côté parent si besoin
    vehicleId: string;     // select
    tag: string;
};

type VehicleOption = {
    id: string | number;
    name: string;
    plate?: string | null;
};

type TripFormModalProps = {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: TripFormValues) => void | Promise<void>;
    vehicles: VehicleOption[];
    title?: string;
};

const initialValues: TripFormValues = {
    date: "",
    fromCity: "",
    toCity: "",
    distanceKm: "",
    vehicleId: "",
    tag: "",
};

export default function TripFormModal({
                                          open,
                                          onClose,
                                          onSubmit,
                                          vehicles,
                                          title = "Ajouter un trajet",
                                      }: TripFormModalProps) {
    const [values, setValues] = useState<TripFormValues>(initialValues);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const canSubmit = useMemo(() => {
        return (
            values.date.trim() &&
            values.fromCity.trim() &&
            values.toCity.trim() &&
            values.distanceKm.trim() &&
            values.vehicleId.trim()
        );
    }, [values]);

    useEffect(() => {
        if (!open) return;
        // reset à l’ouverture (si tu veux conserver, supprime ça)
        setValues(initialValues);
        setError(null);
        setSaving(false);
    }, [open]);

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        if (open) window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!canSubmit) {
            setError("Merci de remplir les champs obligatoires.");
            return;
        }

        // mini check distance
        const n = Number(values.distanceKm);
        if (Number.isNaN(n) || n <= 0) {
            setError("La distance doit être un nombre > 0.");
            return;
        }

        try {
            setSaving(true);
            await onSubmit(values);
            onClose();
        } catch (err) {
            console.error(err);
            setError("Impossible d’enregistrer le trajet (front).");
        } finally {
            setSaving(false);
        }
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* overlay */}
            <button
                type="button"
                aria-label="Fermer"
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* modal */}
            <div className="relative mx-auto mt-16 w-[92vw] max-w-2xl">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 text-slate-50 shadow-xl">
                    <div className="flex items-start justify-between gap-4 border-b border-slate-800 px-5 py-4">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Trajets
                            </p>
                            <h2 className="mt-1 text-lg font-semibold">{title}</h2>
                            <p className="mt-1 text-sm text-slate-400">
                                Saisie rapide d’un trajet (UI seulement).
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-900"
                        >
                            Fermer
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="px-5 py-5">
                        {error && (
                            <div className="mb-4 rounded-xl border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-200">
                                {error}
                            </div>
                        )}

                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Date */}
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Date <span className="text-red-300">*</span>
                                </label>
                                <input
                                    name="date"
                                    type="date"
                                    value={values.date}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                                    required
                                />
                            </div>

                            {/* Véhicule */}
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Véhicule <span className="text-red-300">*</span>
                                </label>
                                <select
                                    name="vehicleId"
                                    value={values.vehicleId}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                                    required
                                >
                                    <option value="">— Sélectionner —</option>
                                    {vehicles.map((v) => (
                                        <option key={String(v.id)} value={String(v.id)}>
                                            {v.name}{v.plate ? ` (${v.plate})` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Départ */}
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Ville de départ <span className="text-red-300">*</span>
                                </label>
                                <input
                                    name="fromCity"
                                    value={values.fromCity}
                                    onChange={handleChange}
                                    placeholder="Ex : Paris"
                                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                                    required
                                />
                            </div>

                            {/* Arrivée */}
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Ville d’arrivée <span className="text-red-300">*</span>
                                </label>
                                <input
                                    name="toCity"
                                    value={values.toCity}
                                    onChange={handleChange}
                                    placeholder="Ex : Orléans"
                                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                                    required
                                />
                            </div>

                            {/* Distance */}
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Distance (km) <span className="text-red-300">*</span>
                                </label>
                                <input
                                    name="distanceKm"
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={values.distanceKm}
                                    onChange={handleChange}
                                    placeholder="Ex : 135"
                                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                                    required
                                />
                            </div>

                            {/* Tag */}
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Tag (optionnel)
                                </label>
                                <input
                                    name="tag"
                                    value={values.tag}
                                    onChange={handleChange}
                                    placeholder="Ex : Domicile → Mission"
                                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                                />
                            </div>

                            {/* Note (optionnel) */}
                            <div className="md:col-span-2">
                                <p className="text-xs text-slate-500">
                                    Astuce : tu peux fermer avec <span className="text-slate-300">Esc</span>.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-200 hover:bg-slate-900"
                            >
                                Annuler
                            </button>

                            <button
                                type="submit"
                                disabled={!canSubmit || saving}
                                className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-medium text-emerald-950 hover:bg-emerald-400 disabled:opacity-60"
                            >
                                {saving ? "Enregistrement…" : "Ajouter le trajet"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

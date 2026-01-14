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

type TripFormModalProps = {
    open: boolean;
    onClose: () => void;
    vehicles: Vehicle[];
    onSubmit: (payload: CreateTripPayload) => Promise<void>;
    initialTrip?: Trip | null;
    onVehicleCreated?: () => void;
};

const TripFormModal = ({
                           open,
                           onClose,
                           vehicles,
                           onSubmit,
                           initialTrip,
                           onVehicleCreated
                       }: TripFormModalProps) => {
    const { t } = useTranslation();

    const [entryMode, setEntryMode] = useState<'PERSONAL' | 'PUBLIC'>('PERSONAL');

    const [date, setDate] = useState("");
    const [fromCity, setFromCity] = useState("");
    const [toCity, setToCity] = useState("");
    const [distanceKm, setDistanceKm] = useState<number | "">("");
    const [vehicleId, setVehicleId] = useState("");
    const [tag, setTag] = useState("");
    const [loading, setLoading] = useState(false);

    const [selectedTransportKey, setSelectedTransportKey] = useState(PUBLIC_TRANSPORTS[0].key);

    useEffect(() => {
        if (open) {
            if (initialTrip) {
                setDate(initialTrip.date);
                setFromCity(initialTrip.fromCity);
                setToCity(initialTrip.toCity);
                setDistanceKm(initialTrip.distanceKm);
                setVehicleId(initialTrip.vehicleId?.toString() ?? "");
                setTag(initialTrip.tag || "");
                setEntryMode('PERSONAL');
            } else {
                const today = new Date().toISOString().split("T")[0];
                setDate(today);
                setFromCity("");
                setToCity("");
                setDistanceKm("");
                setTag("");
                if (vehicles.length > 0) {
                    setVehicleId(vehicles[0].id.toString());
                }
                setEntryMode('PERSONAL');
            }
        }
    }, [open, initialTrip, vehicles]);

    const calculateCo2 = (dist: number) => {
        if (!dist || dist <= 0) return 0;

        if (entryMode === 'PUBLIC') {
            const mode = PUBLIC_TRANSPORTS.find(t => t.key === selectedTransportKey);
            return mode ? (dist * mode.co2PerKm) / 1000 : 0;
        }

        const v = vehicles.find((veh) => veh.id.toString() === vehicleId);
        if (v && v.consumptionLPer100) {
            return (dist * v.consumptionLPer100 / 100) * 2.5;
        }
        
        return 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dist = Number(distanceKm);
            let finalVehicleId = vehicleId;
            let finalCo2 = 0;

            if (entryMode === 'PUBLIC') {
                const mode = PUBLIC_TRANSPORTS.find(t => t.key === selectedTransportKey);
                if (!mode) return;

                finalCo2 = calculateCo2(dist);

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
                    finalVehicleId = targetVehicle.id.toString();
                }

            } else {
                finalCo2 = calculateCo2(dist);
            }

            await onSubmit({
                date,
                fromCity,
                toCity,
                distanceKm: dist,
                vehicleId: finalVehicleId,
                tag,
                co2Kg: finalCo2
            });
            
            onClose(); 
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-gray-950 p-6 shadow-2xl">
                
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">
                        {initialTrip ? t("trips.modal.editTitle") : t("trips.modal.newTitle")}
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white transition"
                    >
                        ✕
                    </button>
                </div>

                {!initialTrip && (
                    <div className="mb-6 flex rounded-xl border border-white/10 bg-white/5 p-1">
                        <button
                            type="button"
                            onClick={() => setEntryMode('PERSONAL')}
                            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                                entryMode === 'PERSONAL' 
                                    ? 'bg-emerald-600 text-white shadow-md' 
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            Mon Véhicule
                        </button>
                        <button
                            type="button"
                            onClick={() => setEntryMode('PUBLIC')}
                            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                                entryMode === 'PUBLIC' 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            Transport Public
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-white/60">
                            {t("trips.modal.date")}
                        </label>
                        <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-white/60">
                                {t("trips.modal.from")}
                            </label>
                            <input
                                type="text"
                                required
                                value={fromCity}
                                onChange={(e) => setFromCity(e.target.value)}
                                placeholder="Paris"
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/20 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-white/60">
                                {t("trips.modal.to")}
                            </label>
                            <input
                                type="text"
                                required
                                value={toCity}
                                onChange={(e) => setToCity(e.target.value)}
                                placeholder="Lyon"
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/20 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-white/60">
                                {t("trips.modal.distance")}
                            </label>
                            <input
                                type="number"
                                required
                                min="0.1"
                                step="0.1"
                                value={distanceKm}
                                onChange={(e) => setDistanceKm(e.target.value === "" ? "" : Number(e.target.value))}
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-white/60">
                                {t("trips.modal.tag")}
                            </label>
                            <input
                                type="text"
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                                placeholder="Travail, Vacances..."
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/20 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    {entryMode === 'PERSONAL' ? (
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-white/60">
                                {t("trips.modal.vehicle")}
                            </label>
                            <select
                                required
                                value={vehicleId}
                                onChange={(e) => setVehicleId(e.target.value)}
                                className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 [&>option]:bg-gray-900"
                            >
                                {vehicles.length === 0 && <option value="">Aucun véhicule</option>}
                                {vehicles.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-white/60">
                                Type de transport
                            </label>
                            <select
                                value={selectedTransportKey}
                                onChange={(e) => setSelectedTransportKey(e.target.value)}
                                className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 [&>option]:bg-gray-900"
                            >
                                {PUBLIC_TRANSPORTS.map((t) => (
                                    <option key={t.key} value={t.key}>
                                        {t.label} ({t.co2PerKm}g/km)
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className={`mt-2 flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 transition-colors ${
                        entryMode === 'PUBLIC' ? 'bg-blue-500/10' : 'bg-emerald-500/10'
                    }`}>
                        <span className="text-sm font-medium text-white/70">Impact CO2 estimé</span>
                        <div className="text-right">
                            <span className={`text-lg font-bold ${
                                entryMode === 'PUBLIC' ? 'text-blue-300' : 'text-emerald-300'
                            }`}>
                                {calculateCo2(Number(distanceKm)).toFixed(2)}
                            </span>
                            <span className="ml-1 text-sm font-normal text-white/50">kg</span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
                        >
                            {t("trips.modal.cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`rounded-xl px-6 py-2 text-sm font-bold text-white shadow-lg transition hover:brightness-110 ${
                                entryMode === 'PUBLIC' 
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                                    : 'bg-gradient-to-r from-emerald-600 to-teal-600'
                            }`}
                        >
                            {loading ? "..." : (initialTrip ? t("trips.modal.submitEdit") : t("trips.modal.submitCreate"))}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TripFormModal;
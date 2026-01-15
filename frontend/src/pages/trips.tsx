// frontend/src/pages/trips.tsx
import { useEffect, useMemo, useState } from "react";
import type { Trip } from "../../../shared/trip.type.ts";
import type { Vehicle } from "../../../shared/vehicle.type.ts";
import { useTranslation } from "@/language/useTranslation.ts";
import TripFormModal from "@/components/trips/TripFormModal";
import { getVehicles } from "@/services/vehicleService";
import { deleteTrip, updateTrip } from "@/services/tripService";

type CreateTripPayload = {
    date: string;
    fromCity: string;
    toCity: string;
    distanceKm: number;
    vehicleId: string;
    tag?: string;
    co2Kg?: number;
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
            "rounded-2xl border border-white/10 bg-white/[0.06]",
            "shadow-[0_20px_60px_-20px_rgba(0,0,0,0.65)] backdrop-blur-xl",
            className,
        ].join(" ")}
    >
        {children}
    </div>
);

const TripsPage = () => {
    const { t } = useTranslation();

    const [trips, setTrips] = useState<Trip[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [openModal, setOpenModal] = useState(false);
    const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

    const API_BASE = import.meta.env.VITE_API_URL ?? "/api";
    const getToken = () => localStorage.getItem("token");

    const fetchTrips = async () => {
        const token = getToken();
        const res = await fetch(`${API_BASE}/trips`, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });

        if (res.status === 401) {
            throw new Error(t("common.error")); // Ou un message spécifique pour auth
        }
        if (!res.ok) {
            throw new Error(t("trips.error.load"));
        }

        const data: Trip[] = await res.json();
        setTrips(data);
    };

    const fetchVehicles = async () => {
        const v = await getVehicles();
        setVehicles(v);
    };

    // Fonction passée au modal pour recharger la liste si un véhicule "transport" est créé auto
    const refreshVehicles = async () => {
        await fetchVehicles();
    };

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                await Promise.all([fetchTrips(), fetchVehicles()]);
            } catch (err) {
                console.error("Erreur chargement trips/vehicles :", err);
                setError(err instanceof Error ? err.message : t("common.error"));
            } finally {
                setLoading(false);
            }
        };

        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCreateTrip = async (payload: CreateTripPayload) => {
        const token = getToken();

        const res = await fetch(`${API_BASE}/trips`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(payload),
        });

        if (res.status === 401) {
            throw new Error(t("common.error"));
        }
        if (!res.ok) {
            const txt = await res.text().catch(() => "");
            throw new Error(txt || t("trips.error.create"));
        }

        const created: Trip = await res.json();
        setTrips((prev) => [created, ...prev]);
        setOpenModal(false);
    };

    const handleSubmitTrip = async (payload: CreateTripPayload) => {
        try {
            if (editingTrip) {
                await updateTrip(editingTrip.id, payload);
                await fetchTrips();
                setEditingTrip(null);
                setOpenModal(false);
            } else {
                await handleCreateTrip(payload);
            }
        } catch (e) {
            console.error("Erreur submit trip:", e);
            throw e;
        }
    };

    async function handleDeleteTrip(id: Trip["id"]) {
        const ok = window.confirm(t("trips.delete.confirm"));
        if (!ok) return;

        try {
            await deleteTrip(id);
            setTrips((prev) => prev.filter((t) => t.id !== id));
        } catch (err) {
            console.error("Erreur suppression trajet:", err);
            alert(t("trips.delete.error"));
        }
    }

    // Petites helpers UI
    const countText = useMemo(() => {
        if (loading) return "…";
        if (error) return t("trips.list.status.error");
        return `${trips.length} ${t("trips.list.countSuffix")}`;
    }, [loading, error, trips.length, t]);

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
                                {t("trips.title")}
                            </p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                                {t("trips.header")}
                            </h1>
                            <p className="mt-2 text-sm text-white/65">{t("trips.subtitle")}</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setOpenModal(true)}
                            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(16,185,129,0.55)] transition hover:brightness-110"
                        >
                            {t("trips.action.newTrip")}
                        </button>
                    </header>

                    {/* List */}
                    <GlassCard>
                        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-5 py-4">
                            <h2 className="text-sm font-semibold text-white/90">
                                {t("trips.list.title")}
                            </h2>

                            {loading ? (
                                <span className="text-xs text-white/45">{t("common.loading")}</span>
                            ) : error ? (
                                <span className="text-xs text-red-300">{t("trips.list.status.error")}</span>
                            ) : (
                                <span className="text-xs text-white/45">
                                    {trips.length} {t("trips.list.countSuffix")}
                                </span>
                            )}
                        </div>

                        {loading ? (
                            <div className="px-5 py-10 text-center text-sm text-white/60">
                                {t("common.loading")}
                            </div>
                        ) : error ? (
                            <div className="px-5 py-10 text-center text-sm text-red-300">
                                {error}
                            </div>
                        ) : trips.length === 0 ? (
                            <div className="px-5 py-10 text-center text-sm text-white/60">
                                {t("trips.list.empty")}
                            </div>
                        ) : (
                            <ul className="space-y-3 px-5 py-4">
                                {trips.map((trip) => (
                                    <li
                                        key={trip.id}
                                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                                    >
                                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-white">
                                                    {trip.fromCity} → {trip.toCity}
                                                </p>

                                                <p className="mt-1 text-xs text-white/55">
                                                    {trip.date} · {trip.distanceKm} km · {trip.vehicleName}
                                                </p>

                                                {trip.tag && (
                                                    <span className="mt-2 inline-flex rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/70">
                                                        {trip.tag}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between gap-4 md:justify-end">
                                                <div className="text-right">
                                                    <p className="text-xs text-white/55">{t("trips.list.co2Label")}</p>
                                                    <p className="text-sm font-semibold text-emerald-300">
                                                        {trip.co2Kg.toFixed(1)} kg
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingTrip(trip);
                                                            setOpenModal(true);
                                                        }}
                                                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                                                    >
                                                        {t("trips.actions.edit")}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteTrip(trip.id)}
                                                        className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/15"
                                                    >
                                                        {t("trips.actions.delete")}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </GlassCard>
                </div>

                <TripFormModal
                    open={openModal}
                    onClose={() => {
                        setOpenModal(false);
                        setEditingTrip(null);
                    }}
                    vehicles={vehicles}
                    onSubmit={handleSubmitTrip}
                    initialTrip={editingTrip}
                    onVehicleCreated={refreshVehicles}
                />
            </main>
        </div>
    );
};

export default TripsPage;
// frontend/src/pages/dashboard.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "@/language/useTranslation";
import { getVehicles } from "@/services/vehicleService";
import { getTrips } from "@/services/tripService";
// 1. On importe le service existant, exactement comme pour getTrips
import { getUserProfile } from "@/services/userProfileService"; 
import { getCo2Benchmark } from "@/services/co2StatService";
import type { Vehicle } from "../../../shared/vehicle.type";
import type { Trip } from "../../../shared/trip.type";

// --- Types ---
type StatCardProps = {
    label: string;
    value: string;
    helper: string;
    helperClassName?: string;
};

// Interface locale pour le profil (pour le typage du state)
interface UserProfileData {
    user_id: string;
    emission_co2_transport: number | null;
    emission_co2_lifestyle: number | null;
    pseudo?: string;
    genre?: string;
}

// --- Composants UI ---
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

const StatCard = ({ label, value, helper, helperClassName }: StatCardProps) => {
    return (
        <GlassCard className="p-4">
            <p className="text-xs text-white/55">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
                {value}
            </p>
            <p className={`mt-1 text-xs ${helperClassName ?? "text-emerald-300"}`}>
                {helper}
            </p>
        </GlassCard>
    );
};

// --- Utils ---
function interpolate(template: string, values: Record<string, string>): string {
    return template.replace(/\{(\w+)}/g, (match, key) => {
        return Object.prototype.hasOwnProperty.call(values, key) ? values[key] : match;
    });
}

function formatPercent(value: number): string {
    const rounded1 = Math.round(value * 10) / 10;
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(rounded1);
}

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { t } = useTranslation();

    // États existants
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [vehiclesLoading, setVehiclesLoading] = useState(false);

    const [trips, setTrips] = useState<Trip[]>([]);
    const [tripsLoading, setTripsLoading] = useState(false);

    // 2. Nouvel état pour stocker le profil récupéré via le service
    const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
    const [profileLoading, setProfileLoading] = useState(false);

    // Chargement Véhicules
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setVehiclesLoading(true);
                const data = await getVehicles();
                if (!mounted) return;
                setVehicles(data);
            } catch (e) {
                console.error("Erreur chargement véhicules:", e);
                if (!mounted) return;
                setVehicles([]);
            } finally {
                if (mounted) setVehiclesLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    // Chargement Trajets
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setTripsLoading(true);
                const data = await getTrips();
                if (!mounted) return;
                setTrips(data);
            } catch (e) {
                console.error("Erreur chargement trajets:", e);
                if (!mounted) return;
                setTrips([]);
            } finally {
                if (mounted) setTripsLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    // 3. Chargement Profil (Utilisation du service existant)
    useEffect(() => {
        let mounted = true;
        const userId = (user as any)?.id || (user as any)?.user_id;

        if (!userId) return;

        (async () => {
            try {
                setProfileLoading(true);
                const data = await getUserProfile(userId);
                if (mounted) setUserProfile(data as UserProfileData);
                
            } catch (e) {
                console.error("Erreur chargement profil:", e);
            } finally {
                if (mounted) setProfileLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [user]);

    const rawName = (user as any)?.pseudo ?? (user as any)?.name ?? (user as any)?.email ?? t("common.user");
    const firstName = typeof rawName === "string" ? rawName.split(" ")[0] : t("common.user");

    // Tri des trajets récents
    const latestTrips = useMemo(() => {
        return [...trips]
            .sort((a: any, b: any) => {
                const da = new Date(a.date ?? 0).getTime();
                const db = new Date(b.date ?? 0).getTime();
                return db - da;
            })
            .slice(0, 3);
    }, [trips]);

    // 4. Calcul du Total CO2 combiné
    const totalCo2Kg = useMemo(() => {
        // A. Somme des trajets (calculé côté front, comme avant)
        const transportSum = trips.reduce((sum, trip) => {
            const v = Number((trip as any).co2Kg ?? 0);
            return sum + (Number.isFinite(v) ? v : 0);
        }, 0);

        // B. Valeur Lifestyle (venant de la BDD via le profil)
        const lifestyleSum = userProfile?.emission_co2_lifestyle 
            ? Number(userProfile.emission_co2_lifestyle) 
            : 0;

        // C. Total
        return transportSum + lifestyleSum;
    }, [trips, userProfile]);

    const co2Stat = useMemo(() => {
        return getCo2Benchmark({ totalCo2Kg, isLoading: tripsLoading || profileLoading });
    }, [totalCo2Kg, tripsLoading, profileLoading]);

    const co2Helper = useMemo(() => {
        const template = t(co2Stat.helperKey);
        const values = co2Stat.helperValues;
        if (!values) return template;

        return interpolate(template, {
            better: formatPercent(values.better),
            worse: formatPercent(values.worse),
            top: formatPercent(values.top),
        });
    }, [co2Stat.helperKey, co2Stat.helperValues, t]);

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
                                {t("dashboard.title")}
                            </p>

                            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                                {t("dashboard.greeting")}, {firstName} 👋
                            </h1>

                            <p className="mt-2 text-sm text-white/65">
                                {t("dashboard.subtitle")}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={logout}
                                className={[
                                    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
                                    "border border-white/10 bg-white/5 text-white/80",
                                    "transition hover:bg-white/10 hover:text-white",
                                ].join(" ")}
                            >
                                {t("common.logout")}
                            </button>
                        </div>
                    </header>

                    {/* Stats */}
                    <section className="grid gap-4 md:grid-cols-3">
                        <StatCard
                            label={t("dashboard.stats.vehicles.label")}
                            value={vehiclesLoading ? "…" : String(vehicles.length)}
                            helper={t("dashboard.stats.vehicles.helper")}
                        />
                        <StatCard
                            label={t("dashboard.stats.trips.label")}
                            value={tripsLoading ? "…" : String(trips.length)}
                            helper={t("dashboard.stats.trips.helper")}
                        />
                        <StatCard
                            label={t("dashboard.stats.co2.label")}
                            // Affichage du total combiné
                            value={(tripsLoading || profileLoading) ? "…" : `${totalCo2Kg.toFixed(2)} kg`}
                            helper={co2Helper}
                            helperClassName={co2Stat.helperClassName}
                        />
                    </section>

                    {/* Content */}
                    <section className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
                        <GlassCard>
                            <div className="flex items-center justify-between gap-2">
                                <h2 className="text-sm font-medium text-white/90">
                                    {t("dashboard.latestTrips.title")}
                                </h2>

                                <button
                                    type="button"
                                    className="text-xs font-medium text-emerald-300 hover:underline"
                                >
                                    {t("dashboard.latestTrips.cta")}
                                </button>
                            </div>

                            <p className="mt-3 text-sm text-white/65">
                                {t("dashboard.latestTrips.description")}
                            </p>

                            <ul className="mt-4 space-y-2 text-sm text-white/70">
                                {tripsLoading && <li className="text-white/60">{t("dashboard.latestTrips.loading")}</li>}

                                {!tripsLoading && latestTrips.length === 0 && (
                                    <li className="text-white/60">{t("dashboard.latestTrips.empty")}</li>
                                )}

                                {!tripsLoading &&
                                    latestTrips.map((trip: any) => (
                                        <li
                                            key={trip.id}
                                            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                                        >
                      <span className="truncate">
                        {trip.fromCity} → {trip.toCity}
                      </span>
                                            <span className="shrink-0 text-xs text-white/55">
                        {trip.distanceKm} km
                      </span>
                                        </li>
                                    ))}
                            </ul>
                        </GlassCard>

                        <GlassCard>
                            <h2 className="text-sm font-medium text-white/90">
                                {t("dashboard.nextSteps.title")}
                            </h2>

                            <ol className="mt-3 space-y-2 list-decimal list-inside text-sm text-white/70">
                                <li className="leading-relaxed">{t("dashboard.nextSteps.step1")}</li>
                                <li className="leading-relaxed">{t("dashboard.nextSteps.step2")}</li>
                                <li className="leading-relaxed">{t("dashboard.nextSteps.step3")}</li>
                            </ol>

                            <div className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                                <p className="text-xs text-white/55">Astuce</p>
                                <p className="mt-1 text-sm text-white/75">
                                    Ajoute un véhicule puis enregistre 1 trajet : tu verras tes stats se remplir direct.
                                </p>
                            </div>
                        </GlassCard>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
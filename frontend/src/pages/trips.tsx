// frontend/src/pages/trips.tsx
import { useEffect, useState } from 'react';
import type { Trip } from '../../../shared/trip.type.ts';

const TripsPage = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/trips');

                if (!res.ok) {
                    throw new Error('Erreur lors du chargement des trajets');
                }

                const data: Trip[] = await res.json();
                setTrips(data);
            } catch (err) {
                console.error('Erreur fetch /api/trips :', err);
                setError(err instanceof Error ? err.message : 'Erreur inconnue');
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 px-4 pb-24 pt-6">
            <div className="mx-auto max-w-5xl space-y-6">
                {/* Header */}
                <header className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Trajets
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                            Historique des trajets
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">
                            Consulte et filtre tes trajets pour suivre ton empreinte carbone.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200 shadow-sm hover:bg-emerald-500/20"
                    >
                        + Nouveau trajet
                    </button>
                </header>

                {/* Filtres (placeholder pour l’instant) */}
                <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                    <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium text-slate-400">
              Filtres rapides
            </span>

                        <button className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200 hover:border-emerald-400 hover:text-emerald-200">
                            7 derniers jours
                        </button>
                        <button className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200 hover:border-emerald-400 hover:text-emerald-200">
                            Ce mois-ci
                        </button>
                        <button className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200 hover:border-emerald-400 hover:text-emerald-200">
                            Tous les trajets
                        </button>
                    </div>
                </section>

                {/* Liste des trajets */}
                <section className="rounded-2xl border border-slate-800 bg-slate-900/40">
                    <div className="border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                        <h2 className="text-sm font-medium text-slate-100">
                            Trajets enregistrés
                        </h2>

                        {loading ? (
                            <span className="text-xs text-slate-500">Chargement...</span>
                        ) : error ? (
                            <span className="text-xs text-red-400">Erreur</span>
                        ) : (
                            <span className="text-xs text-slate-500">
                {trips.length} trajet(s)
              </span>
                        )}
                    </div>

                    {/* États : chargement / erreur / vide / liste */}
                    {loading ? (
                        <div className="px-4 py-10 text-center text-sm text-slate-400">
                            Chargement des trajets...
                        </div>
                    ) : error ? (
                        <div className="px-4 py-10 text-center text-sm text-red-400">
                            {error}
                        </div>
                    ) : trips.length === 0 ? (
                        <div className="px-4 py-10 text-center text-sm text-slate-400">
                            Aucun trajet pour le moment. Ajoute ton premier trajet pour voir
                            apparaître ton historique ici.
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-800">
                            {trips.map((trip) => (
                                <li
                                    key={trip.id}
                                    className="px-4 py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
                                >
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-slate-100">
                                            {trip.fromCity} → {trip.toCity}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {trip.date} · {trip.distanceKm} km · {trip.vehicleName}
                                        </p>
                                        {trip.tag && (
                                            <span className="inline-flex rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                        {trip.tag}
                      </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between gap-4">
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400">CO₂ estimé</p>
                                            <p className="text-sm font-semibold text-emerald-300">
                                                {trip.co2Kg.toFixed(1)} kg
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-200 hover:border-slate-500">
                                                Modifier
                                            </button>
                                            <button className="rounded-full border border-red-500/60 bg-red-500/10 px-3 py-1 text-[11px] text-red-200 hover:bg-red-500/20">
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
};

export default TripsPage;

//frontend\src\pages\vehicles.tsx
import type { Vehicle } from '@/types/vehicle';
import { useMemo } from 'react';

const MOCK_VEHICLES: Vehicle[] = [
    {
        id: '1',
        name: 'Clio IV',
        plate: 'AB-123-CD',
        type: 'Citadine',
        fuelType: 'essence',
        consumptionLPer100: 6.2,
        createdAt: '2025-01-10T10:00:00Z',
    },
    {
        id: '2',
        name: 'Tesla Model 3',
        plate: 'EV-456-ZE',
        type: 'Berline',
        fuelType: 'electrique',
        createdAt: '2025-01-15T15:30:00Z',
    },
    {
        id: '3',
        name: '308 BlueHDi',
        plate: 'CD-789-EF',
        type: 'Compacte',
        fuelType: 'diesel',
        consumptionLPer100: 4.9,
        createdAt: '2025-01-20T09:15:00Z',
    },
];

function fuelLabel(fuel: Vehicle['fuelType']): string {
    switch (fuel) {
        case 'essence':
            return 'Essence';
        case 'diesel':
            return 'Diesel';
        case 'electrique':
            return 'Électrique';
        case 'hybride':
            return 'Hybride';
        case 'gpl':
            return 'GPL';
        default:
            return 'Autre';
    }
}

function VehiclesPage() {
    // plus tard, ici tu mettras un useEffect + appel API
    const vehicles = useMemo(() => MOCK_VEHICLES, []);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 px-4 pb-24 pt-6">
            <div className="mx-auto max-w-5xl space-y-6">
                {/* Header */}
                <header className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Véhicules
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                            Mes véhicules
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">
                            Gérez les véhicules utilisés pour vos trajets et le calcul de vos
                            émissions.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200 shadow-sm hover:bg-emerald-500/20"
                    >
                        + Ajouter un véhicule
                    </button>
                </header>

                {/* Résumé rapide */}
                <section className="grid gap-4 md:grid-cols-3">
                    <SummaryCard
                        label="Véhicules suivis"
                        value={vehicles.length.toString()}
                        helper="Nombre total configuré"
                    />
                    <SummaryCard
                        label="Types différents"
                        value={new Set(vehicles.map((v) => v.type || 'Autre')).size.toString()}
                        helper="Citadine, SUV, etc."
                    />
                    <SummaryCard
                        label="Types de carburant"
                        value={new Set(vehicles.map((v) => fuelLabel(v.fuelType))).size.toString()}
                        helper="Essence, Diesel, Électrique…"
                    />
                </section>

                {/* Liste des véhicules */}
                <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-sm font-medium text-slate-100">
                            Liste des véhicules
                        </h2>
                        <p className="text-xs text-slate-500">
                            {vehicles.length === 0
                                ? 'Aucun véhicule pour le moment.'
                                : `${vehicles.length} véhicule${vehicles.length > 1 ? 's' : ''}`}
                        </p>
                    </div>

                    <div className="mt-4 divide-y divide-slate-800">
                        {vehicles.map((vehicle) => (
                            <VehicleRow key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}

type SummaryCardProps = {
    label: string;
    value: string;
    helper: string;
};

function SummaryCard({ label, value, helper }: SummaryCardProps) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-xs text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-50">{value}</p>
            <p className="mt-1 text-xs text-emerald-300">{helper}</p>
        </div>
    );
}

type VehicleRowProps = {
    vehicle: Vehicle;
};

function VehicleRow({ vehicle }: VehicleRowProps) {
    return (
        <div className="flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between">
            <div>
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-100">{vehicle.name}</p>
                    {vehicle.plate && (
                        <span className="rounded-full border border-slate-700 bg-slate-900/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300">
              {vehicle.plate}
            </span>
                    )}
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    {vehicle.type && (
                        <span className="rounded-full bg-slate-800/80 px-2 py-0.5">
              {vehicle.type}
            </span>
                    )}
                    <span className="rounded-full bg-slate-800/80 px-2 py-0.5">
            {fuelLabel(vehicle.fuelType)}
          </span>
                    {vehicle.consumptionLPer100 && (
                        <span className="rounded-full bg-slate-800/80 px-2 py-0.5">
              {vehicle.consumptionLPer100} L / 100 km
            </span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
                <button className="rounded-full border border-slate-700 px-3 py-1 text-slate-200 hover:bg-slate-800">
                    Modifier
                </button>
                <button className="rounded-full border border-red-700/70 bg-red-950/40 px-3 py-1 text-red-200 hover:bg-red-900/60">
                    Supprimer
                </button>
            </div>
        </div>
    );
}

export default VehiclesPage;

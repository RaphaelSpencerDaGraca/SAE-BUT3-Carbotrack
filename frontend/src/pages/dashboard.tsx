import { useAuth } from "../hooks/useAuth";

type StatCardProps = {
    label: string;
    value: string;
    helper: string;
};

const StatCard = ({ label, value, helper }: StatCardProps) => {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-xs text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-50">{value}</p>
            <p className="mt-1 text-xs text-emerald-300">{helper}</p>
        </div>
    );
};

const Dashboard = () => {
    const { user, logout } = useAuth();

    const rawName =
        (user as any)?.pseudo ??
        (user as any)?.name ??
        (user as any)?.email ??
        "utilisateur";

    const firstName =
        typeof rawName === "string" ? rawName.split(" ")[0] : "utilisateur";

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 px-4 pb-24 pt-6">
            <div className="mx-auto max-w-5xl space-y-6">
                {/* Header */}
                <header className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Tableau de bord
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                            Bonjour, {firstName} 👋
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">
                            Voici un aperçu rapide de votre activité sur Carbotrack.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200 shadow-sm hover:bg-emerald-500/20"
                        >
                            + Nouveau véhicule
                        </button>

                        <button
                            type="button"
                            onClick={logout}
                            className="inline-flex items-center justify-center rounded-full border border-red-500/60 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-200 shadow-sm hover:bg-red-500/20"
                        >
                            Se déconnecter
                        </button>
                    </div>
                </header>

                {/* Cards de stats */}
                <section className="grid gap-4 md:grid-cols-3">
                    <StatCard
                        label="Véhicules suivis"
                        value="3"
                        helper="+1 cette semaine"
                    />
                    <StatCard
                        label="Trajets enregistrés"
                        value="24"
                        helper="Dernier : hier"
                    />
                    <StatCard
                        label="CO₂ estimé (30 jours)"
                        value="142 kg"
                        helper="Basé sur les trajets saisis"
                    />
                </section>

                {/* Deux blocs */}
                <section className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                        <div className="flex items-center justify-between gap-2">
                            <h2 className="text-sm font-medium text-slate-100">
                                Derniers trajets
                            </h2>
                            <button className="text-xs text-emerald-300 hover:underline">
                                Voir tout
                            </button>
                        </div>

                        <p className="mt-3 text-sm text-slate-400">
                            Ici on affichera bientôt les trajets les plus récents issus du
                            backend.
                        </p>

                        <ul className="mt-4 space-y-2 text-xs text-slate-400">
                            <li>• Placeholder – intégration réelle à venir.</li>
                            <li>• Distance, type de véhicule, CO₂ estimé, etc.</li>
                        </ul>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                        <h2 className="text-sm font-medium text-slate-100">
                            Prochaines étapes du projet
                        </h2>
                        <ol className="mt-3 space-y-2 list-decimal list-inside text-sm text-slate-400">
                            <li>Connecter les véhicules et trajets au backend.</li>
                            <li>Afficher les vrais trajets dans la section de gauche.</li>
                            <li>Ajouter des filtres (période, type de véhicule, etc.).</li>
                        </ol>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Dashboard;
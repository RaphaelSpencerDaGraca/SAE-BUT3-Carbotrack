import { useAuth } from '../hooks/useAuth';

const ProfilePage = () => {
    const { user, logout } = useAuth();

    // On récupère quelques infos avec des fallback
    const displayName =
        (user as any)?.pseudo ||
        (user as any)?.name ||
        (user as any)?.email?.split?.('@')?.[0] ||
        'Utilisateur';

    const email = (user as any)?.email ?? 'Email non renseigné';

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 px-4 pb-24 pt-6">
            <div className="mx-auto max-w-4xl space-y-6">
                {/* Header */}
                <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Profil
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                            Bonjour, {displayName} 👋
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">
                            Gérez vos informations de compte et vos préférences Carbotrack.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={logout}
                        className="inline-flex items-center justify-center rounded-full border border-red-500/60 bg-red-500/10 px-4 py-1.5 text-xs font-medium text-red-200 shadow-sm hover:bg-red-500/20"
                    >
                        Se déconnecter
                    </button>
                </header>

                {/* Bloc infos principales */}
                <section className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                    {/* Infos compte */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 md:p-5">
                        <h2 className="text-sm font-medium text-slate-100">
                            Informations du compte
                        </h2>
                        <div className="mt-4 space-y-3 text-sm">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500">
                                    Nom affiché
                                </p>
                                <p className="mt-1 text-slate-100">{displayName}</p>
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500">
                                    Adresse e-mail
                                </p>
                                <p className="mt-1 text-slate-100 break-all">{email}</p>
                            </div>

                            {/* Placeholder pour plus tard */}
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500">
                                    Organisation
                                </p>
                                <p className="mt-1 text-slate-400">
                                    À connecter plus tard avec les données du backend.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Préférences / sécurité (placeholder) */}
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 md:p-5">
                            <h2 className="text-sm font-medium text-slate-100">
                                Sécurité
                            </h2>
                            <p className="mt-3 text-sm text-slate-400">
                                Ces actions seront branchées plus tard au backend.
                            </p>

                            <div className="mt-4 space-y-2">
                                <button
                                    type="button"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800/80"
                                >
                                    Modifier le mot de passe
                                </button>
                                <button
                                    type="button"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800/80"
                                >
                                    Gérer les sessions actives
                                </button>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 md:p-5">
                            <h2 className="text-sm font-medium text-slate-100">
                                Préférences
                            </h2>
                            <p className="mt-3 text-sm text-slate-400">
                                Ici on pourra gérer les unités (km / miles), le thème, les
                                notifications, etc.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default ProfilePage;

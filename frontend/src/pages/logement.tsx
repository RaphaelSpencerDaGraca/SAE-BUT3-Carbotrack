import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "@/language/useTranslation";
import { useLogement } from "@/hooks/useLogement";
import { useTypesChauffage } from "@/hooks/useTypeChauffage";
import {
    getAppareilsByLogement,
    createAppareil,
    deleteAppareil,
} from "@/services/electromenagerService";
import type { IElectromenager, TypeElectromenagerEnum } from "@/types/electromenager";
import type { LogementInput } from "@/components/calcLifestyle/types";

// --- FONCTION UTILITAIRE POUR RÉCUPÉRER L'ID UTILISATEUR ---
const getCurrentUserId = (): string | null => {
    const directId = localStorage.getItem("userId");
    if (directId) return directId;

    const userJson = localStorage.getItem("user");
    if (userJson) {
        try {
            const userObj = JSON.parse(userJson);
            return userObj.id || userObj.user_id || null;
        } catch (e) {
            console.error("Erreur parsing user JSON", e);
            return null;
        }
    }
    return null;
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

const Pill = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/70">
    {children}
  </span>
);

const DangerText = ({ children }: { children: React.ReactNode }) => (
    <span className="text-xs text-red-200/80">{children}</span>
);

const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-green-400/40 focus:ring-2 focus:ring-green-400/20";

const selectClass = inputClass;

const labelClass = "mb-1 block text-xs font-medium text-white/70";

const PrimaryButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        {...props}
        className={[
            "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition",
            "bg-gradient-to-r from-green-600 to-emerald-600 text-white",
            "shadow-[0_10px_30px_-12px_rgba(16,185,129,0.55)] hover:brightness-110",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            props.className ?? "",
        ].join(" ")}
    />
);

const SecondaryButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        {...props}
        className={[
            "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition",
            "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            props.className ?? "",
        ].join(" ")}
    />
);

const GhostButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        {...props}
        className={[
            "inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold transition",
            "text-emerald-200/90 hover:text-emerald-100 underline decoration-emerald-300/30 underline-offset-4",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            props.className ?? "",
        ].join(" ")}
    />
);

// Composant pour afficher une ligne d'appareil
const AppareilRow = ({
                         appareil,
                         onDelete,
                     }: {
    appareil: IElectromenager;
    onDelete: (id: number) => void;
}) => {
    return (
        <div className="flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between">
            <div>
                <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-white/90">{appareil.nom}</p>
                    <Pill>{appareil.type}</Pill>
                </div>

                <div className="mt-1 text-xs text-white/55">
          <span className="text-emerald-200/90">
            {appareil.consommationKwhAn} kWh/an
          </span>
                    <span className="mx-2 text-white/25">•</span>
                    <span>Usage : {appareil.co2UsageKgAn.toFixed(1)} kgCO₂/an</span>
                </div>
            </div>

            <button
                type="button"
                onClick={() => appareil.id && onDelete(appareil.id)}
                className="inline-flex items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/15"
                title="Supprimer"
            >
                Supprimer
            </button>
        </div>
    );
};

const LogementsPage = () => {
    const { t } = useTranslation();

    const {
        logements,
        loading: loadingLogements,
        error: apiError,
        saveLogement,
        fetchLogements,
    } = useLogement();

    const { typesChauffage } = useTypesChauffage();

    // États locaux
    const [isCreatingLogement, setIsCreatingLogement] = useState(false);
    const [expandedLogementId, setExpandedLogementId] = useState<number | null>(null);
    const [appareilsMap, setAppareilsMap] = useState<Record<number, IElectromenager[]>>({});

    // État pour les erreurs de validation locales (formulaire)
    const [formError, setFormError] = useState<string | null>(null);

    // Formulaire Logement
    const [formLogement, setFormLogement] = useState({
        superficie: 50,
        nombre_pieces: 2,
        type_chauffage_id: 0,
        classe_isolation: "D",
    });

    // Formulaire Appareil
    const [isAddingAppareil, setIsAddingAppareil] = useState<number | null>(null);
    const [formAppareil, setFormAppareil] = useState<Partial<IElectromenager>>({
        nom: "",
        type: "Autre",
        consommationKwhAn: 100,
        dureeVieTheoriqueAns: 10,
    });

    useEffect(() => {
        const userId = getCurrentUserId();
        if (userId) fetchLogements(userId);
    }, [fetchLogements]);

    const logementsSorted = useMemo(() => {
        return [...logements].sort((a: any, b: any) => Number(b.id ?? 0) - Number(a.id ?? 0));
    }, [logements]);

    const toggleLogement = async (logementId: number) => {
        if (expandedLogementId === logementId) {
            setExpandedLogementId(null);
            setIsAddingAppareil(null);
        } else {
            setExpandedLogementId(logementId);
            try {
                const data = await getAppareilsByLogement(logementId);
                setAppareilsMap((prev) => ({ ...prev, [logementId]: data }));
            } catch (err) {
                console.error("Erreur chargement appareils", err);
            }
        }
    };

    // --- Actions Logement ---
    const handleCreateLogement = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        const userId = getCurrentUserId();
        if (!userId) {
            setFormError("Impossible de récupérer votre identifiant. Essayez de vous déconnecter/reconnecter.");
            return;
        }

        if (formLogement.type_chauffage_id === 0) {
            setFormError("Veuillez sélectionner un type de chauffage valide.");
            return;
        }
        if (formLogement.superficie <= 0 || formLogement.nombre_pieces <= 0) {
            setFormError("La superficie et le nombre de pièces doivent être supérieurs à 0.");
            return;
        }

        const payload: LogementInput = {
            user_id: userId,
            superficie: formLogement.superficie,
            nombre_pieces: formLogement.nombre_pieces,
            type_chauffage_id: formLogement.type_chauffage_id,
            classe_isolation: formLogement.classe_isolation as any
        };

        try {
            await saveLogement(payload, userId);
            setIsCreatingLogement(false);
            setFormLogement({
                superficie: 50,
                nombre_pieces: 2,
                type_chauffage_id: 0,
                classe_isolation: "D",
            });
        } catch (err) {
            console.error("Erreur création", err);
        }
    };

    const handleCreateAppareil = async (logementId: number) => {
        try {
            if (!formAppareil.nom) return;

            const newAppareil: IElectromenager = {
                logementId: logementId,
                nom: formAppareil.nom,
                type: formAppareil.type as TypeElectromenagerEnum,
                consommationKwhAn: formAppareil.consommationKwhAn || 0,
                consommationEauAn: 0,
                co2FabricationKg: 0,
                co2UsageKgAn: 0,
                sourceDonnees: "Manuel",
                dureeVieTheoriqueAns: formAppareil.dureeVieTheoriqueAns || 10,
            };

            await createAppareil(newAppareil);

            const updatedList = await getAppareilsByLogement(logementId);
            setAppareilsMap((prev) => ({ ...prev, [logementId]: updatedList }));

            setIsAddingAppareil(null);
            setFormAppareil({ nom: "", type: "Autre", consommationKwhAn: 100, dureeVieTheoriqueAns: 10 });
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteAppareil = async (logementId: number, appareilId: number) => {
        if (!confirm("Supprimer cet appareil ?")) return;
        try {
            await deleteAppareil(appareilId);
            setAppareilsMap((prev) => ({
                ...prev,
                [logementId]: (prev[logementId] ?? []).filter((a) => a.id !== appareilId),
            }));
        } catch (err) {
            console.error(err);
        }
    };

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
                                {t("housing.title") ?? "Habitation"}
                            </p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                                {t("housing.header") ?? "Mes Logements & Équipements"}
                            </h1>
                            <p className="mt-2 text-sm text-white/65">
                                {t("housing.subtitle") ?? "Gérez vos logements et ajoutez vos appareils électroménagers."}
                            </p>
                        </div>

                        <SecondaryButton
                            type="button"
                            onClick={() => {
                                setIsCreatingLogement((v) => !v);
                                setFormError(null);
                            }}
                            className="px-4 py-2"
                        >
                            {isCreatingLogement ? "Annuler" : "+ Ajouter un logement"}
                        </SecondaryButton>
                    </header>

                    {apiError && (
                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                            Erreur serveur : {apiError}
                        </div>
                    )}

                    {/* Form logement */}
                    {isCreatingLogement && (
                        <GlassCard className="p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-sm font-semibold text-white/90">Nouveau logement</h2>
                                    <p className="mt-1 text-xs text-white/55">Renseignez les informations principales.</p>
                                </div>
                            </div>

                            {formError && (
                                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                                    <DangerText>{formError}</DangerText>
                                </div>
                            )}

                            <form onSubmit={handleCreateLogement} className="mt-5 grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className={labelClass}>
                                        Type de chauffage <span className="text-red-300">*</span>
                                    </label>
                                    <select
                                        className={selectClass}
                                        value={formLogement.type_chauffage_id}
                                        onChange={(e) =>
                                            setFormLogement({ ...formLogement, type_chauffage_id: parseInt(e.target.value) })
                                        }
                                    >
                                        <option className="bg-gray-950" value={0}>
                                            -- Sélectionner --
                                        </option>
                                        {typesChauffage.map((tc) => (
                                            <option className="bg-gray-950" key={tc.id} value={tc.id}>
                                                {tc.type_chauffage}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClass}>Isolation (DPE)</label>
                                    <select
                                        className={selectClass}
                                        value={formLogement.classe_isolation}
                                        onChange={(e) => setFormLogement({ ...formLogement, classe_isolation: e.target.value })}
                                    >
                                        {["A", "B", "C", "D", "E", "F", "G"].map((c) => (
                                            <option className="bg-gray-950" key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClass}>Superficie (m²)</label>
                                    <input
                                        type="number"
                                        className={inputClass}
                                        value={formLogement.superficie}
                                        onChange={(e) => setFormLogement({ ...formLogement, superficie: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Nombre de pièces</label>
                                    <input
                                        type="number"
                                        className={inputClass}
                                        value={formLogement.nombre_pieces}
                                        onChange={(e) => setFormLogement({ ...formLogement, nombre_pieces: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div className="md:col-span-2 flex justify-end gap-2 pt-1">
                                    <SecondaryButton
                                        type="button"
                                        onClick={() => {
                                            setIsCreatingLogement(false);
                                            setFormError(null);
                                        }}
                                    >
                                        Annuler
                                    </SecondaryButton>

                                    <PrimaryButton type="submit">Enregistrer le logement</PrimaryButton>
                                </div>
                            </form>
                        </GlassCard>
                    )}

                    {/* Liste logements */}
                    <div className="space-y-4">
                        {loadingLogements && <p className="text-white/55">Chargement...</p>}

                        {!loadingLogements && logementsSorted.length === 0 && (
                            <div className="text-center py-10 text-white/55">
                                Aucun logement enregistré. Commencez par en ajouter un.
                            </div>
                        )}

                        {!loadingLogements &&
                            logementsSorted.map((logement: any) => {
                                const opened = expandedLogementId === logement.id;
                                const appareils = appareilsMap[logement.id] ?? [];

                                return (
                                    <GlassCard key={logement.id} className="overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => toggleLogement(logement.id)}
                                            className="w-full p-5 text-left transition hover:bg-white/[0.03]"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70">
                                                        🏠
                                                    </div>

                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h3 className="text-sm font-semibold text-white/90">
                                                                Logement {logement.superficie}m² · {logement.nombre_pieces} pièces
                                                            </h3>
                                                            <Pill>Isolation {logement.classe_isolation}</Pill>
                                                        </div>

                                                        <p className="mt-1 text-xs text-white/55">
                                                            {typeof logement.emission_co2_annuelle === "number"
                                                                ? `${logement.emission_co2_annuelle.toFixed(0)} kgCO₂/an`
                                                                : "Émissions : —"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="text-xs font-semibold text-white/60">
                                                    {opened ? "Masquer ▲" : "Voir appareils ▼"}
                                                </div>
                                            </div>
                                        </button>

                                        {opened && (
                                            <div className="border-t border-white/10 bg-black/10 p-5">
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="text-xs font-medium uppercase tracking-wide text-white/45">
                                                            Appareils électroménagers
                                                        </p>
                                                        <p className="mt-1 text-xs text-white/55">
                                                            Ajoutez vos équipements pour affiner l’estimation.
                                                        </p>
                                                    </div>

                                                    <GhostButton
                                                        type="button"
                                                        onClick={() => setIsAddingAppareil(logement.id)}
                                                    >
                                                        + Ajouter un appareil
                                                    </GhostButton>
                                                </div>

                                                {/* Inline form ajout appareil */}
                                                {isAddingAppareil === logement.id && (
                                                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                                        <div className="grid gap-4 md:grid-cols-4">
                                                            <div className="md:col-span-2">
                                                                <label className={labelClass}>Nom</label>
                                                                <input
                                                                    type="text"
                                                                    className={inputClass}
                                                                    placeholder="Ex : Frigo"
                                                                    value={String(formAppareil.nom ?? "")}
                                                                    onChange={(e) => setFormAppareil({ ...formAppareil, nom: e.target.value })}
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className={labelClass}>Type</label>
                                                                <select
                                                                    className={selectClass}
                                                                    value={String(formAppareil.type ?? "Autre")}
                                                                    onChange={(e) =>
                                                                        setFormAppareil({ ...formAppareil, type: e.target.value as any })
                                                                    }
                                                                >
                                                                    {["Refrigerateur", "Lave-linge", "Televiseur", "Ordinateur", "Autre"].map((tp) => (
                                                                        <option className="bg-gray-950" key={tp} value={tp}>
                                                                            {tp}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            <div>
                                                                <label className={labelClass}>Conso (kWh/an)</label>
                                                                <input
                                                                    type="number"
                                                                    className={inputClass}
                                                                    value={Number(formAppareil.consommationKwhAn ?? 0)}
                                                                    onChange={(e) =>
                                                                        setFormAppareil({
                                                                            ...formAppareil,
                                                                            consommationKwhAn: parseFloat(e.target.value),
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 flex justify-end gap-2">
                                                            <SecondaryButton
                                                                type="button"
                                                                onClick={() => setIsAddingAppareil(null)}
                                                            >
                                                                Annuler
                                                            </SecondaryButton>

                                                            <PrimaryButton
                                                                type="button"
                                                                onClick={() => handleCreateAppareil(logement.id)}
                                                                disabled={!String(formAppareil.nom ?? "").trim()}
                                                            >
                                                                Ajouter
                                                            </PrimaryButton>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="mt-4 divide-y divide-white/10">
                                                    {appareils.length > 0 ? (
                                                        appareils.map((app) => (
                                                            <AppareilRow
                                                                key={app.id}
                                                                appareil={app}
                                                                onDelete={(id) => handleDeleteAppareil(logement.id, id)}
                                                            />
                                                        ))
                                                    ) : (
                                                        <p className="py-3 text-sm text-white/55 italic">
                                                            Aucun appareil ajouté.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </GlassCard>
                                );
                            })}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LogementsPage;
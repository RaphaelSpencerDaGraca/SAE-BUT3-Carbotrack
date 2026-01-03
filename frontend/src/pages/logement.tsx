import React, { useEffect, useState } from "react";
import { useTranslation } from "@/language/useTranslation";
import { useLogement } from "@/hooks/useLogement"; 
import { useTypesChauffage } from "@/hooks/useTypeChauffage";
import { getAppareilsByLogement, createAppareil, deleteAppareil } from "@/services/electromenagerService";
import { IElectromenager, TypeElectromenagerEnum } from "@/types/electromenager";
import { LogementInput } from "@/components/calcLifestyle/types";

// --- FONCTION UTILITAIRE POUR RÉCUPÉRER L'ID UTILISATEUR ---
const getCurrentUserId = (): string | null => {
    // 1. Essayer la clé directe
    const directId = localStorage.getItem('userId');
    if (directId) return directId;

    // 2. Essayer dans l'objet 'user' (souvent utilisé par les contextes Auth)
    const userJson = localStorage.getItem('user');
    if (userJson) {
        try {
            const userObj = JSON.parse(userJson);
            // On cherche id ou user_id
            return userObj.id || userObj.user_id || null;
        } catch (e) {
            console.error("Erreur parsing user JSON", e);
            return null;
        }
    }
    return null;
};

// Composant pour afficher une ligne d'appareil
const AppareilRow = ({ appareil, onDelete }: { appareil: IElectromenager; onDelete: (id: number) => void }) => {
    return (
        <div className="flex items-center justify-between border-t border-slate-800 py-2 pl-4 text-xs text-slate-300">
            <div>
                <span className="font-medium text-slate-100">{appareil.nom}</span>
                <span className="ml-2 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                    {appareil.type}
                </span>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <div className="text-emerald-400">{appareil.consommationKwhAn} kWh/an</div>
                    <div className="text-[10px] text-slate-500">Usage: {appareil.co2UsageKgAn.toFixed(1)} kgCO₂</div>
                </div>
                <button 
                    onClick={() => appareil.id && onDelete(appareil.id)}
                    className="text-red-400 hover:text-red-300"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

const LogementsPage = () => {
    const { t } = useTranslation();
    
    // Hooks existants pour les logements
    const { logements, loading: loadingLogements, error: apiError, saveLogement, fetchLogements } = useLogement();
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
        classe_isolation: "D"
    });

    // Formulaire Appareil
    const [isAddingAppareil, setIsAddingAppareil] = useState<number | null>(null); 
    const [formAppareil, setFormAppareil] = useState<Partial<IElectromenager>>({
        nom: "",
        type: "Autre",
        consommationKwhAn: 100,
        dureeVieTheoriqueAns: 10
    });

    // Charger les logements au montage
    useEffect(() => {
        const userId = getCurrentUserId(); // Utilisation de la nouvelle fonction
        if (userId) fetchLogements(userId);
    }, [fetchLogements]);

    const toggleLogement = async (logementId: number) => {
        if (expandedLogementId === logementId) {
            setExpandedLogementId(null);
        } else {
            setExpandedLogementId(logementId);
            try {
                const data = await getAppareilsByLogement(logementId);
                setAppareilsMap(prev => ({ ...prev, [logementId]: data }));
            } catch (err) {
                console.error("Erreur chargement appareils", err);
            }
        }
    };

    // --- Actions Logement ---
    const handleCreateLogement = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        // Correction ici : Utilisation de la fonction robuste
        const userId = getCurrentUserId();
        
        if (!userId) {
            setFormError("Impossible de récupérer votre identifiant. Essayez de vous déconnecter/reconnecter.");
            return;
        }

        // VALIDATION
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
            classe_isolation: formLogement.classe_isolation
        };

        try {
            await saveLogement(payload, userId);
            setIsCreatingLogement(false);
            setFormLogement({ superficie: 50, nombre_pieces: 2, type_chauffage_id: 0, classe_isolation: "D" });
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
                sourceDonnees: 'Manuel',
                dureeVieTheoriqueAns: formAppareil.dureeVieTheoriqueAns || 10
            };

            await createAppareil(newAppareil);
            
            const updatedList = await getAppareilsByLogement(logementId);
            setAppareilsMap(prev => ({ ...prev, [logementId]: updatedList }));
            
            setIsAddingAppareil(null);
            setFormAppareil({ nom: "", type: "Autre", consommationKwhAn: 100, dureeVieTheoriqueAns: 10 });
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteAppareil = async (logementId: number, appareilId: number) => {
        if(!confirm("Supprimer cet appareil ?")) return;
        try {
            await deleteAppareil(appareilId);
            setAppareilsMap(prev => ({
                ...prev,
                [logementId]: prev[logementId].filter(a => a.id !== appareilId)
            }));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 px-4 pb-24 pt-6">
            <div className="mx-auto max-w-5xl space-y-6">
                
                <header className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Habitation</p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Mes Logements & Équipements</h1>
                        <p className="mt-1 text-sm text-slate-400">Gérez vos logements et ajoutez vos appareils électroménagers.</p>
                    </div>
                    <button
                        onClick={() => {setIsCreatingLogement(!isCreatingLogement); setFormError(null);}}
                        className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200 border border-emerald-500/60 hover:bg-emerald-500/20"
                    >
                        {isCreatingLogement ? "Annuler" : "+ Ajouter un logement"}
                    </button>
                </header>

                {apiError && (
                    <div className="p-3 rounded bg-red-900/30 text-red-300 text-sm border border-red-800">
                        Erreur serveur : {apiError}
                    </div>
                )}

                {isCreatingLogement && (
                    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 animate-in fade-in slide-in-from-top-2">
                        <h2 className="text-sm font-medium text-slate-100 mb-4">Nouveau Logement</h2>
                        
                        {formError && (
                            <div className="mb-4 p-2 rounded bg-red-500/20 text-red-200 text-xs border border-red-500/50">
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleCreateLogement} className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Type de chauffage <span className="text-red-400">*</span></label>
                                <select 
                                    className="w-full rounded bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:border-emerald-500 outline-none"
                                    value={formLogement.type_chauffage_id}
                                    onChange={e => setFormLogement({...formLogement, type_chauffage_id: parseInt(e.target.value)})}
                                >
                                    <option value={0}>-- Sélectionner --</option>
                                    {typesChauffage.map(t => <option key={t.id} value={t.id}>{t.type_chauffage}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Isolation (DPE)</label>
                                <select 
                                    className="w-full rounded bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:border-emerald-500 outline-none"
                                    value={formLogement.classe_isolation}
                                    onChange={e => setFormLogement({...formLogement, classe_isolation: e.target.value})}
                                >
                                    {['A','B','C','D','E','F','G'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Superficie (m²)</label>
                                <input type="number" className="w-full rounded bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:border-emerald-500 outline-none"
                                    value={formLogement.superficie}
                                    onChange={e => setFormLogement({...formLogement, superficie: parseInt(e.target.value)})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Nb Pièces</label>
                                <input type="number" className="w-full rounded bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:border-emerald-500 outline-none"
                                    value={formLogement.nombre_pieces}
                                    onChange={e => setFormLogement({...formLogement, nombre_pieces: parseInt(e.target.value)})}
                                />
                            </div>
                            <div className="md:col-span-2 text-right">
                                <button type="submit" className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-medium text-emerald-950 hover:bg-emerald-400">
                                    Enregistrer le logement
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                <div className="space-y-4">
                    {loadingLogements ? <p className="text-slate-500">Chargement...</p> : 
                     logements.map(logement => (
                        <div key={logement.id} className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
                            <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition" onClick={() => toggleLogement(logement.id)}>
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                                        🏠
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-slate-200">
                                            Logement {logement.superficie}m² - {logement.nombre_pieces} pièces
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            Isolation {logement.classe_isolation} • {logement.emission_co2_annuelle?.toFixed(0)} kgCO₂/an
                                        </p>
                                    </div>
                                </div>
                                <div className="text-slate-500 text-xs">
                                    {expandedLogementId === logement.id ? 'Masquer ▲' : 'Voir Appareils ▼'}
                                </div>
                            </div>

                            {expandedLogementId === logement.id && (
                                <div className="bg-slate-950/30 border-t border-slate-800 p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-xs font-medium uppercase tracking-wide text-slate-500">Appareils Électroménagers</h4>
                                        <button 
                                            onClick={() => setIsAddingAppareil(logement.id!)}
                                            className="text-xs text-emerald-400 hover:text-emerald-300 underline"
                                        >
                                            + Ajouter un appareil
                                        </button>
                                    </div>

                                    {/* Formulaire Ajout Appareil (Inline) */}
                                    {isAddingAppareil === logement.id && (
                                        <div className="mb-4 rounded bg-slate-900 border border-slate-700 p-3 grid gap-3 md:grid-cols-4 items-end">
                                            <div>
                                                <label className="text-[10px] text-slate-500">Nom</label>
                                                <input type="text" className="w-full bg-slate-950 border-slate-800 text-xs p-1 rounded" placeholder="Ex: Frigo"
                                                    value={formAppareil.nom} onChange={e => setFormAppareil({...formAppareil, nom: e.target.value})} />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-slate-500">Type</label>
                                                <select className="w-full bg-slate-950 border-slate-800 text-xs p-1 rounded"
                                                    value={formAppareil.type} onChange={e => setFormAppareil({...formAppareil, type: e.target.value as any})}>
                                                    {['Refrigerateur', 'Lave-linge', 'Televiseur', 'Ordinateur', 'Autre'].map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-slate-500">Conso (kWh/an)</label>
                                                <input type="number" className="w-full bg-slate-950 border-slate-800 text-xs p-1 rounded"
                                                    value={formAppareil.consommationKwhAn} onChange={e => setFormAppareil({...formAppareil, consommationKwhAn: parseFloat(e.target.value)})} />
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => setIsAddingAppareil(null)} className="px-2 py-1 text-xs text-slate-400">Annuler</button>
                                                <button onClick={() => handleCreateAppareil(logement.id!)} className="px-3 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-500">Ajouter</button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        {appareilsMap[logement.id!]?.length > 0 ? (
                                            appareilsMap[logement.id!].map(app => (
                                                <AppareilRow key={app.id} appareil={app} onDelete={(id) => handleDeleteAppareil(logement.id!, id)} />
                                            ))
                                        ) : (
                                            <p className="text-xs text-slate-600 italic">Aucun appareil ajouté.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {!loadingLogements && logements.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                            Aucun logement enregistré. Commencez par en ajouter un.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default LogementsPage;
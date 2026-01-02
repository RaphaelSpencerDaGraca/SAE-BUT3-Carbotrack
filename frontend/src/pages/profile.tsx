// frontend/src/pages/profile.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "@/language/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { changePassword, deleteAccount } from "@/services/authService";
import { getUserProfile, updateUserProfileInfo } from "@/services/userProfileService";

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const { t } = useTranslation();

    // États pour les préférences
    const [pseudo, setPseudo] = useState((user as any)?.pseudo || "");
    const [genre, setGenre] = useState("Autre");
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    // États pour le changement de mot de passe
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwords, setPasswords] = useState({ current: "", new: "" });

    // États pour la suppression
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");

    // Feedback UI
    const [message, setMessage] = useState({ type: "", text: "" });

    // Charger les infos du profil au montage
    useEffect(() => {
        if (user) {
            const userId = (user as any).id || (user as any).user_id;
            
            // CORRECTION : On type explicitement (data: any)
            getUserProfile(userId).then((data: any) => {
                if (data) {
                    if (data.pseudo) setPseudo(data.pseudo);
                    if (data.genre) setGenre(data.genre);
                }
            });
        }
    }, [user]);

    // --- Gestionnaires ---

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userId = (user as any).id || (user as any).user_id;
            await updateUserProfileInfo(userId, { pseudo, genre });
            setMessage({ type: "success", text: "Profil mis à jour avec succès !" });
            setIsEditingProfile(false);
            // Petit hack pour forcer le rafraichissement si besoin, sinon le context s'en charge au reload
        } catch (err) {
            setMessage({ type: "error", text: "Erreur lors de la mise à jour." });
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await changePassword(passwords.current, passwords.new);
            setMessage({ type: "success", text: "Mot de passe modifié !" });
            setShowPasswordForm(false);
            setPasswords({ current: "", new: "" });
        } catch (err: any) {
            setMessage({ type: "error", text: err.response?.data?.error || "Erreur mot de passe." });
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteAccount(deletePassword);
            logout(); // Déconnexion forcée
        } catch (err: any) {
            setMessage({ type: "error", text: err.response?.data?.error || "Impossible de supprimer le compte." });
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 px-4 pb-24 pt-6">
            <div className="mx-auto max-w-4xl space-y-6">

                {/* Header */}
                <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t("profile.title")}</p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                            {t("profile.greeting")}, {pseudo || (user as any)?.email} 👋
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <button onClick={logout} className="rounded-full border border-red-500/60 bg-red-500/10 px-4 py-1.5 text-xs text-red-200 hover:bg-red-500/20">
                            {t("common.logout")}
                        </button>
                    </div>
                </header>

                {/* Feedback Message */}
                {message.text && (
                    <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    
                    {/* SECTION 1: PROFIL & PRÉFÉRENCES */}
                    <div className="space-y-6">
                        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                            <h2 className="text-sm font-medium text-slate-100 mb-4">{t("profile.account.title")}</h2>
                            
                            {!isEditingProfile ? (
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase">Pseudo</p>
                                        <p className="text-slate-200">{pseudo || "Non défini"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase">Genre</p>
                                        <p className="text-slate-200">{genre || "Non défini"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase">Email</p>
                                        <p className="text-slate-400">{(user as any)?.email}</p>
                                    </div>
                                    <button onClick={() => setIsEditingProfile(true)} className="text-xs text-brand-400 hover:text-brand-300 underline">
                                        Modifier mes informations
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Pseudo</label>
                                        <input 
                                            type="text" 
                                            value={pseudo} 
                                            onChange={e => setPseudo(e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Genre</label>
                                        <select 
                                            value={genre} 
                                            onChange={e => setGenre(e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm"
                                        >
                                            <option value="Autre">Autre / Non précisé</option>
                                            <option value="Homme">Homme</option>
                                            <option value="Femme">Femme</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="submit" className="bg-brand-600 text-white px-3 py-1.5 rounded text-xs hover:bg-brand-500">Enregistrer</button>
                                        <button type="button" onClick={() => setIsEditingProfile(false)} className="bg-slate-700 text-slate-300 px-3 py-1.5 rounded text-xs hover:bg-slate-600">Annuler</button>
                                    </div>
                                </form>
                            )}
                        </section>
                    </div>

                    {/* SECTION 2: SÉCURITÉ */}
                    <div className="space-y-6">
                        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                            <h2 className="text-sm font-medium text-slate-100 mb-4">{t("profile.security.title")}</h2>
                            
                            {!showPasswordForm ? (
                                <button
                                    onClick={() => setShowPasswordForm(true)}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800"
                                >
                                    {t("profile.security.changePassword")}
                                </button>
                            ) : (
                                <form onSubmit={handleChangePassword} className="space-y-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                    <input 
                                        type="password" 
                                        placeholder="Mot de passe actuel"
                                        value={passwords.current}
                                        onChange={e => setPasswords({...passwords, current: e.target.value})}
                                        className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs"
                                        required
                                    />
                                    <input 
                                        type="password" 
                                        placeholder="Nouveau mot de passe"
                                        value={passwords.new}
                                        onChange={e => setPasswords({...passwords, new: e.target.value})}
                                        className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-xs"
                                        required
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <button type="button" onClick={() => setShowPasswordForm(false)} className="text-xs text-slate-400 hover:text-white">Annuler</button>
                                        <button type="submit" className="bg-brand-600 text-white px-3 py-1 rounded text-xs">Valider</button>
                                    </div>
                                </form>
                            )}
                        </section>

                        <section className="rounded-2xl border border-red-900/30 bg-red-900/10 p-5">
                            <h2 className="text-sm font-medium text-red-200 mb-2">Zone Danger</h2>
                            {!showDeleteConfirm ? (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="text-xs text-red-400 hover:text-red-300 underline"
                                >
                                    Supprimer mon compte
                                </button>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-xs text-red-300">Cette action est irréversible. Entrez votre mot de passe pour confirmer.</p>
                                    <input 
                                        type="password" 
                                        placeholder="Votre mot de passe"
                                        value={deletePassword}
                                        onChange={e => setDeletePassword(e.target.value)}
                                        className="w-full bg-slate-900 border border-red-900/50 rounded p-2 text-xs text-red-100 placeholder-red-900/50"
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={handleDeleteAccount} className="bg-red-600 text-white px-3 py-1.5 rounded text-xs hover:bg-red-500 w-full">Confirmer suppression</button>
                                        <button onClick={() => setShowDeleteConfirm(false)} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded text-xs w-full">Annuler</button>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProfilePage;
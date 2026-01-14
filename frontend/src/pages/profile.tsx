// frontend/src/pages/profile.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "@/language/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { changePassword, deleteAccount } from "@/services/authService";
import { getUserProfile, updateUserProfileInfo } from "@/services/userProfileService";

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

    const email = (user as any)?.email ?? "";
    const greetingName = pseudo || email || t("common.user");

    const inputClass =
        "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-green-400/40 focus:ring-2 focus:ring-green-400/20";
    const labelClass = "mb-1 block text-xs font-medium text-white/70";

    // Charger les infos du profil au montage
    useEffect(() => {
        if (user) {
            const userId = (user as any).id || (user as any).user_id;

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
            setMessage({
                type: "error",
                text: err.response?.data?.error || "Erreur mot de passe.",
            });
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteAccount(deletePassword);
            logout();
        } catch (err: any) {
            setMessage({
                type: "error",
                text: err.response?.data?.error || "Impossible de supprimer le compte.",
            });
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
                <div className="mx-auto max-w-4xl space-y-6">
                    {/* Header */}
                    <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-white/45">
                                {t("profile.title")}
                            </p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                                {t("profile.greeting")}, {greetingName} 👋
                            </h1>
                            <p className="mt-2 text-sm text-white/65">
                                {t("profile.subtitle") ?? "Gérez vos informations et la sécurité de votre compte."}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="rounded-xl border border-white/10 bg-white/5 px-2 py-1">
                                <LanguageSwitcher />
                            </div>

                            <button
                                onClick={logout}
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                            >
                                {t("common.logout")}
                            </button>
                        </div>
                    </header>

                    {/* Feedback Message */}
                    {message.text && (
                        <div
                            className={[
                                "rounded-xl border px-4 py-3 text-sm",
                                message.type === "success"
                                    ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
                                    : "border-red-500/20 bg-red-500/10 text-red-200",
                            ].join(" ")}
                        >
                            {message.text}
                        </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* SECTION 1: PROFIL & PRÉFÉRENCES */}
                        <div className="space-y-6">
                            <GlassCard>
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-sm font-semibold text-white/90">
                                            {t("profile.account.title")}
                                        </h2>
                                        <p className="mt-1 text-xs text-white/55">
                                            Infos visibles dans l’application.
                                        </p>
                                    </div>

                                    {!isEditingProfile && (
                                        <button
                                            onClick={() => setIsEditingProfile(true)}
                                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                                        >
                                            Modifier
                                        </button>
                                    )}
                                </div>

                                {!isEditingProfile ? (
                                    <div className="mt-5 space-y-4 text-sm">
                                        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                                            <p className="text-xs font-medium uppercase tracking-wide text-white/45">
                                                Pseudo
                                            </p>
                                            <p className="mt-1 text-white/90">{pseudo || "Non défini"}</p>
                                        </div>

                                        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                                            <p className="text-xs font-medium uppercase tracking-wide text-white/45">
                                                Genre
                                            </p>
                                            <p className="mt-1 text-white/90">{genre || "Non défini"}</p>
                                        </div>

                                        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                                            <p className="text-xs font-medium uppercase tracking-wide text-white/45">
                                                Email
                                            </p>
                                            <p className="mt-1 text-white/70">{email || "—"}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleUpdateProfile} className="mt-5 space-y-4">
                                        <div>
                                            <label className={labelClass}>Pseudo</label>
                                            <input
                                                type="text"
                                                value={pseudo}
                                                onChange={(e) => setPseudo(e.target.value)}
                                                className={inputClass}
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClass}>Genre</label>
                                            <select
                                                value={genre}
                                                onChange={(e) => setGenre(e.target.value)}
                                                className={inputClass}
                                            >
                                                <option className="bg-gray-950" value="Autre">
                                                    Autre / Non précisé
                                                </option>
                                                <option className="bg-gray-950" value="Homme">
                                                    Homme
                                                </option>
                                                <option className="bg-gray-950" value="Femme">
                                                    Femme
                                                </option>
                                            </select>
                                        </div>

                                        <div className="flex justify-end gap-2 pt-1">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingProfile(false)}
                                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                                            >
                                                Annuler
                                            </button>

                                            <button
                                                type="submit"
                                                className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(16,185,129,0.55)] transition hover:brightness-110"
                                            >
                                                Enregistrer
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </GlassCard>
                        </div>

                        {/* SECTION 2: SÉCURITÉ */}
                        <div className="space-y-6">
                            <GlassCard>
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-sm font-semibold text-white/90">
                                            {t("profile.security.title")}
                                        </h2>
                                        <p className="mt-1 text-xs text-white/55">
                                            Mot de passe et actions sensibles.
                                        </p>
                                    </div>

                                    {!showPasswordForm && (
                                        <button
                                            onClick={() => setShowPasswordForm(true)}
                                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                                        >
                                            {t("profile.security.changePassword")}
                                        </button>
                                    )}
                                </div>

                                {showPasswordForm && (
                                    <form onSubmit={handleChangePassword} className="mt-5 space-y-3">
                                        <div>
                                            <label className={labelClass}>Mot de passe actuel</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                value={passwords.current}
                                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                                className={inputClass}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClass}>Nouveau mot de passe</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                value={passwords.new}
                                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                                className={inputClass}
                                                required
                                            />
                                        </div>

                                        <div className="flex justify-end gap-2 pt-1">
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswordForm(false)}
                                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                                            >
                                                Annuler
                                            </button>

                                            <button
                                                type="submit"
                                                className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(16,185,129,0.55)] transition hover:brightness-110"
                                            >
                                                Valider
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </GlassCard>

                            {/* Danger Zone (texte comme avant) */}
                            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.65)]">
                                <h2 className="text-sm font-medium text-red-200 mb-2">
                                    Vous voulez vraiment partir ?
                                </h2>

                                {!showDeleteConfirm ? (
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="text-xs font-semibold text-red-200/80 underline decoration-red-300/40 underline-offset-4 hover:text-red-100"
                                    >
                                        Supprimer mon compte
                                    </button>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-xs text-red-200/80">
                                            Cette action est irréversible. Entrez votre mot de passe pour confirmer.
                                        </p>

                                        <input
                                            type="password"
                                            placeholder="Votre mot de passe"
                                            value={deletePassword}
                                            onChange={(e) => setDeletePassword(e.target.value)}
                                            className="w-full rounded-xl border border-red-500/20 bg-black/20 px-4 py-2.5 text-sm text-red-100 placeholder:text-red-200/40 outline-none transition focus:ring-2 focus:ring-red-400/20"
                                        />

                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={handleDeleteAccount}
                                                className="w-full rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
                                            >
                                                Confirmer suppression
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setShowDeleteConfirm(false)}
                                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
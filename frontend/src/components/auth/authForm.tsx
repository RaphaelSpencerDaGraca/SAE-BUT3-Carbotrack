// frontend/src/components/auth/authForm.tsx
import React, { useState } from "react";
import InputField from "../ui/inputField";
import Alert from "../ui/alert";
import { Link } from "react-router-dom";

interface AuthFormProps {
    type: "login" | "register";
    onSubmit: (email: string, password: string, name?: string) => Promise<void>;
}

const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path
            d="M4 6.75A2.75 2.75 0 0 1 6.75 4h10.5A2.75 2.75 0 0 1 20 6.75v10.5A2.75 2.75 0 0 1 17.25 20H6.75A2.75 2.75 0 0 1 4 17.25V6.75Z"
            stroke="currentColor"
            strokeWidth="1.5"
        />
        <path
            d="M6.5 7.5 12 12l5.5-4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path
            d="M7 10V8a5 5 0 0 1 10 0v2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
        <path
            d="M6.5 10h11A2.5 2.5 0 0 1 20 12.5v6A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5v-6A2.5 2.5 0 0 1 6.5 10Z"
            stroke="currentColor"
            strokeWidth="1.5"
        />
    </svg>
);

const Spinner = () => (
    <span className="inline-flex items-center gap-2">
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
    <span>Connexion…</span>
  </span>
);

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
    const isRegister = type === "register";
    const [formData, setFormData] = useState({ email: "", password: "", pseudo: "" });
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPwd, setShowPwd] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;
        setIsLoading(true);
        setError("");

        const email = formData.email.trim();
        const password = formData.password;
        const pseudo = formData.pseudo.trim();

        try {
            if (isRegister && !pseudo) throw new Error("Le pseudo est requis.");
            await onSubmit(email, password, isRegister ? pseudo : undefined);
        } catch (err: any) {
            setError(err?.message || "Une erreur est survenue");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-3xl font-semibold tracking-tight text-white">
                    {isRegister ? "Créer un compte" : "Se connecter"}
                </h2>
                <p className="mt-2 text-sm text-white/70">
                    {isRegister
                        ? "Rejoignez Carbotrack en quelques secondes."
                        : "Accédez à votre tableau de bord et à vos statistiques."}
                </p>
            </div>

            {error && <Alert type="error" message={error} className="mb-4" />}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {isRegister && (
                    <div>
                        <label className="mb-1 block text-sm font-medium text-white/80" htmlFor="pseudo">
                            Pseudo
                        </label>
                        <InputField
                            id="pseudo"
                            type="text"
                            name="pseudo"
                            value={formData.pseudo}
                            onChange={handleChange}
                            placeholder="Votre pseudo"
                            autoComplete="nickname"
                            required
                        />
                    </div>
                )}

                <div>
                    <label className="mb-1 block text-sm font-medium text-white/80" htmlFor="email">
                        Email
                    </label>
                    <div className="relative">
                        <MailIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />
                        <InputField
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            autoComplete="email"
                            required
                            className="pl-11"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-white/80" htmlFor="password">
                        Mot de passe
                    </label>
                    <div className="relative">
                        <LockIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />
                        <InputField
                            id="password"
                            type={showPwd ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            autoComplete={isRegister ? "new-password" : "current-password"}
                            required
                            className="pl-11 pr-20"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPwd((s) => !s)}
                            className="absolute inset-y-0 right-2 my-auto rounded-lg px-3 text-xs font-medium text-white/60 hover:text-white transition"
                            aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        >
                            {showPwd ? "Masquer" : "Afficher"}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={[
                        "w-full rounded-xl py-2.5 text-sm font-semibold text-white",
                        "bg-gradient-to-r from-green-600 to-emerald-600",
                        "shadow-[0_10px_30px_-12px_rgba(16,185,129,0.55)]",
                        "transition hover:brightness-110 active:brightness-95",
                        "disabled:cursor-not-allowed disabled:opacity-70",
                    ].join(" ")}
                >
                    {isLoading ? <Spinner /> : isRegister ? "Créer mon compte" : "Se connecter"}
                </button>

                <div className="pt-2 text-center">
                    {!isRegister && (
                        <Link to="/forgot-password" className="text-sm font-medium text-green-300 hover:underline">
                            Mot de passe oublié ?
                        </Link>
                    )}

                    <div className="mt-3 text-sm text-white/70">
                        {isRegister ? (
                            <>
                                Vous avez déjà un compte ?{" "}
                                <Link to="/login" className="font-medium text-green-300 hover:underline">
                                    Connectez-vous
                                </Link>
                            </>
                        ) : (
                            <>
                                Vous n’avez pas de compte ?{" "}
                                <Link to="/register" className="font-medium text-green-300 hover:underline">
                                    Inscrivez-vous
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AuthForm;

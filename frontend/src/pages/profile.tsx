//frontend\src\pages\profile.tsx
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "@/language/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const { t } = useTranslation();

    const displayName =
        (user as any)?.pseudo ||
        (user as any)?.name ||
        (user as any)?.email?.split?.("@")?.[0] ||
        t("common.user");

    const email = (user as any)?.email ?? t("common.email.placeholder");

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 px-4 pb-24 pt-6">
            <div className="mx-auto max-w-4xl space-y-6">

                <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            {t("profile.title")}
                        </p>

                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                            {t("profile.greeting")}, {displayName} 👋
                        </h1>

                        <p className="mt-1 text-sm text-slate-400">
                            {t("profile.subtitle")}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />

                        <button
                            type="button"
                            onClick={logout}
                            className="inline-flex items-center justify-center rounded-full border border-red-500/60 bg-red-500/10 px-4 py-1.5 text-xs font-medium text-red-200 shadow-sm hover:bg-red-500/20"
                        >
                            {t("common.logout")}
                        </button>
                    </div>
                </header>

                <section className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 md:p-5">
                        <h2 className="text-sm font-medium text-slate-100">
                            {t("profile.account.title")}
                        </h2>

                        <div className="mt-4 space-y-3 text-sm">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500">
                                    {t("profile.account.displayName")}
                                </p>
                                <p className="mt-1 text-slate-100">{displayName}</p>
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500">
                                    {t("profile.account.email")}
                                </p>
                                <p className="mt-1 text-slate-100 break-all">{email}</p>
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500">
                                    {t("profile.account.organization")}
                                </p>
                                <p className="mt-1 text-slate-400">
                                    {t("profile.account.organization.placeholder")}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 md:p-5">
                            <h2 className="text-sm font-medium text-slate-100">
                                {t("profile.security.title")}
                            </h2>
                            <p className="mt-3 text-sm text-slate-400">
                                {t("profile.security.text")}
                            </p>

                            <div className="mt-4 space-y-2">
                                <button
                                    type="button"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800/80"
                                >
                                    {t("profile.security.changePassword")}
                                </button>

                                <button
                                    type="button"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800/80"
                                >
                                    {t("profile.security.sessions")}
                                </button>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 md:p-5">
                            <h2 className="text-sm font-medium text-slate-100">
                                {t("profile.preferences.title")}
                            </h2>
                            <p className="mt-3 text-sm text-slate-400">
                                {t("profile.preferences.text")}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default ProfilePage;

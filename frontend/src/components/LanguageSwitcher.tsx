//frontend\src\language\LanguageSwitcher.tsx
import { supportedLanguages } from "@/language/translations.ts";
import { useTranslation } from "@/language/useTranslation.ts";

const LanguageSwitcher = () => {
    const { language, setLanguage, t } = useTranslation();

    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-2 py-1 text-xs">
            <span className="text-slate-400">{t("switcher.label")}</span>
            <div className="flex rounded-full bg-slate-950/60 p-0.5">
                {supportedLanguages.map((lang) => (
                    <button
                        key={lang}
                        type="button"
                        onClick={() => setLanguage(lang)}
                        className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            language === lang ? "bg-emerald-500/80 text-slate-950" : "text-slate-300"
                        }`}
                    >
                        {lang.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LanguageSwitcher;

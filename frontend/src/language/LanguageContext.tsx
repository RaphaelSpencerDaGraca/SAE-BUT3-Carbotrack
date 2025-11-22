//frontend\src\language\LanguageContext.tsx
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { Language, translations } from "./translations";

type LanguageContextValue = {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "app_language";

type LanguageProviderProps = {
    children: ReactNode;
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
    const [language, setLanguageState] = useState<Language>("fr");

    useEffect(() => {
        const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null;
        if (stored === "fr" || stored === "en") {
            setLanguageState(stored);
            return;
        }
        const browserLang = navigator.language.startsWith("fr") ? "fr" : "en";
        setLanguageState(browserLang as Language);
        window.localStorage.setItem(STORAGE_KEY, browserLang);
    }, []);

    const setLanguage = (value: Language) => {
        setLanguageState(value);
        window.localStorage.setItem(STORAGE_KEY, value);
    };

    const value = useMemo(
        () => ({
            language,
            setLanguage,
            t: (key: string) => translations[language][key] ?? key
        }),
        [language]
    );

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguageContext = () => {
    const ctx = useContext(LanguageContext);
    if (!ctx) {
        throw new Error("LanguageContext is not available");
    }
    return ctx;
};

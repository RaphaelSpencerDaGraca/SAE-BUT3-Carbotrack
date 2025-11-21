//frontend\src\language\useTranslation.ts
import { useLanguageContext } from "./LanguageContext";

export const useTranslation = () => {
    const { t, language, setLanguage } = useLanguageContext();
    return { t, language, setLanguage };
};

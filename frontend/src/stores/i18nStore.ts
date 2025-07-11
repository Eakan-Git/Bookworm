import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18next from "i18next";
import { Language } from "@/types/language";

type LocaleState = {
    language: Language;
    setLanguage: (lang: Language) => void;
};

export const useI18nStore = create(
    persist<LocaleState>(
        (set) => ({
            language: "en-US",
            setLanguage: (lang) => {
                i18next.changeLanguage(lang);
                set({ language: lang });
            },
        }),
        {
            name: "i18n-storage",
        }
    )
);

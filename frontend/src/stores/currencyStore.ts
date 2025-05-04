import { create } from "zustand";
import { persist } from "zustand/middleware";
import { currencyConfig } from "@/configs/currencyConfig";
import { Currency } from "@/types/currency";
import { useI18nStore } from "@/stores/i18nStore";

interface CurrencyState {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    syncWithLanguage: () => void;
}

export const useCurrencyStore = create<CurrencyState>()(
    persist(
        (set) => ({
            currency: currencyConfig.default as Currency,
            setCurrency: (currency) => set({ currency }),
            syncWithLanguage: () => {
                const language = useI18nStore.getState().language;
                const currencyForLanguage = currencyConfig.getCurrencyForLocale(language);
                set({ currency: currencyForLanguage });
            }
        }),
        {
            name: "currency-store",
        }
    )
);

// Subscribe to language changes to automatically update currency
useI18nStore.subscribe(
    (state) => state.language,
    (language) => {
        const currencyForLanguage = currencyConfig.getCurrencyForLocale(language);
        useCurrencyStore.getState().setCurrency(currencyForLanguage);
    }
);

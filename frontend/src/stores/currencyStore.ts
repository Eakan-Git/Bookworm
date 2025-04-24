import { create } from "zustand";
import { persist } from "zustand/middleware";
import { currencyConfig } from "@/configs/currencyConfig";
import { Currency } from "@/types/currency";

interface CurrencyState {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
    persist(
        (set) => ({
            currency: currencyConfig.default as Currency,
            setCurrency: (currency) => set({ currency }),
        }),
        {
            name: "currency-store",
        }
    )
);

import { CURRENCIES, Currency } from "@/types/currency";

// Define a more structured mapping between currencies and languages
type CurrencyLocaleMap = {
    [key in Currency]?: string;
};

type LocaleCurrencyMap = {
    [key: string]: Currency;
};

// Map currencies to their corresponding locales
const currencyToLocale: CurrencyLocaleMap = {
    USD: "en-US",
    VND: "vi-VN",
    THB: "th-TH",
};

// Map locales to their corresponding currencies
const localeToCurrency: LocaleCurrencyMap = {
    "en-US": "USD",
    "vi-VN": "VND",
    "th-TH": "THB",
};

export const currencyConfig = {
    default: CURRENCIES[0] as Currency,
    exchangeRates: {
        USD: 1,
        VND: 24000,
        THB: 33.53,
    },

    names: {
        USD: "US Dollar",
        VND: "Vietnamese Dong",
        THB: "Thai Baht",
    },

    flags: {
        USD: "🇺🇸",
        VND: "🇻🇳",
        THB: "🇹🇭",
    },

    // Decimal places configuration for each currency
    decimalPlaces: {
        USD: 2,
        VND: 0,
        THB: 2,
    },

    // Use the mapping for locales
    locales: currencyToLocale,

    // Add a function to get currency from locale
    getCurrencyForLocale: (locale: string): Currency => {
        return localeToCurrency[locale] || "USD";
    },
};

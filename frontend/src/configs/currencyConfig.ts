import { CURRENCIES, Currency } from "@/types/currency";

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

    locales: {
        USD: "en-US",
        VND: "vi-VN",
        THB: "th-TH",
    },
};

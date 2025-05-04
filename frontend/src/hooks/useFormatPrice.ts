import { currencyConfig } from "@/configs/currencyConfig";
import { Currency } from "@/types/currency";
import { useCurrencyStore } from "@/stores/currencyStore";
import { useMemo } from "react";

/**
 * Format a price in USD to the specified currency
 * This is a non-reactive function that gets the current currency state
 * when it's called. It won't automatically update when currency changes.
 *
 * @param amountUSD The amount in USD to format
 * @param currency Optional currency to use (defaults to the currently selected currency)
 * @param options Optional Intl.NumberFormatOptions to customize the formatting
 * @returns Formatted currency string
 */
export function formatPrice(amountUSD: number, currency?: Currency, options?: Intl.NumberFormatOptions): string {
    // Use provided currency or get from store
    const currencyToUse = currency || useCurrencyStore.getState().currency;

    // Convert amount based on exchange rate
    const rate = currencyConfig.exchangeRates[currencyToUse];
    const convertedAmount = amountUSD * rate;

    // Get the locale that corresponds to this currency
    const locale = currencyConfig.locales[currencyToUse] || "en-US";

    // Get decimal places from config
    const decimalPlaces = currencyConfig.decimalPlaces[currencyToUse] ?? 2;

    // Default formatting options
    const defaultOptions: Intl.NumberFormatOptions = {
        style: "currency",
        currency: currencyToUse,
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    };

    // Merge default options with any custom options
    const formattingOptions = { ...defaultOptions, ...options };

    return new Intl.NumberFormat(locale, formattingOptions).format(convertedAmount);
}

/**
 * React hook for formatting prices that updates when currency changes
 * Use this in React components for reactive price formatting
 *
 * @param amountUSD The amount in USD to format
 * @param options Optional Intl.NumberFormatOptions to customize the formatting
 * @returns Formatted currency string
 */
export function useFormatPrice(amountUSD: number, options?: Intl.NumberFormatOptions): string {
    const currency = useCurrencyStore(state => state.currency);

    return useMemo(() => {
        // Convert amount based on exchange rate
        const rate = currencyConfig.exchangeRates[currency];
        const convertedAmount = amountUSD * rate;

        // Get the locale that corresponds to this currency
        const locale = currencyConfig.locales[currency] || "en-US";

        // Get decimal places from config
        const decimalPlaces = currencyConfig.decimalPlaces[currency] ?? 2;

        // Default formatting options
        const defaultOptions: Intl.NumberFormatOptions = {
            style: "currency",
            currency,
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
        };

        // Merge default options with any custom options
        const formattingOptions = { ...defaultOptions, ...options };

        return new Intl.NumberFormat(locale, formattingOptions).format(convertedAmount);
    }, [amountUSD, currency, options]);
}

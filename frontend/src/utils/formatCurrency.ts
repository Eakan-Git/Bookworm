import { currencyConfig } from "@/configs/currencyConfig";
import { Currency } from "@/types/currency";

export function formatPrice(amountUSD: number, currency: Currency): string {
    const rate = currencyConfig.exchangeRates[currency];
    const convertedAmount = amountUSD * rate;

    const formatter = new Intl.NumberFormat(currencyConfig.locales[currency], {
        style: "currency",
        currency,
    });

    return formatter.format(convertedAmount);
}

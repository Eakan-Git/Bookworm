import { useCurrencyStore } from "@/stores/currencyStore";
import { currencyConfig } from "@/configs/currencyConfig";
import { CURRENCIES, Currency } from "@/types/currency";

export default function CurrencySelector() {
    const { currency, setCurrency } = useCurrencyStore();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrency(e.target.value as Currency);
    };

    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">Select Currency</legend>
            <select
                defaultValue={currency}
                className="select select-bordered w-full max-w-xs"
                onChange={handleChange}
            >
                {CURRENCIES.map((currencyCode) => (
                    <option key={currencyCode} value={currencyCode}>
                        {currencyConfig.flags[currencyCode]} {currencyConfig.names[currencyCode]}
                    </option>
                ))}
            </select>
        </fieldset>
    );
}

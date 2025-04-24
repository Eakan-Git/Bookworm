import { useCurrencyStore } from "@/stores/currencyStore";
import { formatPrice } from "@/utils/formatCurrency";

interface PriceDisplayProps {
    price: number;
    className?: string;
}

export default function PriceDisplay({ price, className }: PriceDisplayProps) {
    const currency = useCurrencyStore(state => state.currency);
    return (
        <p className={className}>
            {formatPrice(price, currency)}
        </p>
    );
}

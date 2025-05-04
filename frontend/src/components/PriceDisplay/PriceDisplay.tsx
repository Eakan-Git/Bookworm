import { useFormatPrice } from "@/hooks/useFormatPrice";

interface PriceDisplayProps {
    price: number;
    className?: string;
}

export default function PriceDisplay({ price, className }: PriceDisplayProps) {
    const formattedPrice = useFormatPrice(price);

    return (
        <p className={className}>
            {formattedPrice}
        </p>
    );
}
